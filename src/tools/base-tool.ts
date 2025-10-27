/**
 * Base tool interface and utilities for MCP tools
 */

import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";

/**
 * MCP tool handler function type
 */
export type ToolHandler<TArgs = Record<string, unknown>> = (
  args: TArgs
) => Promise<{
  content: {
    type: string;
    text: string;
  }[];
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
  responseBuilder: ToolResponseBuilder;
}

/**
 * Create a standardized tool response
 */
export function createToolResponse(data: unknown): {
  content: {
    type: "text";
    text: string;
  }[];
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
