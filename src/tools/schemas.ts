/**
 * Zod schemas for workflow tools
 */

import { z } from "zod";

// Define lazy recursive types for node parameters to avoid any/unknown
type NodeParameterValue =
  | string
  | number
  | boolean
  | NodeParameterValue[]
  | { [key: string]: NodeParameterValue };

export const nodeParameterValueSchema: z.ZodType<NodeParameterValue> = z.lazy(
  () =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(nodeParameterValueSchema),
      z.record(z.string(), nodeParameterValueSchema),
    ])
);

// Define node schema based on n8n's INode interface
export const nodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  typeVersion: z.number(),
  position: z.tuple([z.number(), z.number()]),
  parameters: z.record(z.string(), nodeParameterValueSchema),
  credentials: z
    .record(
      z.string(),
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  disabled: z.boolean().optional(),
});

// Define connections schema based on n8n's IConnections interface
export const connectionsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.array(
      z.array(
        z.object({
          node: z.string(),
          type: z.string(),
          index: z.number(),
        })
      )
    )
  )
);

// Define settings schema based on n8n's IWorkflowSettings interface
export const settingsSchema = z
  .object({
    timezone: z.string().optional(),
    errorWorkflow: z.string().optional(),
    callerIds: z.string().optional(),
    callerPolicy: z.string().optional(),
    saveDataErrorExecution: z.string().optional(),
    saveDataSuccessExecution: z.string().optional(),
    saveManualExecutions: z.boolean().optional(),
    saveExecutionProgress: z.boolean().optional(),
    executionOrder: z.string().optional(),
  })
  .optional();
