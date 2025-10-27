/**
 * get_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse, convertToJsonSchema } from "./base-tool.js";

export type GetWorkflowArgs = {
  id: string;
  raw?: boolean;
};

const getWorkflowSchema = z.object({
  id: z.string(),
  raw: z.boolean().optional(),
});

export function createGetWorkflowTool(
  context: ToolContext
): ToolDefinition<GetWorkflowArgs> {
  return {
    name: "get_workflow",
    description: "Get detailed information about a specific workflow. Use raw=true to get full workflow details including nodes and connections.",
    inputSchema: convertToJsonSchema(getWorkflowSchema),
    handler: async (args: GetWorkflowArgs) => {
      const workflow = await context.n8nClient.getWorkflow(args.id);
      const response = context.responseBuilder.createGetWorkflowResponse(
        workflow,
        args.raw || false
      );
      return createToolResponse(response);
    },
  };
}
