/**
 * n8n API client implementation
 */

import { z } from "zod";
import type {
  AuthManager,
  HttpClient,
  N8nApiClient,
} from "../interfaces/n8n-client.js";
import type {
  AuthCredentials,
  ListOptions,
  WorkflowDefinition,
  WorkflowDetail,
  WorkflowSummary,
} from "../types/index.js";
import type {
  INode,
  IConnections,
  IWorkflowSettings,
  ITag,
  IConnection,
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

const INodeParametersSchema = z.record(z.string(), GenericValueSchema);

const INodeCredentialsDetailsSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
});

const INodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  typeVersion: z.number(),
  type: z.string(),
  position: z.tuple([z.number(), z.number()]),
  disabled: z.boolean().optional(),
  notes: z.string().optional(),
  notesInFlow: z.boolean().optional(),
  retryOnFail: z.boolean().optional(),
  maxTries: z.number().optional(),
  waitBetweenTries: z.number().optional(),
  alwaysOutputData: z.boolean().optional(),
  executeOnce: z.boolean().optional(),
  onError: z
    .enum(["continueErrorOutput", "continueRegularOutput", "stopWorkflow"])
    .optional(),
  continueOnFail: z.boolean().optional(),
  parameters: INodeParametersSchema,
  credentials: z.record(z.string(), INodeCredentialsDetailsSchema).optional(),
  webhookId: z.string().optional(),
  extendsCredential: z.string().optional(),
});

const IConnectionSchema = z.object({
  node: z.string(),
  type: z.string(),
  index: z.number(),
});

const IConnectionsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.array(z.union([z.array(IConnectionSchema), z.null()]))
  )
);

const IWorkflowSettingsSchema = z.object({
  timezone: z.string().optional(),
  errorWorkflow: z.string().optional(),
  callerIds: z.string().optional(),
  callerPolicy: z.string().optional(),
  saveDataErrorExecution: z.string().optional(),
  saveDataSuccessExecution: z.string().optional(),
  saveManualExecutions: z.boolean().optional(),
  saveExecutionProgress: z.boolean().optional(),
  executionOrder: z.string().optional(),
});

const WorkflowSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  nodeCount: z.number(),
});

const WorkflowDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  nodes: z.array(INodeSchema),
  connections: IConnectionsSchema,
  settings: IWorkflowSettingsSchema.optional(),
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
export class N8nApiClientImpl implements N8nApiClient {
  private httpClient: HttpClient;
  private authManager: AuthManager;
  private baseUrl: string;

