/**
 * delete_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse, convertToJsonSchema } from "./base-tool.js";

export type DeleteWorkflowArgs = {
  id: string;
};

const deleteWorkflowSchema = z.object({
  id: z.string(),
});

export function createDeleteWorkflowTool(
  context: ToolContext
): ToolDefinition<DeleteWorkflowArgs> {
  return {
    name: "delete_workflow",
    description: "Delete a workflow",
    inputSchema: convertToJsonSchema(deleteWorkflowSchema),
    handler: async (args: DeleteWorkflowArgs) => {
      await context.n8nClient.deleteWorkflow(args.id);
      const response = context.responseBuilder.createDeleteWorkflowResponse(args.id);
      return createToolResponse(response);
    },
  };
}
