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
  getExecutions,
  getExecutionsById,
} from '../generated/sdk.gen.js';
import type {
  Workflow,
  WorkflowWritable,
  Execution,
} from '../generated/types.gen.js';
import type {
  AuthCredentials,
  ListOptions,
  WorkflowDefinition,
  WorkflowSummary,
} from '../types/index.js';
import type { INode, IConnections, IWorkflowSettings } from '../types/n8n-types.js';
import {
  ValidationError,
  AuthenticationError,
} from '../errors/custom-errors.js';
import {
  handleResponse,
  validateRequired,
  wrapAsync,
} from '../errors/api-error-handler.js';

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
   * Authenticate with n8n API
   */
  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!credentials.apiKey) {
        throw new ValidationError('API key is required for authentication');
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
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new AuthenticationError(
        'Failed to authenticate with n8n API',
        { baseUrl: this.baseUrl },
        { cause: error }
      );
    }
  }

  /**
   * Get list of workflows
   */
  async getWorkflows(options?: ListOptions): Promise<WorkflowSummary[]> {
    return wrapAsync(async () => {
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

      const data = handleResponse(response, {
        operation: 'get workflows',
        resourceType: 'workflows',
        additionalInfo: { options },
      });

      const workflows = data.data ?? [];
      return workflows.map((workflow) => this.transformToWorkflowSummary(workflow));
    }, {
      operation: 'get workflows',
      resourceType: 'workflows',
      additionalInfo: { options },
    });
  }

  /**
   * Get detailed workflow information
   */
  async getWorkflow(id: string): Promise<WorkflowDetailInternal> {
    validateRequired(id, 'Workflow ID');

    return wrapAsync(async () => {
      const response = await getWorkflowsById({
        path: { id },
      });

      const data = handleResponse(response, {
        operation: 'get workflow',
        resourceType: 'Workflow',
        resourceId: id,
      });

      return this.transformToWorkflowDetail(data);
    }, {
      operation: 'get workflow',
      resourceType: 'Workflow',
      resourceId: id,
    });
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: WorkflowDefinition): Promise<WorkflowDetailInternal> {
    validateRequired(workflow.name, 'Workflow name');

    return wrapAsync(async () => {
      // Remove read-only fields
      const { active: _active, tags: _tags, ...workflowPayload } = workflow;

      const response = await postWorkflows({
        body: workflowPayload as WorkflowWritable,
      });

      const data = handleResponse(response, {
        operation: 'create workflow',
        resourceType: 'Workflow',
        additionalInfo: { workflowName: workflow.name },
      });

      return this.transformToWorkflowDetail(data);
    }, {
      operation: 'create workflow',
      resourceType: 'Workflow',
      additionalInfo: { workflowName: workflow.name },
    });
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    id: string,
    workflow: Partial<WorkflowDefinition>,
  ): Promise<WorkflowDetailInternal> {
    validateRequired(id, 'Workflow ID');

    return wrapAsync(async () => {
      // Remove read-only fields by destructuring
      const { active: _active, tags: _tags, ...workflowPayload } = workflow;

      const response = await putWorkflowsById({
        path: { id },
        body: workflowPayload as unknown as WorkflowWritable,
      });

      const data = handleResponse(response, {
        operation: 'update workflow',
        resourceType: 'Workflow',
        resourceId: id,
      });

      return this.transformToWorkflowDetail(data);
    }, {
      operation: 'update workflow',
      resourceType: 'Workflow',
      resourceId: id,
    });
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<{ id: string }> {
    validateRequired(id, 'Workflow ID');

    return wrapAsync(async () => {
      const response = await deleteWorkflowsById({
        path: { id },
      });

      handleResponse(response, {
        operation: 'delete workflow',
        resourceType: 'Workflow',
        resourceId: id,
      });

      return { id };
    }, {
      operation: 'delete workflow',
      resourceType: 'Workflow',
      resourceId: id,
    });
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
   * Get execution list
   */
  async getExecutions(options?: {
    workflowId?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  }): Promise<Execution[]> {
    return wrapAsync(async () => {
      const query: Record<string, unknown> = {};
      if (options?.workflowId) {
        query.workflowId = options.workflowId;
      }
      if (options?.status) {
        query.status = options.status;
      }
      if (options?.limit) {
        query.limit = options.limit;
      }
      if (options?.cursor) {
        query.cursor = options.cursor;
      }

      const response = await getExecutions({
        query: query as Record<string, string | number>,
      });

      const data = handleResponse(response, {
        operation: 'get executions',
        resourceType: 'executions',
        additionalInfo: { options },
      });

      return data.data ?? [];
    }, {
      operation: 'get executions',
      resourceType: 'executions',
      additionalInfo: { options },
    });
  }

  /**
   * Get execution by ID
   */
  async getExecution(
    id: string,
    options?: { includeData?: boolean },
  ): Promise<Execution> {
    validateRequired(id, 'Execution ID');

    return wrapAsync(async () => {
      const query: Record<string, unknown> = {};
      if (options?.includeData !== undefined) {
        query.includeData = options.includeData;
      }

      // Convert string ID to number for API
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new ValidationError(
          `Invalid execution ID: ${id}`,
          { executionId: id }
        );
      }

      const response = await getExecutionsById({
        path: { id: numericId },
        query: query as Record<string, boolean>,
      });

      return handleResponse(response, {
        operation: 'get execution',
        resourceType: 'Execution',
        resourceId: id,
      });
    }, {
      operation: 'get execution',
      resourceType: 'Execution',
      resourceId: id,
    });
  }
}
