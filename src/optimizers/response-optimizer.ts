/**
 * Response optimizer for context efficiency
 */

import type {
  WorkflowDetail,
  WorkflowSummary,
  MCPToolResponse,
  WorkflowListResponse,
  WorkflowDetailResponse,
  WorkflowCreateResponse,
  WorkflowUpdateResponse,
  WorkflowDeleteResponse,
} from "../types/index.js";

/**
 * Response optimizer implementation
 */
export class ResponseOptimizerImpl {
  private maxSize: number;
  private defaultPageSize: number;

  constructor(maxSize: number = 100000, defaultPageSize: number = 50) {
    this.maxSize = maxSize;
    this.defaultPageSize = defaultPageSize;
  }

  /**
   * Optimize workflow summary for context efficiency
   */
  optimizeWorkflowSummary(workflow: any): WorkflowSummary {
    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active || false,
      tags: workflow.tags || [],
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodeCount: workflow.nodes?.length || 0,
    };
  }

  /**
   * Optimize multiple workflows for context efficiency
   */
  optimizeWorkflows(workflows: any[]): WorkflowSummary[] {
    return workflows.map((workflow) => this.optimizeWorkflowSummary(workflow));
  }

  /**
   * Optimize workflow detail for context efficiency
   */
  optimizeWorkflowDetail(workflow: any): WorkflowDetail {
    // Extract only essential node information
    const optimizedNodes = (workflow.nodes || []).map((node: any) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      position: node.position,
      disabled: node.disabled || false,
    }));

    // Simplify connections structure
    const optimizedConnections = this.optimizeConnections(
      workflow.connections || {},
    );

    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active || false,
      tags: workflow.tags || [],
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodes: optimizedNodes,
      connections: optimizedConnections,
      settings: workflow.settings
        ? this.optimizeSettings(workflow.settings)
        : undefined,
    };
  }

  /**
   * Minimize context size by removing unnecessary fields
   */
  minimizeContext<T>(data: T, maxSize?: number): T {
    const sizeLimit = maxSize || this.maxSize;
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= sizeLimit) {
      return data;
    }

    // If data is too large, try to reduce it
    if (Array.isArray(data)) {
      return this.minimizeArray(data, sizeLimit) as T;
    } else if (typeof data === "object" && data !== null) {
      return this.minimizeObject(data, sizeLimit) as T;
    }

    return data;
  }

  /**
   * Apply pagination to large result sets
   */
  paginate<T>(
    data: T[],
    limit: number = this.defaultPageSize,
    offset: number = 0,
  ): {
    data: T[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  } {
    const total = data.length;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedData = data.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return {
      data: paginatedData,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
      },
    };
  }

  /**
   * Optimize connections structure
   */
  private optimizeConnections(connections: any): any {
    if (!connections || typeof connections !== "object") {
      return {};
    }

    const optimized: any = {};

    for (const [sourceNode, targets] of Object.entries(connections)) {
      if (typeof targets === "object" && targets !== null) {
        optimized[sourceNode] = {};

        for (
          const [outputName, connections] of Object.entries(targets as any)
        ) {
          if (Array.isArray(connections)) {
            optimized[sourceNode][outputName] = connections.map((
              conn: any,
            ) => ({
              node: conn.node,
              type: conn.type,
              index: conn.index,
            }));
          }
        }
      }
    }

    return optimized;
  }

  /**
   * Optimize workflow settings
   */
  private optimizeSettings(settings: any): any {
    return {
      executionOrder: settings.executionOrder,
      saveManualExecutions: settings.saveManualExecutions,
      saveExecutionProgress: settings.saveExecutionProgress,
      saveDataErrorExecution: settings.saveDataErrorExecution,
      saveDataSuccessExecution: settings.saveDataSuccessExecution,
      timezone: settings.timezone,
    };
  }

  /**
   * Minimize array data
   */
  private minimizeArray<T>(data: T[], maxSize: number): T[] {
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= maxSize) {
      return data;
    }

    // Try to reduce array size by taking fewer items
    const targetSize = Math.floor(maxSize * 0.8); // Leave some buffer
    const itemSize = jsonString.length / data.length;
    const maxItems = Math.floor(targetSize / itemSize);

    return data.slice(0, Math.max(1, maxItems));
  }

  /**
   * Minimize object data
   */
  private minimizeObject<T>(data: T, maxSize: number): T {
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= maxSize) {
      return data;
    }

    // Remove less important fields
    if (typeof data === "object" && data !== null) {
      const optimized = { ...data } as any;

      // Remove execution logs and verbose data
      delete optimized.executionLogs;
      delete optimized.executionData;
      delete optimized.verbose;

      // Check if still too large
      const newJsonString = JSON.stringify(optimized);
      if (newJsonString.length <= maxSize) {
        return optimized as T;
      }
    }

    return data;
  }

  /**
   * Create response for list_workflows tool
   */
  createListWorkflowsResponse(
    workflows: unknown[],
    raw: boolean = false
  ): MCPToolResponse<WorkflowListResponse | WorkflowSummary[]> {
    if (raw) {
      // Return optimized workflow summaries (current behavior)
      const optimizedWorkflows = workflows.map((workflow: unknown) =>
        this.optimizeWorkflowSummary(workflow)
      );
      return {
        success: true,
        message: `${workflows.length}件のワークフローを取得しました`,
        data: optimizedWorkflows,
      };
    }

    // Default: minimal response
    const minimalWorkflows = workflows.map((workflow: any) => ({
      id: workflow.id,
      name: workflow.name,
      active: workflow.active || false,
    }));

    return {
      success: true,
      message: `${workflows.length}件のワークフローを取得しました`,
      data: {
        count: workflows.length,
        workflows: minimalWorkflows,
      },
    };
  }

  /**
   * Create response for get_workflow tool
   */
  createGetWorkflowResponse(
    workflow: unknown,
    raw: boolean = false
  ): MCPToolResponse<WorkflowDetailResponse | WorkflowDetail> {
    if (raw) {
      // Return optimized workflow detail (current behavior)
      const optimizedWorkflow = this.optimizeWorkflowDetail(workflow);
      const minimizedWorkflow = this.minimizeContext(optimizedWorkflow);
      return {
        success: true,
        message: "ワークフローを取得しました",
        data: minimizedWorkflow,
      };
    }

    // Default: minimal response
    const wf = workflow as any;
    return {
      success: true,
      message: "ワークフローを取得しました",
      data: {
        id: wf.id,
        name: wf.name,
        active: wf.active || false,
        nodeCount: wf.nodes?.length || 0,
        tags: wf.tags || [],
      },
    };
  }

  /**
   * Create response for create_workflow tool
   */
  createCreateWorkflowResponse(
    workflow: unknown,
    raw: boolean = false
  ): MCPToolResponse<WorkflowCreateResponse | unknown> {
    if (raw) {
      // Return full workflow data
      return {
        success: true,
        message: "ワークフローを作成しました",
        data: workflow,
      };
    }

    // Default: minimal response
    const wf = workflow as any;
    return {
      success: true,
      message: "ワークフローを作成しました",
      data: {
        id: wf.id,
        name: wf.name,
        active: wf.active || false,
      },
    };
  }

  /**
   * Create response for update_workflow tool
   */
  createUpdateWorkflowResponse(
    workflow: unknown,
    raw: boolean = false
  ): MCPToolResponse<WorkflowUpdateResponse | unknown> {
    if (raw) {
      // Return full workflow data
      return {
        success: true,
        message: "ワークフローを更新しました",
        data: workflow,
      };
    }

    // Default: minimal response
    const wf = workflow as any;
    return {
      success: true,
      message: "ワークフローを更新しました",
      data: {
        id: wf.id,
        name: wf.name,
      },
    };
  }

  /**
   * Create response for delete_workflow tool
   */
  createDeleteWorkflowResponse(
    workflowId: string
  ): MCPToolResponse<WorkflowDeleteResponse> {
    return {
      success: true,
      message: "ワークフローを削除しました",
      data: {
        id: workflowId,
      },
    };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ResponseOptimizerImpl", () => {
    const optimizer = new ResponseOptimizerImpl();

    describe("optimizeWorkflowSummary", () => {
      it("should extract essential workflow fields", () => {
        const workflow = {
          id: "workflow-1",
          name: "Test Workflow",
          active: true,
          tags: ["test"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodes: [{ id: "node1" }, { id: "node2" }],
          connections: {},
          settings: {},
        };

        const result = optimizer.optimizeWorkflowSummary(workflow);

        expect(result).toEqual({
          id: "workflow-1",
          name: "Test Workflow",
          active: true,
          tags: ["test"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodeCount: 2,
        });
      });

      it("should handle missing optional fields", () => {
        const workflow = {
          id: "workflow-1",
          name: "Test Workflow",
        };

        const result = optimizer.optimizeWorkflowSummary(workflow);

        expect(result).toEqual({
          id: "workflow-1",
          name: "Test Workflow",
          active: false,
          tags: [],
          createdAt: undefined,
          updatedAt: undefined,
          nodeCount: 0,
        });
      });
    });

    describe("optimizeWorkflows", () => {
      it("should optimize multiple workflows", () => {
        const workflows = [
          { id: "1", name: "Workflow 1", nodes: [{}] },
          { id: "2", name: "Workflow 2", nodes: [{}, {}] },
        ];

        const result = optimizer.optimizeWorkflows(workflows);

        expect(result).toHaveLength(2);
        expect(result[0]?.nodeCount).toBe(1);
        expect(result[1]?.nodeCount).toBe(2);
      });
    });

    describe("paginate", () => {
      it("should paginate data correctly", () => {
        const data = Array.from({ length: 100 }, (_, i) => i);

        const result = optimizer.paginate(data, 10, 0);

        expect(result.data).toHaveLength(10);
        expect(result.data[0]).toBe(0);
        expect(result.data[9]).toBe(9);
        expect(result.pagination.total).toBe(100);
        expect(result.pagination.hasMore).toBe(true);
      });

      it("should handle last page", () => {
        const data = Array.from({ length: 25 }, (_, i) => i);

        const result = optimizer.paginate(data, 10, 20);

        expect(result.data).toHaveLength(5);
        expect(result.pagination.hasMore).toBe(false);
      });
    });

    describe("createListWorkflowsResponse", () => {
      it("should create minimal response by default", () => {
        const workflows = [
          { id: "1", name: "Workflow 1", active: true, nodes: [] },
        ];

        const result = optimizer.createListWorkflowsResponse(workflows, false);

        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty("count");
        expect(result.data).toHaveProperty("workflows");
      });

      it("should create full response with raw=true", () => {
        const workflows = [
          {
            id: "1",
            name: "Workflow 1",
            active: true,
            nodes: [],
            tags: ["test"],
          },
        ];

        const result = optimizer.createListWorkflowsResponse(workflows, true);

        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
      });
    });
  });
}
