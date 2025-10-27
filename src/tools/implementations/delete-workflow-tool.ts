/**
 * DeleteWorkflowTool class implementation
 */

import { z } from "zod";
import { BaseTool } from "../base/base-tool.js";

export type DeleteWorkflowArgs = {
  id: string;
};

/**
 * Tool for deleting workflows by ID
 * Inherits directly from BaseTool (no raw option needed)
 */
export class DeleteWorkflowTool extends BaseTool<DeleteWorkflowArgs> {
  readonly name = "delete_workflow";
  readonly description = "Delete a workflow by ID";

  getInputSchema() {
    return z.object({
      id: z.string(),
    });
  }

  async execute(args: DeleteWorkflowArgs): Promise<unknown> {
    await this.context.n8nClient.deleteWorkflow(args.id);
    return this.context.responseBuilder.createDeleteWorkflowResponse(args.id);
  }
}
