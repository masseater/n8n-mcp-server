/**
 * UpdateWorkflowTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import { nodeSchema, connectionsSchema, settingsSchema } from "../schemas.js";
import type { WorkflowDefinition } from "../../types/index.js";
import type { WorkflowDetailInternal } from "../../clients/n8n-api-client.js";

type UpdateWorkflowArgs = {
  id: string;
  raw?: boolean;
} & Partial<WorkflowDefinition>;

type UpdateWorkflowCoreArgs = Omit<UpdateWorkflowArgs, "raw">;

/**
 * Tool for updating existing workflows
 * Supports raw option for controlling response verbosity
 */
export class UpdateWorkflowTool extends RawTool<UpdateWorkflowArgs> {
  readonly name = "update_workflow";
  readonly description = "Update an existing workflow by ID. Use raw=true to get full workflow details in response.";

  getInputSchema() {
    return z.object({
      id: z.string(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema).optional(),
      connections: connectionsSchema.optional(),
      settings: settingsSchema.optional().describe("Workflow settings (required when updating nodes/connections, use {} for empty settings)"),
      tags: z.array(z.string()).optional(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: UpdateWorkflowCoreArgs): Promise<WorkflowDetailInternal> {
    const { id, ...workflowData } = args;
    return await this.context.n8nClient.updateWorkflow(id, workflowData);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowDetailInternal;
    return this.context.responseBuilder.createUpdateWorkflowResponse(
      workflow,
      raw
    );
  }
}
