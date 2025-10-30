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
  const message = typeof errorObj.message === 'string' ? errorObj.message : 'Unknown error';

  if (status === 404) {
    throw new NotFoundError(
      `${context.resourceType ?? 'Resource'} not found${context.resourceId ? `: ${context.resourceId}` : ''}`,
      {
        operation: context.operation,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        ...context.additionalInfo,
      }
    );
  }

  throw new ApiError(
    `Failed to ${context.operation}`,
    status,
    {
      operation: context.operation,
      resourceType: context.resourceType,
      resourceId: context.resourceId,
      errorDetails: message,
      ...context.additionalInfo,
    }
  );
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
