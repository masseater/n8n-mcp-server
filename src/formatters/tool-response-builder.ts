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
  ExecutionSummary,
  NodeExecutionData,
} from "../types/index.js";
import type { Execution } from "../generated/types.gen.js";
import type { WorkflowDetailInternal } from "../clients/n8n-api-client.js";
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
   * Template method for creating MCP tool responses
   * Handles the common pattern of raw vs minimal responses
   */
  private createResponse<TRaw, TMinimal = TRaw>(
    message: string,
    rawData: TRaw,
    minimalData: TMinimal,
    raw: boolean
  ): MCPToolResponse<TRaw | TMinimal> {
    return {
      success: true,
      message,
      data: raw ? rawData : minimalData,
    };
  }

  /**
   * Create response for list_workflows tool
   */
  createListWorkflowsResponse(
    workflows: WorkflowSummary[],
    raw = false
  ): MCPToolResponse<WorkflowListResponse | WorkflowSummary[]> {
    if (raw) {
      return {
        success: true,
        message: `${String(workflows.length)}件のワークフローを取得しました`,
        data: workflows,
      };
    }

    // Default: minimal response
    const minimalWorkflows = workflows.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
    }));

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
    workflow: WorkflowDetailInternal,
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
    return {
      success: true,
      message: "ワークフローを取得しました",
      data: {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodeCount: workflow.nodes.length,
        tags: workflow.tags,
      },
    };
  }

  /**
   * Create response for create_workflow tool
   */
  createCreateWorkflowResponse(
    workflow: WorkflowDetailInternal,
    raw = false
  ): MCPToolResponse {
    const message = "ワークフローを作成しました";

    const minimalData = {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
    };

    return this.createResponse(message, workflow, minimalData, raw);
  }

  /**
   * Create response for update_workflow tool
   */
  createUpdateWorkflowResponse(
    workflow: WorkflowDetailInternal,
    raw = false
  ): MCPToolResponse {
    const message = "ワークフローを更新しました";

    const minimalData = {
      id: workflow.id,
      name: workflow.name,
    };

    return this.createResponse(message, workflow, minimalData, raw);
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
    workflow: WorkflowDetailInternal,
    raw = false
  ): MCPToolResponse {
    const graph = this.workflowFormatter.formatWorkflowConnections(workflow);

    if (raw) {
      return {
        success: true,
        message: "ワークフロー接続情報を取得しました",
        data: {
          id: workflow.id,
          name: workflow.name,
          graph,
          rawConnections: workflow.connections,
        },
      };
    }

    return {
      success: true,
      message: "ワークフロー接続情報を取得しました",
      data: {
        id: workflow.id,
        name: workflow.name,
        graph,
      },
    };
  }

  /**
   * Create response for list_executions tool
   */
  createListExecutionsResponse(
    executions: Execution[],
    raw = false
  ): MCPToolResponse {
    const message = `${String(executions.length)}件の実行履歴を取得しました`;

    // Minimal response: extract only essential fields
    const minimalExecutions = executions.map(e => ({
      id: e.id,
      workflowId: e.workflowId,
      status: e.status,
      startedAt: e.startedAt,
    }));

    const minimalData = {
      count: executions.length,
      executions: minimalExecutions,
    };

    return this.createResponse(message, executions, minimalData, raw);
  }

  /**
   * Create response for get_execution tool (Phase 2: Progressive Execution Loading)
   * Returns ExecutionSummary (500-1,000 tokens)
   */
  createExecutionSummaryResponse(
    summary: ExecutionSummary
  ): MCPToolResponse<ExecutionSummary> {
    return {
      success: true,
      message: '実行サマリーを取得しました',
      data: summary,
    };
  }

  /**
   * Create response for get_execution_by_node tool (Phase 5: Progressive Execution Loading)
   * Returns NodeExecutionData (complete node execution data)
   */
  createExecutionByNodeResponse(
    nodeData: NodeExecutionData
  ): MCPToolResponse<NodeExecutionData> {
    return {
      success: true,
      message: `ノード '${nodeData.nodeName}' の実行詳細を取得しました`,
      data: nodeData,
    };
  }

  /**
   * Create response for get_execution tool (legacy, kept for compatibility)
   * @deprecated Use createExecutionSummaryResponse instead
   */
  createGetExecutionResponse(
    execution: Execution,
    raw = false
  ): MCPToolResponse {
    const message = '実行詳細を取得しました';

    // Minimal response: extract only essential fields
    const minimalData = {
      id: execution.id,
      workflowId: execution.workflowId,
      status: execution.status,
      startedAt: execution.startedAt,
      stoppedAt: execution.stoppedAt,
    };

    return this.createResponse(message, execution, minimalData, raw);
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ToolResponseBuilder", () => {
    const builder = new ToolResponseBuilder();

    describe("createListWorkflowsResponse", () => {
      it("should create minimal response by default", () => {
        const workflows = [
          { id: "1", name: "Workflow 1", active: true, tags: [], createdAt: "2024-01-01", updatedAt: "2024-01-01", nodeCount: 0 },
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
            tags: ["test"],
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
            nodeCount: 0,
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
          active: true,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start", typeVersion: 1, position: [250, 300] as [number, number], parameters: {} },
            { id: "node2", name: "HTTP", type: "n8n-nodes-base.httpRequest", typeVersion: 1, position: [450, 300] as [number, number], parameters: {} },
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
          active: true,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start", typeVersion: 1, position: [250, 300] as [number, number], parameters: {} },
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
