/**
 * GetWorkflowConnectionsTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import type { WorkflowDetailInternal } from "../../clients/n8n-api-client.js";

type GetWorkflowConnectionsArgs = {
  id: string;
  raw?: boolean;
};

type GetWorkflowConnectionsCoreArgs = Omit<GetWorkflowConnectionsArgs, "raw">;

/**
 * Tool for getting workflow node connections in a graph structure
 * Shows inputs and outputs for each node
 * Supports raw option to include raw connection data
 */
export class GetWorkflowConnectionsTool extends RawTool<GetWorkflowConnectionsArgs> {
  readonly name = "get_workflow_connections";
  readonly description = "Get node connections of a specific workflow in a graph structure. Shows inputs and outputs for each node. Use raw=true to include raw connection data.";

  getInputSchema() {
    return z.object({
      id: z.string().describe("Workflow ID"),
      raw: z.boolean().optional().describe("Include raw connection structure"),
    });
  }

  async executeCore(args: GetWorkflowConnectionsCoreArgs): Promise<WorkflowDetailInternal> {
    return await this.context.n8nClient.getWorkflow(args.id);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowDetailInternal;
    return this.context.responseBuilder.createGetWorkflowConnectionsResponse(
      workflow,
      raw
    );
  }
}
