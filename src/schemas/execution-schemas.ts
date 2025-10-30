/**
 * Zod schemas for execution tool input validation
 */

import { z } from 'zod';

/**
 * list_executions tool input schema
 */
export const listExecutionsArgsSchema = z.object({
  /** Filter by workflow ID */
  workflowId: z.string().optional(),
  /** Filter by execution status */
  status: z.enum(['success', 'error', 'waiting', 'running', 'canceled']).optional(),
  /** Limit number of results (1-100) */
  limit: z.number().int().min(1).max(100).optional(),
  /** Pagination cursor from previous response */
  cursor: z.string().optional(),
  /** Return full execution data */
  raw: z.boolean().optional(),
});

export type ListExecutionsArgs = z.infer<typeof listExecutionsArgsSchema>;

/**
 * get_execution tool input schema
 */
export const getExecutionArgsSchema = z.object({
  /** Execution ID (must be numeric string for n8n API compatibility) */
  id: z.string().min(1).regex(/^\d+$/, 'Execution ID must be numeric'),
  /** Include node input/output data */
  includeData: z.boolean().optional(),
  /** Return full execution data */
  raw: z.boolean().optional(),
});

export type GetExecutionArgs = z.infer<typeof getExecutionArgsSchema>;
