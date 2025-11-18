/**
 * Base tool abstract class
 */

import type { ZodSchema } from "zod";
import type { ToolContext, ToolDefinition, ToolResponse } from "../base-tool.js";
import { createToolResponse, convertToJsonSchema } from "../base-tool.js";
import { logger } from "../../utils/logger.js";

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
      const logPayload = { error };
      logger.error(`[${this.name}] Error`, logPayload);
      const responsePayload = this.extractResponsePayload(logPayload);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(responsePayload, null, 2),
          },
        ],
        isError: true,
      };
    }
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

  private extractResponsePayload(
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const error = payload.error as Record<string, unknown> | undefined;
    const context = error?.context as Record<string, unknown> | undefined;

    if (context) {
      return context;
    }

    return payload;
  }
}
