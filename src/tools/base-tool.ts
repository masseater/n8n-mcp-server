/**
 * Base tool interface and utilities for MCP tools
 */

import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import type { ListWorkflowsArgs } from "./implementations/list-workflows-tool.js";
import type { GetWorkflowArgs } from "./implementations/get-workflow-tool.js";
import type { CreateWorkflowArgs } from "./implementations/create-workflow-tool.js";
import type { UpdateWorkflowArgs } from "./implementations/update-workflow-tool.js";
import type { DeleteWorkflowArgs } from "./implementations/delete-workflow-tool.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ZodSchema } from "zod";

/**
 * MCP tool handler function type
 */
type ToolHandler<TArgs = Record<string, unknown>> = (
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
export type ToolDefinition<TArgs = Record<string, unknown>> = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: ToolHandler<TArgs>;
}

/**
 * Tool schema without handler (for listing tools)
 */
export type ToolSchema = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/**
 * Union type of all tool definitions
 */
export type AnyToolDefinition =
  | ToolDefinition<ListWorkflowsArgs>
  | ToolDefinition<GetWorkflowArgs>
  | ToolDefinition<CreateWorkflowArgs>
  | ToolDefinition<UpdateWorkflowArgs>
  | ToolDefinition<DeleteWorkflowArgs>
  | ToolDefinition;

/**
 * Base context for all tools
 */
export type ToolContext = {
  n8nClient: N8nApiClientImpl;
  responseBuilder: ToolResponseBuilder;
}

/**
 * Tool response type
 */
export type ToolResponse = {
  content: {
    type: "text";
    text: string;
  }[];
};

/**
 * Create a standardized tool response
 */
export function createToolResponse(data: unknown): ToolResponse {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Convert Zod schema to JSON Schema format
 */
export function convertToJsonSchema(schema: ZodSchema): Record<string, unknown> {
  const jsonSchema = zodToJsonSchema(schema, {
    target: "openApi3",
    $refStrategy: "none",
  });

  // Remove $schema and other metadata fields
  if (typeof jsonSchema === "object") {
    const { $schema: _$schema, definitions: _definitions, ...cleanSchema } = jsonSchema as Record<string, unknown>;
    return cleanSchema;
  }

  return jsonSchema as Record<string, unknown>;
}
