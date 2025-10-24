/**
 * Base tool interface and utilities for MCP tools
 */

import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ResponseOptimizerImpl } from "../optimizers/response-optimizer.js";

/**
 * MCP tool handler function type
 */
export type ToolHandler<TArgs = Record<string, unknown>, TResult = unknown> = (
  args: TArgs
) => Promise<{
  content: Array<{
    type: string;
    text: string;
  }>;
}>;

/**
 * MCP tool definition
 */
export interface ToolDefinition<TArgs = Record<string, unknown>> {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: ToolHandler<TArgs>;
}

/**
 * Base context for all tools
 */
export interface ToolContext {
  n8nClient: N8nApiClientImpl;
  optimizer: ResponseOptimizerImpl;
}

/**
 * Create a standardized tool response
 */
export function createToolResponse(data: unknown): {
  content: Array<{
    type: "text";
    text: string;
  }>;
} {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}
