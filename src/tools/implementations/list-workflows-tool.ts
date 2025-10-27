/**
 * ListWorkflowsTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import type { WorkflowSummary } from "../../types/index.js";

export type ListWorkflowsArgs = {
  active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
  raw?: boolean;
};

type ListWorkflowsCoreArgs = Omit<ListWorkflowsArgs, "raw">;

/**
 * Tool for listing workflows with optional filtering
 * Supports raw option for controlling response verbosity
 */
export class ListWorkflowsTool extends RawTool<ListWorkflowsArgs> {
  readonly name = "list_workflows";
  readonly description = "List n8n workflows with optional filtering. Use raw=true to get full workflow details.";

  getInputSchema() {
    return z.object({
      active: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: ListWorkflowsCoreArgs): Promise<WorkflowSummary[]> {
    // Filter out undefined values for exactOptionalPropertyTypes compatibility
    const filteredArgs = Object.fromEntries(
      Object.entries(args).filter(([_, v]) => v !== undefined)
    );

    return await this.context.n8nClient.getWorkflows(filteredArgs);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflows = data as WorkflowSummary[];
    return this.context.responseBuilder.createListWorkflowsResponse(
      workflows,
      raw
    );
  }
}
