/**
 * Base tool interface and utilities for MCP tools
 */

import type { ResponseOptimizer } from "../interfaces/mcp-server.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";

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
  optimizer: ResponseOptimizer;
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
