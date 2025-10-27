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
type N8nWorkflowResponse = {
  id: string;
  name: string;
  active: boolean;
  tags?: (ITag | string)[];
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
    timeout = 30000,
    retryAttempts = 3,
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
      (this.httpClient).updateHeaders(headers);

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
      const validatedOptions = ListOptionsSchema.parse(options ?? {}) as Partial<ListOptions>;
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    workflow: Partial<WorkflowDefinition>,
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
  private sanitizeWorkflowForUpdate(workflow: Partial<WorkflowDefinition>): WorkflowUpdatePayload {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return tags.map((tag) => (typeof tag === "string" ? tag : tag.name ?? ""));
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
      nodeCount: workflow.nodes?.length ?? 0,
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
      nodes: workflow.nodes ?? [],
      connections: workflow.connections ?? {},
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

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi, afterEach } = import.meta.vitest;

  describe("N8nApiClientImpl", () => {
    let client: N8nApiClientImpl;
    let mockHttpClient: any;
    let mockAuthManager: any;
    const baseUrl = "http://localhost:5678";

    beforeEach(() => {
      client = new N8nApiClientImpl(baseUrl, 5000, 3);

      // Mock HTTP client
      mockHttpClient = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
        updateHeaders: vi.fn(),
        updateBaseURL: vi.fn(),
      };
      // @ts-expect-error - private member access
      client.httpClient = mockHttpClient;

      // Mock Auth manager
      mockAuthManager = {
        validateCredentials: vi.fn().mockReturnValue(true),
        setCredentials: vi.fn().mockReturnValue(true),
        getAuthHeaders: vi.fn().mockReturnValue({ "X-N8N-API-KEY": "test-key" }),
        isAuthenticated: vi.fn().mockReturnValue(true),
        getCredentials: vi.fn(),
        clearAuth: vi.fn(),
      };
      // @ts-expect-error - private member access
      client.authManager = mockAuthManager;

      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe("authenticate", () => {
      it("should authenticate successfully with valid credentials", async () => {
        const credentials = { baseUrl, apiKey: "test-key" };
        mockHttpClient.get.mockResolvedValue([]);

        const result = await client.authenticate(credentials);

        expect(result).toBe(true);
        expect(mockAuthManager.validateCredentials).toHaveBeenCalledWith(credentials);
        expect(mockAuthManager.setCredentials).toHaveBeenCalledWith(credentials);
        expect(mockHttpClient.updateHeaders).toHaveBeenCalledWith({
          "X-N8N-API-KEY": "test-key",
        });
      });

      it("should fail authentication with invalid credentials", async () => {
        const credentials = { baseUrl, apiKey: "test-key" };
        mockAuthManager.validateCredentials.mockReturnValue(false);

        const result = await client.authenticate(credentials);

        expect(result).toBe(false);
        expect(mockAuthManager.setCredentials).not.toHaveBeenCalled();
      });

      it("should fail if setting credentials fails", async () => {
        const credentials = { baseUrl, apiKey: "test-key" };
        mockAuthManager.setCredentials.mockReturnValue(false);

        const result = await client.authenticate(credentials);

        expect(result).toBe(false);
      });

      it("should fail if connection test fails", async () => {
        const credentials = { baseUrl, apiKey: "test-key" };
        mockHttpClient.get.mockRejectedValue(new Error("Connection failed"));

        const result = await client.authenticate(credentials);

        expect(result).toBe(false);
      });
    });

    describe("getWorkflows", () => {
      it("should get workflows without options", async () => {
        const mockWorkflows = [
          {
            id: "1",
            name: "Test Workflow",
            active: true,
            tags: [{ name: "test" }],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-02",
            nodes: [{ name: "Start" }],
          },
        ];
        mockHttpClient.get.mockResolvedValue(mockWorkflows);

        const result = await client.getWorkflows();

        expect(result).toEqual([
          {
            id: "1",
            name: "Test Workflow",
            active: true,
            tags: ["test"],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-02",
            nodeCount: 1,
          },
        ]);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/api/v1/workflows");
      });

      it("should get workflows with options", async () => {
        const options = {
          active: true,
          tags: ["tag1", "tag2"],
          limit: 10,
          offset: 5,
        };
        mockHttpClient.get.mockResolvedValue([]);

        await client.getWorkflows(options);

        expect(mockHttpClient.get).toHaveBeenCalledWith(
          "/api/v1/workflows?active=true&tags=tag1%2Ctag2&limit=10&offset=5"
        );
      });

      it("should normalize wrapped response", async () => {
        const mockResponse = {
          data: [
            {
              id: "1",
              name: "Test",
              active: false,
              createdAt: "2024-01-01",
              updatedAt: "2024-01-02"
            }
          ]
        };
        mockHttpClient.get.mockResolvedValue(mockResponse);

        const result = await client.getWorkflows();

        expect(result).toHaveLength(1);
        expect(result[0]?.name).toBe("Test");
        expect(result[0]?.createdAt).toBe("2024-01-01");
        expect(result[0]?.updatedAt).toBe("2024-01-02");
      });

      it("should handle string tags", async () => {
        const mockWorkflows = [
          {
            id: "1",
            name: "Test",
            active: true,
            tags: ["tag1", "tag2"],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-02",
          },
        ];
        mockHttpClient.get.mockResolvedValue(mockWorkflows);

        const result = await client.getWorkflows();

        expect(result[0]?.tags).toEqual(["tag1", "tag2"]);
      });

      it("should handle missing tags", async () => {
        const mockWorkflows = [
          {
            id: "1",
            name: "Test",
            active: true,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-02",
          },
        ];
        mockHttpClient.get.mockResolvedValue(mockWorkflows);

        const result = await client.getWorkflows();

        expect(result[0]?.tags).toEqual([]);
      });

      it("should handle API errors", async () => {
        mockHttpClient.get.mockRejectedValue(new Error("API Error"));

        await expect(client.getWorkflows()).rejects.toThrow("Failed to get workflows");
      });
    });

    describe("getWorkflow", () => {
      it("should get workflow by id", async () => {
        const mockWorkflow = {
          id: "1",
          name: "Test Workflow",
          active: true,
          tags: [{ name: "test" }],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodes: [{ name: "Start", type: "n8n-nodes-base.start" }],
          connections: {},
          settings: { executionOrder: "v1" },
        };
        mockHttpClient.get.mockResolvedValue(mockWorkflow);

        const result = await client.getWorkflow("1");

        expect(result).toEqual({
          id: "1",
          name: "Test Workflow",
          active: true,
          tags: ["test"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodes: [{ name: "Start", type: "n8n-nodes-base.start" }],
          connections: {},
          settings: { executionOrder: "v1" },
        });
        expect(mockHttpClient.get).toHaveBeenCalledWith("/api/v1/workflows/1");
      });

      it("should throw error for empty id", async () => {
        await expect(client.getWorkflow("")).rejects.toThrow("Workflow ID is required");
      });

      it("should handle API errors", async () => {
        mockHttpClient.get.mockRejectedValue(new Error("Not found"));

        await expect(client.getWorkflow("1")).rejects.toThrow("Failed to get workflow 1");
      });
    });

    describe("createWorkflow", () => {
      it("should create workflow successfully", async () => {
        const workflow: WorkflowDefinition = {
          name: "New Workflow",
          nodes: [],
          connections: {},
          settings: {},
          active: false,
          tags: ["test"],
        };
        const mockResponse = {
          id: "new-id",
          ...workflow,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        };
        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await client.createWorkflow(workflow);

        expect(result.id).toBe("new-id");
        expect(result.name).toBe("New Workflow");

        // Verify that active field is stripped from request
        const postCall = mockHttpClient.post.mock.calls[0];
        expect(postCall[0]).toBe("/api/v1/workflows");
        expect(postCall[1]).not.toHaveProperty("active");
        expect(postCall[1]).toHaveProperty("name", "New Workflow");
      });

      it("should throw error if name is missing", async () => {
        const workflow = { nodes: [], connections: {}, active: false } as unknown as WorkflowDefinition;

        await expect(client.createWorkflow(workflow)).rejects.toThrow(
          "Workflow name is required"
        );
      });

      it("should handle API errors", async () => {
        const workflow = { name: "Test", nodes: [], connections: {}, active: false } as WorkflowDefinition;
        mockHttpClient.post.mockRejectedValue(new Error("API Error"));

        await expect(client.createWorkflow(workflow)).rejects.toThrow(
          "Failed to create workflow"
        );
      });
    });

    describe("updateWorkflow", () => {
      it("should update workflow successfully", async () => {
        const workflow: WorkflowDefinition = {
          name: "Updated Workflow",
          nodes: [],
          connections: {},
          active: true, // Should be removed
        };
        const mockResponse = {
          id: "1",
          ...workflow,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
        };
        mockHttpClient.put.mockResolvedValue(mockResponse);

        const result = await client.updateWorkflow("1", workflow);

        expect(result.name).toBe("Updated Workflow");

        // Verify that active and id fields are stripped from request
        const putCall = mockHttpClient.put.mock.calls[0];
        expect(putCall[0]).toBe("/api/v1/workflows/1");
        expect(putCall[1]).not.toHaveProperty("active");
        expect(putCall[1]).not.toHaveProperty("id");
        expect(putCall[1]).toHaveProperty("name", "Updated Workflow");
      });

      it("should throw error for empty id", async () => {
        const workflow = { name: "Test" } as WorkflowDefinition;

        await expect(client.updateWorkflow("", workflow)).rejects.toThrow(
          "Workflow ID is required"
        );
      });

      it("should handle API errors", async () => {
        const workflow = { name: "Test" } as WorkflowDefinition;
        mockHttpClient.put.mockRejectedValue(new Error("Update failed"));

        await expect(client.updateWorkflow("1", workflow)).rejects.toThrow(
          "Failed to update workflow 1"
        );
      });
    });

    describe("deleteWorkflow", () => {
      it("should delete workflow successfully", async () => {
        mockHttpClient.delete.mockResolvedValue({});

        const result = await client.deleteWorkflow("1");

        expect(result).toBe(true);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/api/v1/workflows/1");
      });

      it("should throw error for empty id", async () => {
        await expect(client.deleteWorkflow("")).rejects.toThrow("Workflow ID is required");
      });

      it("should handle API errors", async () => {
        mockHttpClient.delete.mockRejectedValue(new Error("Delete failed"));

        await expect(client.deleteWorkflow("1")).rejects.toThrow(
          "Failed to delete workflow 1"
        );
      });
    });

    describe("testConnection", () => {
      it("should return true on successful connection", async () => {
        mockHttpClient.get.mockResolvedValue([]);

        const result = await client.testConnection();

        expect(result).toBe(true);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/api/v1/workflows?limit=1");
      });

      it("should return false on connection failure", async () => {
        mockHttpClient.get.mockRejectedValue(new Error("Connection failed"));

        const result = await client.testConnection();

        expect(result).toBe(false);
      });
    });

    describe("private methods", () => {
      describe("normalizeTagsFromResponse", () => {
        it("should normalize tag objects to strings", () => {
          // @ts-expect-error - private member access
          const result = client.normalizeTagsFromResponse([
            { name: "tag1" },
            { name: "tag2" },
          ]);
          expect(result).toEqual(["tag1", "tag2"]);
        });

        it("should keep string tags as is", () => {
          // @ts-expect-error - private member access
          const result = client.normalizeTagsFromResponse(["tag1", "tag2"]);
          expect(result).toEqual(["tag1", "tag2"]);
        });

        it("should handle null/undefined tags", () => {
          // @ts-expect-error - private member access
          expect(client.normalizeTagsFromResponse(null)).toEqual([]);
          // @ts-expect-error - private member access
          expect(client.normalizeTagsFromResponse(undefined)).toEqual([]);
        });

        it("should handle non-array tags", () => {
          // @ts-expect-error - private member access
          expect(client.normalizeTagsFromResponse("invalid")).toEqual([]);
        });
      });

      describe("buildQueryParams", () => {
        it("should build query params correctly", () => {
          const options = {
            active: true,
            tags: ["tag1", "tag2"],
            limit: 10,
            offset: 5,
          };

          // @ts-expect-error - private member access
          const params = client.buildQueryParams(options);

          expect(params.toString()).toBe("active=true&tags=tag1%2Ctag2&limit=10&offset=5");
        });

        it("should handle active=false", () => {
          const options = { active: false };

          // @ts-expect-error - private member access
          const params = client.buildQueryParams(options);

          expect(params.toString()).toBe("active=false");
        });

        it("should handle empty options", () => {
          // @ts-expect-error - private member access
          const params = client.buildQueryParams({});

          expect(params.toString()).toBe("");
        });

        it("should handle offset=0", () => {
          const options = { offset: 0 };

          // @ts-expect-error - private member access
          const params = client.buildQueryParams(options);

          expect(params.toString()).toBe("offset=0");
        });
      });
    });
  });
}
