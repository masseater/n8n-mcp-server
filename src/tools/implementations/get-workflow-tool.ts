/**
 * GetWorkflowTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import type { WorkflowDetailInternal } from "../../clients/n8n-api-client.js";

type GetWorkflowArgs = {
  id: string;
  raw?: boolean;
};

type GetWorkflowCoreArgs = Omit<GetWorkflowArgs, "raw">;

/**
 * Tool for getting detailed workflow information
 * Supports raw option for controlling response verbosity
 */
export class GetWorkflowTool extends RawTool<GetWorkflowArgs> {
  readonly name = "get_workflow";
  readonly description = "Get detailed information about a specific workflow. Use raw=true to get full workflow details including nodes and connections.";

  getInputSchema() {
    return z.object({
      id: z.string(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: GetWorkflowCoreArgs): Promise<WorkflowDetailInternal> {
    return await this.context.n8nClient.getWorkflow(args.id);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowDetailInternal;
    return this.context.responseBuilder.createGetWorkflowResponse(
      workflow,
      raw
    );
  }
}
