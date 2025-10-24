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
    description: "Create a new workflow. Use raw=true to get full workflow details in response.",
    inputSchema: {
      name: z.string(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema),
      connections: connectionsSchema,
      settings: settingsSchema,
      tags: z.array(z.string()).optional(),
      raw: z.boolean().optional(),
    },
    handler: async (args) => {
      const { raw, ...workflowData } = args as { raw?: boolean; [key: string]: unknown };
      const workflow = await context.n8nClient.createWorkflow(
        workflowData as unknown as WorkflowDefinition
      );
      const response = context.optimizer.createCreateWorkflowResponse(
        workflow,
        raw || false
      );
      return createToolResponse(response);
    },
  };
}
