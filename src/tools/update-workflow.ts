/**
 * update_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";
import { nodeSchema, connectionsSchema, settingsSchema } from "./schemas.js";
import type { WorkflowDefinition } from "../types/index.js";

export function createUpdateWorkflowTool(
  context: ToolContext
): ToolDefinition {
  return {
    name: "update_workflow",
    description: "Update an existing workflow by ID",
    inputSchema: {
      id: z.string(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema).optional(),
      connections: connectionsSchema.optional(),
      settings: settingsSchema.optional(),
      tags: z.array(z.string()).optional(),
    },
    handler: async (args) => {
      const { id, ...workflowData } = args;
      const workflow = await context.n8nClient.updateWorkflow(
        id as string,
        workflowData as unknown as WorkflowDefinition
      );
      return createToolResponse(workflow);
    },
  };
}
