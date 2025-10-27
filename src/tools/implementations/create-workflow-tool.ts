/**
 * CreateWorkflowTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import { nodeSchema, connectionsSchema, settingsSchema } from "../schemas.js";
import type { WorkflowDefinition, WorkflowSummary } from "../../types/index.js";

export type CreateWorkflowArgs = WorkflowDefinition & {
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
      settings: settingsSchema,
      tags: z.array(z.string()).optional(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: CreateWorkflowCoreArgs): Promise<WorkflowSummary> {
    return await this.context.n8nClient.createWorkflow(args);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowSummary;
    return this.context.responseBuilder.createCreateWorkflowResponse(
      workflow,
      raw
    );
  }
}
