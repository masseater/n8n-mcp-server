/**
 * list_workflows tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";

interface ListWorkflowsArgs {
  active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export function createListWorkflowsTool(
  context: ToolContext
): ToolDefinition<ListWorkflowsArgs> {
  return {
    name: "list_workflows",
    description: "List n8n workflows with optional filtering",
    inputSchema: {
      active: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
    },
    handler: async (args) => {
      // Filter out undefined values for exactOptionalPropertyTypes compatibility
      const filteredArgs = Object.fromEntries(
        Object.entries(args).filter(([_, v]) => v !== undefined)
      );
      const workflows = await context.n8nClient.getWorkflows(filteredArgs);
      const optimizedWorkflows = workflows.map((workflow: unknown) =>
        context.optimizer.optimizeWorkflowSummary(workflow)
      );
      return createToolResponse(optimizedWorkflows);
    },
  };
}
