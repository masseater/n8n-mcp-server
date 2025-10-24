/**
 * get_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";

interface GetWorkflowArgs {
  id: string;
}

export function createGetWorkflowTool(
  context: ToolContext
): ToolDefinition<GetWorkflowArgs> {
  return {
    name: "get_workflow",
    description: "Get detailed information about a specific workflow",
    inputSchema: {
      id: z.string(),
    },
    handler: async (args) => {
      const workflow = await context.n8nClient.getWorkflow(args.id);
      const optimizedWorkflow = context.optimizer.optimizeWorkflowDetail(
        workflow
      );
      const minimizedWorkflow = context.optimizer.minimizeContext(
        optimizedWorkflow
      );
      return createToolResponse(minimizedWorkflow);
    },
  };
}
