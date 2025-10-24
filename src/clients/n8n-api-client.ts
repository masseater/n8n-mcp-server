/**
 * n8n API client implementation
 */

import { z } from "zod";
import type {
  AuthCredentials,
  ListOptions,
  WorkflowDefinition,
  WorkflowSummary,
} from "../types/index.js";
import type {
  INode,
  IConnections,
  IWorkflowSettings,
  ITag,
} from "../types/n8n-types.js";
import { N8nHttpClient } from "./http-client.js";
import { AuthManager as AuthManagerImpl } from "./auth-manager.js";

// n8n API response types
interface N8nWorkflowResponse {
  id: string;
  name: string;
  active: boolean;
  tags?: Array<ITag | string>;
  createdAt: string;
  updatedAt: string;
  nodes?: INode[];
  connections?: IConnections;
  settings?: IWorkflowSettings;
}

// Type for workflow updates (excludes read-only fields)
type WorkflowUpdatePayload = Omit<Partial<WorkflowDefinition>, 'active' | 'id'>;

/**
 * Internal type for workflow details before optimization.
 * This type is returned by the API client and contains full n8n workflow data.
 * The optimizer layer converts this to the public WorkflowDetail type.
 */
interface WorkflowDetailInternal {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodes: INode[];
  connections: IConnections;
  settings?: IWorkflowSettings;
}

// Validation schemas based on n8n types
const GenericValueSchema: z.ZodType<
  string | object | number | boolean | undefined | null
> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.undefined(),
  z.record(z.string(), z.lazy(() => GenericValueSchema)),
  z.array(z.lazy(() => GenericValueSchema)),
]);

const WorkflowSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  nodeCount: z.number(),
});


