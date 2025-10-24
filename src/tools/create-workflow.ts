/**
 * create_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";
import { nodeSchema, connectionsSchema, settingsSchema } from "./schemas.js";
import type { WorkflowDefinition } from "../types/index.js";

export function createCreateWorkflowTool(
  context: ToolContext
): ToolDefinition {
  return {
    name: "create_workflow",
    description: "Create a new workflow",
    inputSchema: {
      name: z.string(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema),
      connections: connectionsSchema,
      settings: settingsSchema,
      tags: z.array(z.string()).optional(),
    },
    handler: async (args) => {
      const workflow = await context.n8nClient.createWorkflow(
        args as unknown as WorkflowDefinition
      );
      return createToolResponse(workflow);
    },
  };
}
