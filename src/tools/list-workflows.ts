/**
 * list_workflows tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse, convertToJsonSchema } from "./base-tool.js";

export type ListWorkflowsArgs = {
  active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
  raw?: boolean;
};

const listWorkflowsSchema = z.object({
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  raw: z.boolean().optional(),
});

export function createListWorkflowsTool(
  context: ToolContext
): ToolDefinition<ListWorkflowsArgs> {
  return {
    name: "list_workflows",
    description: "List n8n workflows with optional filtering. Use raw=true to get full workflow details.",
    inputSchema: convertToJsonSchema(listWorkflowsSchema),
    handler: async (args: ListWorkflowsArgs) => {
      const { raw, ...apiArgs } = args;

      // Filter out undefined values for exactOptionalPropertyTypes compatibility
      const filteredArgs = Object.fromEntries(
        Object.entries(apiArgs).filter(([_, v]) => v !== undefined)
      );

      const workflows = await context.n8nClient.getWorkflows(filteredArgs);
      const response = context.responseBuilder.createListWorkflowsResponse(
        workflows,
        raw || false
      );

      return createToolResponse(response);
    },
  };
}
