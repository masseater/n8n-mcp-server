/**
 * n8n API client implementation using @hey-api/openapi-ts generated SDK
 */

import { client as generatedClient } from '../generated/client.gen.js';
import {
  getWorkflows,
  getWorkflowsById,
  postWorkflows,
  putWorkflowsById,
  deleteWorkflowsById,
} from '../generated/sdk.gen.js';
import type {
  Workflow,
  WorkflowWritable,
} from '../generated/types.gen.js';
import type {
  AuthCredentials,
  ListOptions,
  WorkflowDefinition,
  WorkflowSummary,
} from '../types/index.js';
import type { INode, IConnections, IWorkflowSettings } from '../types/n8n-types.js';

/**
 * Internal type for workflow details before optimization.
 * This type is returned by the API client and contains full n8n workflow data.
 * The optimizer layer converts this to the public WorkflowDetail type.
 */
export type WorkflowDetailInternal = {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodes: INode[];
  connections: IConnections;
  settings?: IWorkflowSettings;
};

/**
 * n8n API client implementation using generated SDK
 */
export class N8nApiClientImpl {
  private baseUrl: string;
  private apiKey?: string;
  private readonly retryAttempts: number;

  constructor(
    baseUrl: string,
    _timeout = 30000,
    retryAttempts = 3,
  ) {
    this.baseUrl = baseUrl;
    this.retryAttempts = retryAttempts;

    // Configure the generated client
    generatedClient.setConfig({
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
    });

    // Setup retry logic via interceptor
    this.setupRetryInterceptor();
  }

  /**
   * Setup retry interceptor with exponential backoff
   */
  private setupRetryInterceptor(): void {
    generatedClient.interceptors.error.use(async (error: unknown) => {
      const err = error as { request?: Request; response?: Response; options?: { retryCount?: number } };

      if (!err.response || !err.request) {
        return error;
      }

      const status = err.response.status;
      const retryCount = err.options?.retryCount ?? 0;

      // Retry on 5xx errors and network failures
      const shouldRetry = status >= 500 && retryCount < this.retryAttempts;

      if (!shouldRetry) {
        return error;
      }

      // Exponential backoff: 2^n * 1000ms
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Retry the request
      if (!err.options) {
        return error;
      }

      err.options.retryCount = retryCount + 1;

      return error;
    });
  }

