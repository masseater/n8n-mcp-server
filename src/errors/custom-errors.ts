/**
 * Custom error classes for n8n MCP server
 */

/**
 * Context型定義
 */

/**
 * ApiErrorのcontext型定義
 * 既存コードとの互換性のため、全てのフィールドをオプショナルにする
 * exactOptionalPropertyTypes対応のため、undefinedを明示的に許可
 */
export type ApiErrorContext = {
  operation?: string | undefined;
  resourceType?: string | undefined;
  resourceId?: string | undefined;
  statusCode?: number | undefined;
  errorDetails?: string | undefined;
  [key: string]: unknown; // その他のプロパティを許容
};

/**
 * NotFoundErrorのcontext型定義
 * 既存コードとの互換性のため、全てのフィールドをオプショナルにする
 * exactOptionalPropertyTypes対応のため、undefinedを明示的に許可
 */
export type NotFoundErrorContext = {
  operation?: string | undefined;
  resourceType?: string | undefined;
  resourceId?: string | undefined;
  [key: string]: unknown; // その他のプロパティを許容
};

/**
 * ValidationErrorのcontext型定義
 * 既存コードとの互換性のため、全てのフィールドをオプショナルにする
 * exactOptionalPropertyTypes対応のため、undefinedを明示的に許可
 */
export type ValidationErrorContext = {
  field?: string | undefined;
  expectedType?: string | undefined;
  receivedType?: string | undefined;
  constraint?: string | undefined;
  [key: string]: unknown; // その他のプロパティを許容
};

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
export class ValidationError extends N8nMcpError {
  constructor(
    message: string,
    public override readonly context?: ValidationErrorContext,
    options?: ErrorOptions
  ) {
    super(message, context, options);
  }
}

/**
 * Error thrown when n8n API call fails
 */
export class ApiError extends N8nMcpError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    context?: ApiErrorContext,
    options?: ErrorOptions
  ) {
    super(message, context, options);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends N8nMcpError {
  constructor(
    message: string,
    public override readonly context?: NotFoundErrorContext,
    options?: ErrorOptions
  ) {
    super(message, context, options);
  }
}

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
