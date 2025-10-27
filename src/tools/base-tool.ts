import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ZodSchema } from "zod";

type ToolHandler<TArgs = Record<string, unknown>> = (
  args: TArgs
) => Promise<{
  content: {
    type: string;
    text: string;
  }[];
}>;

export type ToolDefinition<TArgs = Record<string, unknown>> = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: ToolHandler<TArgs>;
}

export type ToolSchema = Omit<ToolDefinition, "handler">;

export type ToolContext = {
  n8nClient: N8nApiClientImpl;
  responseBuilder: ToolResponseBuilder;
}

export type ToolResponse = {
  content: {
    type: "text";
    text: string;
  }[];
};

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

export function convertToJsonSchema(schema: ZodSchema): Record<string, unknown> {
  const jsonSchema = zodToJsonSchema(schema, {
    target: "openApi3",
    $refStrategy: "none",
  });

  if (typeof jsonSchema === "object") {
    const { $schema: _$schema, definitions: _definitions, ...cleanSchema } = jsonSchema as Record<string, unknown>;
    return cleanSchema;
  }

  return jsonSchema as Record<string, unknown>;
}