const ListOptionsSchema = z.object({
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

/**
 * n8n API client implementation
 */
export class N8nApiClientImpl {
  private httpClient: N8nHttpClient;
  private authManager: AuthManagerImpl;

  constructor(
    baseUrl: string,
    timeout: number = 30000,
    retryAttempts: number = 3,
  ) {
    this.httpClient = new N8nHttpClient(baseUrl, timeout, retryAttempts);
    this.authManager = new AuthManagerImpl();
  }

  /**
   * Authenticate with n8n API
   */
  async authenticate(credentials: AuthCredentials): Promise<boolean> {
    try {
      if (!this.authManager.validateCredentials(credentials)) {
        return false;
      }

      // Set credentials in auth manager
      if (!this.authManager.setCredentials(credentials)) {
        return false;
      }

      // Update HTTP client headers
      const headers = this.authManager.getAuthHeaders(credentials);
      (this.httpClient as N8nHttpClient).updateHeaders(headers);

      // Test connection
      return await this.testConnection();
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  }

  /**
   * Get list of workflows
   */
  async getWorkflows(options?: ListOptions): Promise<WorkflowSummary[]> {
    return this.withErrorHandling("Failed to get workflows", async () => {
      const validatedOptions = ListOptionsSchema.parse(options || {}) as Partial<ListOptions>;
      const params = this.buildQueryParams(validatedOptions);

      const url = `/api/v1/workflows${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await this.httpClient.get<N8nWorkflowResponse[]>(url);
      const workflows = this.normalizeResponse(response);

      return workflows.map((workflow) => {
        const transformed = this.transformToWorkflowSummary(workflow);
        return WorkflowSummarySchema.parse(transformed);
      });
    });
  }

  /**
   * Get detailed workflow information
   */
  async getWorkflow(id: string): Promise<WorkflowDetailInternal> {
    return this.withErrorHandling(`Failed to get workflow ${id}`, async () => {
      this.validateId(id);

      const response = await this.httpClient.get<N8nWorkflowResponse>(
        `/api/v1/workflows/${id}`,
      );
      const workflow = this.normalizeResponse(response);

      return this.transformToWorkflowDetail(workflow);
    });
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: WorkflowDefinition): Promise<WorkflowSummary> {
    return this.withErrorHandling("Failed to create workflow", async () => {
      if (!workflow.name) {
        throw new Error("Workflow name is required");
      }

      // Remove 'active' field as it's read-only for n8n API
      const { active, ...workflowPayload } = workflow;

      const response = await this.httpClient.post<N8nWorkflowResponse>(
        "/api/v1/workflows",
        workflowPayload,
      );
      const workflowData = this.normalizeResponse(response);

      const transformed = this.transformToWorkflowSummary(workflowData);

      return WorkflowSummarySchema.parse(transformed);
    });
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    id: string,
    workflow: WorkflowDefinition,
  ): Promise<WorkflowSummary> {
    return this.withErrorHandling(`Failed to update workflow ${id}`, async () => {
      this.validateId(id);

      // Remove 'active' and 'id' fields as they're read-only for n8n API
      const workflowPayload = this.sanitizeWorkflowForUpdate(workflow);

      const response = await this.httpClient.put<N8nWorkflowResponse>(
        `/api/v1/workflows/${id}`,
        workflowPayload,
      );
      const workflowData = this.normalizeResponse(response);

      const transformed = this.transformToWorkflowSummary(workflowData);

      return WorkflowSummarySchema.parse(transformed);
    });
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<boolean> {
    return this.withErrorHandling(`Failed to delete workflow ${id}`, async () => {
      this.validateId(id);

      await this.httpClient.delete(`/api/v1/workflows/${id}`);
      return true;
    });
  }

  /**
   * Normalize API response to extract data
   */
  private normalizeResponse<T>(response: T | { data: T }): T {
    if (response && typeof response === "object" && "data" in response) {
      return response.data;
    }
    return response;
  }

  /**
   * Validate workflow ID
   */
  private validateId(id: string): void {
    if (!id) {
      throw new Error("Workflow ID is required");
    }
  }

  /**
   * Sanitize workflow data for update by removing read-only fields
   */
  private sanitizeWorkflowForUpdate(workflow: WorkflowDefinition): WorkflowUpdatePayload {
    const { active, ...rest } = workflow;
    // Also remove 'id' if it exists (it shouldn't, but defensive programming)
    const sanitized = rest as Record<string, unknown>;
    delete sanitized.id;
    return sanitized as WorkflowUpdatePayload;
  }

  /**
   * Error handling wrapper for async operations
   */
  private async withErrorHandling<T>(
    context: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleApiError(error, context);
    }
  }

  /**
   * Normalize tags from API response
   */
  private normalizeTagsFromResponse(tags: unknown): string[] {
    if (!tags || !Array.isArray(tags)) {
      return [];
    }
    return tags.map((tag) => (typeof tag === "string" ? tag : tag.name || ""));
  }

  /**
   * Transform workflow data to WorkflowSummary
   */
  private transformToWorkflowSummary(workflow: N8nWorkflowResponse): WorkflowSummary {
    const tags = this.normalizeTagsFromResponse(workflow.tags);
    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
      tags,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodeCount: workflow.nodes?.length || 0,
    };
  }

  /**
   * Transform workflow data to WorkflowDetailInternal
   * Note: Returns internal format with IConnections and INode[].
   * The optimizer layer (response-optimizer.ts) converts it to the public WorkflowDetail type.
   */
  private transformToWorkflowDetail(workflow: N8nWorkflowResponse): WorkflowDetailInternal {
    const tags = this.normalizeTagsFromResponse(workflow.tags);
    const result: WorkflowDetailInternal = {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
      tags,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodes: workflow.nodes || [],
      connections: workflow.connections || {},
    };

    if (workflow.settings !== undefined) {
      result.settings = workflow.settings;
    }

    return result;
  }

  /**
   * Build query parameters for list operations
   */
  private buildQueryParams(options: Partial<ListOptions>): URLSearchParams {
    const params = new URLSearchParams();
    if (options.active !== undefined) {
      params.append("active", options.active.toString());
    }
    if (options.tags && options.tags.length > 0) {
      params.append("tags", options.tags.join(","));
    }
    if (options.limit) {
      params.append("limit", options.limit.toString());
    }
    if (options.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }
    return params;
  }

  /**
   * Handle API errors consistently
   */
  private handleApiError(error: unknown, context: string): never {
    console.error(`${context}:`, error);
    throw new Error(
      `${context}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  /**
   * Test connection to n8n API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to access a simple endpoint to test connection
      await this.httpClient.get("/api/v1/workflows?limit=1");
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}
