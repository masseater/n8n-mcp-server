/**
 * Centralized API error handling utilities
 */

import { ApiError, NotFoundError, ValidationError } from './custom-errors.js';

type ApiResponse<T> = {
  data?: T;
  error?: unknown;
};

type ErrorContext = {
  operation: string;
  resourceType?: string;
  resourceId?: string;
  additionalInfo?: Record<string, unknown>;
};

/**
 * Handle API response and convert errors to custom error types
 */
export function handleResponse<T>(
  response: ApiResponse<T>,
  context: ErrorContext
): NonNullable<T> {
  if (response.error) {
    return handleApiError(response.error, context);
  }

  if (!response.data) {
    throw new NotFoundError(
      `No data returned for ${context.operation}`,
      {
        operation: context.operation,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        ...context.additionalInfo,
      }
    );
  }

  // Check if response is HTML (indicates wrong endpoint or error page)
  if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE')) {
    throw new ApiError(
      `Received HTML response instead of JSON for ${context.operation}. Check API endpoint URL.`,
      undefined,
      {
        operation: context.operation,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        ...context.additionalInfo,
      }
    );
  }

  return response.data;
}

/**
 * Handle API error responses
 */
function handleApiError(
  error: unknown,
  context: ErrorContext
): never {
  const errorObj = error && typeof error === 'object' ? error as Record<string, unknown> : {};
  const status = typeof errorObj.status === 'number' ? errorObj.status : undefined;
  const apiErrorMessage = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error';

  if (status === 404) {
    // Build detailed not found message using array approach
    const baseMessage = `${context.resourceType ?? 'Resource'} not found`;
    const messageParts = [
      context.resourceId ? `${baseMessage}: ${context.resourceId}` : baseMessage
    ];

    if (apiErrorMessage !== 'Unknown error' && !apiErrorMessage.includes('404')) {
      messageParts.push(`(${apiErrorMessage})`);
    }

    throw new NotFoundError(messageParts.join(' '), {
      operation: context.operation,
      resourceType: context.resourceType,
      resourceId: context.resourceId,
      ...context.additionalInfo,
    });
  }

  // Build detailed error message using array approach
  const messageParts = [`Failed to ${context.operation}`];

  // Add resource info if available
  if (context.resourceType) {
    const resourceParts = [`for ${context.resourceType}`];
    if (context.resourceId) {
      resourceParts.push(`'${context.resourceId}'`);
    }
    messageParts.push(resourceParts.join(' '));
  }

  // Add HTTP status if available
  if (status !== undefined) {
    messageParts.push(`(HTTP ${String(status)})`);
  }

  throw new ApiError(messageParts.join(' '), status, {
    operation: context.operation,
    resourceType: context.resourceType,
    resourceId: context.resourceId,
    errorDetails: apiErrorMessage,
    ...context.additionalInfo,
  });
}

/**
 * Validate required field
 */
export function validateRequired(
  value: unknown,
  fieldName: string,
  context?: Record<string, unknown>
): asserts value {
  if (value === null || value === undefined) {
    throw new ValidationError(
      `${fieldName} is required`,
      context
    );
  }
}

/**
 * Wrap async operations with error handling
 */
export async function wrapAsync<T>(
  operation: () => Promise<T>,
  context: ErrorContext
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      `Failed to ${context.operation}`,
      undefined,
      {
        operation: context.operation,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        ...context.additionalInfo,
      },
      { cause: error }
    );
  }
}
