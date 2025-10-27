/**
 * MCP tool response builder
 */

import type {
  MCPToolResponse,
  WorkflowListResponse,
  WorkflowDetailResponse,
  WorkflowDeleteResponse,
  WorkflowSummary,
  WorkflowDetail,
} from "../types/index.js";
import { WorkflowFormatter } from "./workflow-formatter.js";
import { ContextMinimizer } from "./context-minimizer.js";

/**
 * Tool response builder implementation
 */
export class ToolResponseBuilder {
  private workflowFormatter: WorkflowFormatter;
  private contextMinimizer: ContextMinimizer;

  constructor() {
    this.workflowFormatter = new WorkflowFormatter();
    this.contextMinimizer = new ContextMinimizer();
  }

  /**
   * Create response for list_workflows tool
   */
  createListWorkflowsResponse(
    workflows: unknown[],
    raw = false
  ): MCPToolResponse<WorkflowListResponse | WorkflowSummary[]> {
    if (raw) {
      // Return formatted workflow summaries (current behavior)
      const formattedWorkflows = workflows.map((workflow: unknown) =>
        this.workflowFormatter.formatWorkflowSummary(workflow)
      );
      return {
        success: true,
        message: `${String(workflows.length)}件のワークフローを取得しました`,
        data: formattedWorkflows,
      };
    }

    // Default: minimal response
    const minimalWorkflows = workflows.map((workflow: unknown) => {
      const wf = workflow as Record<string, unknown>;
      return {
        id: wf.id as string,
        name: wf.name as string,
        active: wf.active as boolean,
      };
    });

    return {
      success: true,
      message: `${String(workflows.length)}件のワークフローを取得しました`,
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
    raw = false
  ): MCPToolResponse<WorkflowDetailResponse | WorkflowDetail> {
    if (raw) {
      // Return formatted workflow detail (current behavior)
      const formattedWorkflow = this.workflowFormatter.formatWorkflowDetail(workflow);
      const minimizedWorkflow = this.contextMinimizer.minimizeContext(formattedWorkflow);
      return {
        success: true,
        message: "ワークフローを取得しました",
        data: minimizedWorkflow,
      };
    }

    // Default: minimal response
    const wf = workflow as Record<string, unknown>;
    return {
      success: true,
      message: "ワークフローを取得しました",
      data: {
        id: wf.id as string,
        name: wf.name as string,
        active: wf.active as boolean,
        nodeCount: (wf.nodes as unknown[]).length,
        tags: wf.tags as string[],
      },
    };
  }

  /**
   * Create response for create_workflow tool
   */
  createCreateWorkflowResponse(
    workflow: unknown,
    raw = false
  ): MCPToolResponse {
    if (raw) {
      // Return full workflow data
      return {
        success: true,
        message: "ワークフローを作成しました",
        data: workflow,
      };
    }

    // Default: minimal response
    const wf = workflow as Record<string, unknown>;
    return {
      success: true,
      message: "ワークフローを作成しました",
      data: {
        id: wf.id as string,
        name: wf.name as string,
        active: wf.active as boolean,
      },
    };
  }

  /**
   * Create response for update_workflow tool
   */
  createUpdateWorkflowResponse(
    workflow: unknown,
    raw = false
  ): MCPToolResponse {
    if (raw) {
      // Return full workflow data
      return {
        success: true,
        message: "ワークフローを更新しました",
        data: workflow,
      };
    }

    // Default: minimal response
    const wf = workflow as Record<string, unknown>;
    return {
      success: true,
      message: "ワークフローを更新しました",
      data: {
        id: wf.id as string,
        name: wf.name as string,
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

  /**
   * Create response for get_workflow_connections tool
   */
  createGetWorkflowConnectionsResponse(
    workflow: unknown,
    raw = false
  ): MCPToolResponse {
    const wf = workflow as Record<string, unknown>;
    const graph = this.workflowFormatter.formatWorkflowConnections(workflow);

    if (raw) {
      return {
        success: true,
        message: "ワークフロー接続情報を取得しました",
        data: {
          id: wf.id as string,
          name: wf.name as string,
          graph,
          rawConnections: wf.connections,
        },
      };
    }

    return {
      success: true,
      message: "ワークフロー接続情報を取得しました",
      data: {
        id: wf.id as string,
        name: wf.name as string,
        graph,
      },
    };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ToolResponseBuilder", () => {
    const builder = new ToolResponseBuilder();

    describe("createListWorkflowsResponse", () => {
      it("should create minimal response by default", () => {
        const workflows = [
          { id: "1", name: "Workflow 1", active: true, nodes: [] },
        ];

        const result = builder.createListWorkflowsResponse(workflows, false);

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

        const result = builder.createListWorkflowsResponse(workflows, true);

        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
      });
    });

    describe("createGetWorkflowConnectionsResponse", () => {
      it("should create minimal response by default", () => {
        const workflow = {
          id: "wf-1",
          name: "Test Workflow",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start" },
            { id: "node2", name: "HTTP", type: "n8n-nodes-base.httpRequest" },
          ],
          connections: {
            Start: {
              main: [[{ node: "HTTP", type: "main", index: 0 }]],
            },
          },
        };

        const result = builder.createGetWorkflowConnectionsResponse(workflow, false);

        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty("id");
        expect(result.data).toHaveProperty("name");
        expect(result.data).toHaveProperty("graph");
        expect(Array.isArray((result.data as Record<string, unknown>).graph)).toBe(true);
      });

      it("should create full response with raw=true", () => {
        const workflow = {
          id: "wf-1",
          name: "Test Workflow",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start" },
          ],
          connections: {},
        };

        const result = builder.createGetWorkflowConnectionsResponse(workflow, true);

        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty("id");
        expect(result.data).toHaveProperty("name");
        expect(result.data).toHaveProperty("graph");
        expect(result.data).toHaveProperty("rawConnections");
      });
    });
  });
}