  /**
   * Format error for display
   */
  private formatError(error: unknown): string {
    if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; code?: number; status?: number };
      if (err.message) {
        return err.message;
      }
      if (err.code !== undefined || err.status !== undefined) {
        return `Error code: ${String(err.code ?? err.status ?? 'unknown')}`;
      }
    }
    return String(error);
  }

  /**
   * Authenticate with n8n API
   */
  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.apiKey) {
        return false;
      }

      this.apiKey = credentials.apiKey;

      // Configure the generated client with auth
      generatedClient.setConfig({
        baseUrl: this.baseUrl.replace(/\/$/, ''),
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      // Test connection
      return await this.testConnection();
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  /**
   * Get list of workflows
   */
  async getWorkflows(options?: ListOptions): Promise<WorkflowSummary[]> {
    try {
      const query: Record<string, unknown> = {};
      if (options?.active !== undefined) {
        query.active = options.active;
      }
      if (options?.tags && options.tags.length > 0) {
        query.tags = options.tags.join(',');
      }
      if (options?.limit) {
        query.limit = options.limit;
      }
      if (options?.offset !== undefined) {
        query.offset = options.offset;
      }

      const response = await getWorkflows({
        query: query as Record<string, string | number | boolean>,
      });

      if (response.error) {
        throw new Error(`Failed to get workflows: ${this.formatError(response.error)}`);
      }

      const workflows = response.data?.data ?? [];
      return workflows.map((workflow) => this.transformToWorkflowSummary(workflow));
    } catch (error) {
      this.handleError('Failed to get workflows', error);
    }
  }

  /**
   * Get detailed workflow information
   */
  async getWorkflow(id: string): Promise<WorkflowDetailInternal> {
    try {
      if (!id) {
        throw new Error('Workflow ID is required');
      }

      const response = await getWorkflowsById({
        path: { id },
      });

      if (response.error) {
        throw new Error(`Failed to get workflow ${id}: ${this.formatError(response.error)}`);
      }

      if (!response.data) {
        throw new Error(`No workflow data returned for ${id}`);
      }

      return this.transformToWorkflowDetail(response.data);
    } catch (error) {
      this.handleError(`Failed to get workflow ${id}`, error);
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: WorkflowDefinition): Promise<WorkflowSummary> {
    try {
      if (!workflow.name) {
        throw new Error('Workflow name is required');
      }

      // Remove read-only fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { active, tags, ...workflowPayload } = workflow;

      const response = await postWorkflows({
        body: workflowPayload as WorkflowWritable,
      });

      if (response.error) {
        throw new Error(`Failed to create workflow: ${this.formatError(response.error)}`);
      }

      if (!response.data) {
        throw new Error('No workflow data returned from create');
      }

      return this.transformToWorkflowSummary(response.data);
    } catch (error) {
      this.handleError('Failed to create workflow', error);
    }
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    id: string,
    workflow: Partial<WorkflowDefinition>,
  ): Promise<WorkflowSummary> {
    try {
      if (!id) {
        throw new Error('Workflow ID is required');
      }

      // Remove read-only fields by destructuring
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { active, tags, ...workflowPayload } = workflow;

      const response = await putWorkflowsById({
        path: { id },
        body: workflowPayload as unknown as WorkflowWritable,
      });

      if (response.error) {
        throw new Error(`Failed to update workflow ${id}: ${this.formatError(response.error)}`);
      }

      if (!response.data) {
        throw new Error(`No workflow data returned from update for ${id}`);
      }

      return this.transformToWorkflowSummary(response.data);
    } catch (error) {
      this.handleError(`Failed to update workflow ${id}`, error);
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('Workflow ID is required');
      }

      const response = await deleteWorkflowsById({
        path: { id },
      });

      if (response.error) {
        throw new Error(`Failed to delete workflow ${id}: ${this.formatError(response.error)}`);
      }

      return true;
    } catch (error) {
      this.handleError(`Failed to delete workflow ${id}`, error);
    }
  }

  /**
   * Test connection to n8n API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await getWorkflows({
        query: { limit: 1 },
      });
      return !response.error;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Normalize tags from API response
   */
  private normalizeTags(tags: unknown): string[] {
    if (!tags || !Array.isArray(tags)) {
      return [];
    }
    return tags.map((tag: unknown) => {
      if (typeof tag === 'string') {
        return tag;
      }
      if (typeof tag === 'object' && tag !== null) {
        const tagObj = tag as Record<string, unknown>;
        return typeof tagObj.name === 'string' ? tagObj.name : '';
      }
      return '';
    }).filter(Boolean);
  }

  /**
   * Transform workflow to WorkflowSummary
   */
  private transformToWorkflowSummary(workflow: Workflow): WorkflowSummary {
    return {
      id: workflow.id ?? '',
      name: workflow.name,
      active: workflow.active ?? false,
      tags: this.normalizeTags(workflow.tags),
      createdAt: workflow.createdAt ?? '',
      updatedAt: workflow.updatedAt ?? '',
      nodeCount: workflow.nodes.length,
    };
  }

  /**
   * Transform workflow to WorkflowDetailInternal
   */
  private transformToWorkflowDetail(workflow: Workflow): WorkflowDetailInternal {
    // Note: connections might be in the workflow object but not typed in generated types
    const workflowData = workflow as unknown as Workflow & { connections?: IConnections };

    return {
      id: workflow.id ?? '',
      name: workflow.name,
      active: workflow.active ?? false,
      tags: this.normalizeTags(workflow.tags),
      createdAt: workflow.createdAt ?? '',
      updatedAt: workflow.updatedAt ?? '',
      nodes: workflow.nodes as INode[],
      connections: workflowData.connections ?? {},
      settings: workflow.settings as IWorkflowSettings,
    };
  }

  /**
   * Handle API errors consistently
   */
  private handleError(context: string, error: unknown): never {
    console.error(`${context}:`, error);
    throw new Error(
      `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
