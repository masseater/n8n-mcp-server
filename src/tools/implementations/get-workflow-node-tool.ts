import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import type { INode } from "../../types/n8n-types.js";

type GetWorkflowNodeArgs = {
  workflowId: string;
  nodeId: string;
  raw?: boolean;
};

type GetWorkflowNodeCoreArgs = Omit<GetWorkflowNodeArgs, "raw">;

/**
 * Tool for getting detailed information about a specific node in a workflow
 * Supports raw option for controlling response verbosity
 */
export class GetWorkflowNodeTool extends RawTool<GetWorkflowNodeArgs> {
  readonly name = "get_workflow_node";
  readonly description = "Get detailed information about a specific node in a workflow. Use raw=true to get full node details including UI position data.";

  getInputSchema() {
    return z.object({
      workflowId: z.string().describe("Workflow ID"),
      nodeId: z.string().describe("Node ID or Name"),
      raw: z.boolean().optional().describe("Include raw node data (e.g. position)"),
    });
  }

  async executeCore(args: GetWorkflowNodeCoreArgs): Promise<INode> {
    const workflow = await this.context.n8nClient.getWorkflow(args.workflowId);

    const node = workflow.nodes.find(
      (n) => n.id === args.nodeId || n.name === args.nodeId
    );

    if (!node) {
      throw new Error(`Node '${args.nodeId}' not found in workflow '${args.workflowId}'`);
    }

    return node;
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const node = data as INode;
    return this.context.responseBuilder.createGetWorkflowNodeResponse(
      node,
      raw
    );
  }
}
