/**
 * get_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";

interface GetWorkflowArgs {
  id: string;
  raw?: boolean;
}

export function createGetWorkflowTool(
  context: ToolContext
): ToolDefinition<GetWorkflowArgs> {
  return {
    name: "get_workflow",
    description: "Get detailed information about a specific workflow. Use raw=true to get full workflow details including nodes and connections.",
    inputSchema: {
      id: z.string(),
      raw: z.boolean().optional(),
    },
    handler: async (args) => {
      const workflow = await context.n8nClient.getWorkflow(args.id);
      const response = context.optimizer.createGetWorkflowResponse(
        workflow,
        args.raw || false
      );
      return createToolResponse(response);
    },
  };
}
