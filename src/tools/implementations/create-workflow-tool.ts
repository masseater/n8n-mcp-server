/**
 * CreateWorkflowTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import { nodeSchema, connectionsSchema, settingsSchema } from "../schemas.js";
import type { WorkflowDefinition } from "../../types/index.js";
import type { WorkflowDetailInternal } from "../../clients/n8n-api-client.js";

type CreateWorkflowArgs = WorkflowDefinition & {
  raw?: boolean;
};

type CreateWorkflowCoreArgs = Omit<CreateWorkflowArgs, "raw">;

/**
 * Tool for creating new workflows
 * Supports raw option for controlling response verbosity
 */
export class CreateWorkflowTool extends RawTool<CreateWorkflowArgs> {
  readonly name = "create_workflow";
  readonly description = "Create a new workflow. Use raw=true to get full workflow details in response.";

  getInputSchema() {
    return z.object({
      name: z.string(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema),
      connections: connectionsSchema,
      settings: settingsSchema.describe("Workflow settings (required field, use {} for empty settings)"),
      tags: z.array(z.string()).optional(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: CreateWorkflowCoreArgs): Promise<WorkflowDetailInternal> {
    return await this.context.n8nClient.createWorkflow(args);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowDetailInternal;
    return this.context.responseBuilder.createCreateWorkflowResponse(
      workflow,
      raw
    );
  }
}
