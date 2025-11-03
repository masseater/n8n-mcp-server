/**
 * Custom error classes for n8n MCP server
 */

/**
 * Base error class for all custom errors
 */
class N8nMcpError extends Error {
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends N8nMcpError {}

/**
 * Error thrown when n8n API call fails
 */
export class ApiError extends N8nMcpError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    context?: Record<string, unknown>,
    options?: ErrorOptions
  ) {
    super(message, context, options);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends N8nMcpError {}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends N8nMcpError {}

/**
 * Error thrown when file operations fail
 */
export class FileError extends N8nMcpError {
  constructor(
    message: string,
    public readonly filePath?: string,
    context?: Record<string, unknown>,
    options?: ErrorOptions
  ) {
    super(message, context, options);
  }
}
