/**
 * n8n API Client type definitions
 */

import type { WorkflowDetailInternal } from './n8n-api-client.js';
import type { WorkflowSummary, ListOptions } from '../types/index.js';
import type {
  ExecutionSummary,
  ExecutionDetail,
} from '../types/execution-types.js';

/**
 * n8n API Client interface
 */
export interface N8nApiClient {
  /**
   * Authenticate with n8n API
   */
  authenticate(credentials: { apiKey: string }): Promise<void>;

  /**
   * Get workflow list
   */
  getWorkflows(options?: ListOptions): Promise<WorkflowSummary[]>;

  /**
   * Get workflow by ID
   */
  getWorkflow(id: string): Promise<WorkflowDetailInternal>;

  /**
   * Create new workflow
   */
  createWorkflow(workflow: unknown): Promise<WorkflowDetailInternal>;

  /**
   * Update existing workflow
   */
  updateWorkflow(
    id: string,
    workflow: unknown,
  ): Promise<WorkflowDetailInternal>;

  /**
   * Delete workflow by ID
   */
  deleteWorkflow(id: string): Promise<{ id: string }>;

  /**
   * Get execution list
   */
  getExecutions(options?: {
    workflowId?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  }): Promise<ExecutionSummary[]>;

  /**
   * Get execution by ID
   */
  getExecution(
    id: string,
    options?: { includeData?: boolean },
  ): Promise<ExecutionDetail>;
}
