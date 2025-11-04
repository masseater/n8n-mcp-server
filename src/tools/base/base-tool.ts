/**
 * Base tool abstract class
 */

import type { ZodSchema } from "zod";
import type { ToolContext, ToolDefinition, ToolResponse } from "../base-tool.js";
import { createToolResponse, convertToJsonSchema } from "../base-tool.js";
import { logger } from "../../utils/logger.js";
import { SENSITIVE_KEYS } from "../../constants/security.js";
import type { ErrorWithContext } from "../../errors/custom-errors.js";

/**
 * JSON indentation for error serialization
 */
const JSON_INDENT_SPACES = 2;

/**
 * Abstract base class for all MCP tools
 * Implements Template Method pattern for tool definition
 */
export abstract class BaseTool<TArgs = Record<string, unknown>> {
  /**
   * Tool name (must be unique across all tools)
   */
  abstract readonly name: string;

  /**
   * Tool description for MCP clients
   */
  abstract readonly description: string;

  constructor(protected readonly context: ToolContext) {}

  /**
   * Get Zod schema for input validation
   * Override this method to define tool-specific input schema
   */
  abstract getInputSchema(): ZodSchema;

  /**
   * Execute the tool logic
   * Override this method to implement tool-specific behavior
   * @param args - Validated input arguments
   * @returns Tool execution result
   */
  abstract execute(args: TArgs): Promise<unknown>;

  /**
   * Default handler that wraps execute() with response creation
   * Handles errors and returns error response with isError flag
   *
   * Error handling strategy:
   * - Catches all errors thrown by execute()
   * - Logs error details for debugging (without sensitive information)
   * - Returns error.message to AI client for appropriate action
   * - Sets isError: true to indicate error state
   *
   * Can be overridden if custom response handling is needed
   */
  async handler(args: TArgs): Promise<ToolResponse> {
    try {
      const result = await this.execute(args);
      return createToolResponse(result);
    } catch (error) {
      // Log error for debugging (error object does not contain sensitive args)
      logger.error(`[${this.name}] Error`, { error });

      // Return the same error information that's logged to terminal
      return {
        content: [
          {
            type: "text",
            text: this.serializeError(error),
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Serialize error object to JSON string (same format as terminal logs)
   * Includes all error properties: name, message, statusCode, context, stack
   */
  private serializeError(error: unknown): string {
    if (!(error instanceof Error)) {
      return JSON.stringify({ error: String(error) }, null, JSON_INDENT_SPACES);
    }

    // Serialize error with all enumerable and non-enumerable properties
    const errorObj: Record<string, unknown> = {
      name: error.name,
      message: error.message,
    };

    // Add custom properties from CustomError classes
    const errorWithContext = error as ErrorWithContext;

    if (errorWithContext.statusCode !== undefined) {
      errorObj.statusCode = errorWithContext.statusCode;
    }

    if (errorWithContext.context) {
      // Filter out sensitive information using functional approach
      const filteredContext = Object.entries(errorWithContext.context)
        .filter(([key]) => !SENSITIVE_KEYS.has(key))
        .reduce<Record<string, unknown>>((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      errorObj.context = filteredContext;
    }

    // Include stack trace in development mode
    if (process.env.NODE_ENV === 'development' && error.stack) {
      errorObj.stack = error.stack;
    }

    return JSON.stringify(errorObj, null, JSON_INDENT_SPACES);
  }

  /**
   * Convert this tool instance to a ToolDefinition
   * Used by ToolRegistry for MCP server registration
   */
  toDefinition(): ToolDefinition<TArgs> {
    return {
      name: this.name,
      description: this.description,
      inputSchema: convertToJsonSchema(this.getInputSchema()),
      handler: this.handler.bind(this),
    };
  }
}
