/**
 * delete_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";

interface DeleteWorkflowArgs {
  id: string;
}

export function createDeleteWorkflowTool(
  context: ToolContext
): ToolDefinition<DeleteWorkflowArgs> {
  return {
    name: "delete_workflow",
    description: "Delete a workflow",
    inputSchema: {
      id: z.string(),
    },
    handler: async (args) => {
      await context.n8nClient.deleteWorkflow(args.id);
      return createToolResponse(`Workflow ${args.id} deleted successfully`);
    },
  };
}