  constructor(
    baseUrl: string,
    timeout: number = 30000,
    retryAttempts: number = 3,
  ) {
    this.baseUrl = baseUrl;
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
    try {
      // Validate options
      const validatedOptions = ListOptionsSchema.parse(options || {});

      // Build query parameters
      const params = new URLSearchParams();
      if (validatedOptions.active !== undefined) {
        params.append("active", validatedOptions.active.toString());
      }
      if (validatedOptions.tags && validatedOptions.tags.length > 0) {
        params.append("tags", validatedOptions.tags.join(","));
      }
      if (validatedOptions.limit) {
        params.append("limit", validatedOptions.limit.toString());
      }
      if (validatedOptions.offset) {
        params.append("offset", validatedOptions.offset.toString());
      }

      const url = `/api/v1/workflows${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await this.httpClient.get<any>(url);
      const workflows = response.data || response;

      // Transform and validate response
      return workflows.map((workflow: any) => {
        // Handle tags - n8n API returns tag objects with id and name
        const tags = Array.isArray(workflow.tags)
          ? workflow.tags.map((tag: any) =>
              typeof tag === "string" ? tag : tag.name || tag.id || ""
            ).filter((tag: string) => tag !== "")
          : [];

        const transformed = {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active || false,
          tags,
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
          nodeCount: workflow.nodes?.length || 0,
        };

        return WorkflowSummarySchema.parse(transformed);
      });
    } catch (error) {
      console.error("Failed to get workflows:", error);
      throw new Error(
        `Failed to get workflows: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Get detailed workflow information
   */
  async getWorkflow(id: string): Promise<WorkflowDetail> {
    try {
      if (!id) {
        throw new Error("Workflow ID is required");
      }

      const response = await this.httpClient.get<any>(
        `/api/v1/workflows/${id}`,
      );
      const workflow = response.data || response;

      // Handle tags - n8n API returns tag objects with id and name
      const tags = Array.isArray(workflow.tags)
        ? workflow.tags.map((tag: any) =>
            typeof tag === "string" ? tag : tag.name || tag.id || ""
          ).filter((tag: string) => tag !== "")
        : [];

      // Transform response
      const transformed: WorkflowDetail = {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active || false,
        tags,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        nodes: workflow.nodes || [],
        connections: workflow.connections || {},
        settings: workflow.settings,
      };

      return transformed;
    } catch (error) {
      console.error(`Failed to get workflow ${id}:`, error);
      throw new Error(
        `Failed to get workflow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflow: WorkflowDefinition): Promise<WorkflowSummary> {
    try {
      if (!workflow.name) {
        throw new Error("Workflow name is required");
      }

      // Remove 'active' field as it's read-only for n8n API
      const { active, ...workflowPayload } = workflow;

      const response = await this.httpClient.post<any>(
        "/api/v1/workflows",
        workflowPayload,
      );
      const workflowData = response.data || response;

      // Handle tags - n8n API returns tag objects with id and name
      const tags = Array.isArray(workflowData.tags)
        ? workflowData.tags.map((tag: any) =>
            typeof tag === "string" ? tag : tag.name || tag.id || ""
          ).filter((tag: string) => tag !== "")
        : [];

      // Transform response
      const transformed = {
        id: workflowData.id,
        name: workflowData.name,
        active: workflowData.active || false,
        tags,
        createdAt: workflowData.createdAt,
        updatedAt: workflowData.updatedAt,
        nodeCount: workflowData.nodes?.length || 0,
      };

      return WorkflowSummarySchema.parse(transformed);
    } catch (error) {
      console.error("Failed to create workflow:", error);
      throw new Error(
        `Failed to create workflow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(
    id: string,
    workflow: WorkflowDefinition,
  ): Promise<WorkflowSummary> {
    try {
      if (!id) {
        throw new Error("Workflow ID is required");
      }

      // Remove 'active' field as it's read-only for n8n API
      const { active, ...workflowPayload } = workflow;

      const response = await this.httpClient.put<any>(
        `/api/v1/workflows/${id}`,
        workflowPayload,
      );
      const workflowData = response.data || response;

      // Handle tags - n8n API returns tag objects with id and name
      const tags = Array.isArray(workflowData.tags)
        ? workflowData.tags.map((tag: any) =>
            typeof tag === "string" ? tag : tag.name || tag.id || ""
          ).filter((tag: string) => tag !== "")
        : [];

      // Transform response
      const transformed = {
        id: workflowData.id,
        name: workflowData.name,
        active: workflowData.active || false,
        tags,
        createdAt: workflowData.createdAt,
        updatedAt: workflowData.updatedAt,
        nodeCount: workflowData.nodes?.length || 0,
      };

      return WorkflowSummarySchema.parse(transformed);
    } catch (error) {
      console.error(`Failed to update workflow ${id}:`, error);
      throw new Error(
        `Failed to update workflow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error("Workflow ID is required");
      }

      await this.httpClient.delete(`/api/v1/workflows/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete workflow ${id}:`, error);
      throw new Error(
        `Failed to delete workflow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  /**
   * Set workflow active/inactive status
   */
  async setWorkflowActive(id: string, active: boolean): Promise<boolean> {
    try {
      if (!id) {
        throw new Error("Workflow ID is required");
      }

      await this.httpClient.patch(`/api/v1/workflows/${id}`, { active });
      return true;
    } catch (error) {
      console.error(`Failed to set workflow ${id} active status:`, error);
      throw new Error(
        `Failed to set workflow active status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
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
