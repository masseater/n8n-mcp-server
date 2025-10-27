/**
 * update_workflow tool implementation
 */

import { z } from "zod";
import type { ToolDefinition, ToolContext } from "./base-tool.js";
import { createToolResponse } from "./base-tool.js";
import { nodeSchema, connectionsSchema, settingsSchema } from "./schemas.js";
import type { WorkflowDefinition } from "../types/index.js";

export type UpdateWorkflowArgs = {
  id: string;
  raw?: boolean;
} & Partial<WorkflowDefinition>;

export function createUpdateWorkflowTool(
  context: ToolContext
): ToolDefinition<UpdateWorkflowArgs> {
  return {
    name: "update_workflow",
    description: "Update an existing workflow by ID. Use raw=true to get full workflow details in response.",
    inputSchema: {
      id: z.string(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema).optional(),
      connections: connectionsSchema.optional(),
      settings: settingsSchema.optional(),
      tags: z.array(z.string()).optional(),
      raw: z.boolean().optional(),
    },
    handler: async (args: UpdateWorkflowArgs) => {
      const { id, raw, ...workflowData } = args;
      const workflow = await context.n8nClient.updateWorkflow(id, workflowData);
      const response = context.responseBuilder.createUpdateWorkflowResponse(
        workflow,
        raw || false
      );
      return createToolResponse(response);
    },
  };
}
