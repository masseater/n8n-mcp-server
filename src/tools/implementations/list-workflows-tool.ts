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
    const filteredArgs: Record<string, string | number | boolean | string[]> = {};

    if (args.active !== undefined) filteredArgs.active = args.active;
    if (args.tags !== undefined) filteredArgs.tags = args.tags;
    if (args.limit !== undefined) filteredArgs.limit = args.limit;
    if (args.offset !== undefined) filteredArgs.offset = args.offset;

    return await this.context.n8nClient.getWorkflows(filteredArgs as ListWorkflowsCoreArgs);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflows = data as WorkflowSummary[];
    return this.context.responseBuilder.createListWorkflowsResponse(
      workflows,
      raw
    );
  }
}
