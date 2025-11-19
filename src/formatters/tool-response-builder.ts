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
import type { INode } from "../types/n8n-types.js";
import { WorkflowFormatter } from "./workflow-formatter.js";
import { ContextMinimizer } from "./context-minimizer.js";

/**
 * Tool response builder implementation
 */
export class ToolResponseBuilder {
  private readonly workflowFormatter: WorkflowFormatter;
  private readonly contextMinimizer: ContextMinimizer;

  constructor() {
    this.workflowFormatter = new WorkflowFormatter();
    this.contextMinimizer = new ContextMinimizer();
  }

  /**
   * Template method for creating MCP tool responses
   * Handles the common pattern of raw vs minimal responses
   */
  private createResponse<TRaw, TMinimal = TRaw>(
    rawData: TRaw,
    minimalData: TMinimal,
    raw: boolean
  ): MCPToolResponse<TRaw | TMinimal> {
    return raw ? rawData : minimalData;
  }

  /**
   * Create response for list_workflows tool
   */
  createListWorkflowsResponse(
    workflows: WorkflowSummary[],
    raw = false
  ): MCPToolResponse<WorkflowListResponse | WorkflowSummary[]> {
    if (raw) {
      return workflows;
    }

    // Default: minimal response
    const minimalWorkflows = workflows.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
    }));

    return {
      count: workflows.length,
      workflows: minimalWorkflows,
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
      return this.contextMinimizer.minimizeContext(formattedWorkflow);
    }

    // Default: minimal response
    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
      nodeCount: workflow.nodes.length,
      tags: workflow.tags,
    };
  }

  /**
   * Create response for create_workflow tool
   */
  createCreateWorkflowResponse(
    workflow: WorkflowDetailInternal,
    raw = false
  ): MCPToolResponse {
    const minimalData = {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
    };

    return this.createResponse(workflow, minimalData, raw);
  }

  /**
   * Create response for update_workflow tool
   */
  createUpdateWorkflowResponse(
    workflow: WorkflowDetailInternal,
    raw = false
  ): MCPToolResponse {
    const minimalData = {
      id: workflow.id,
      name: workflow.name,
    };

    return this.createResponse(workflow, minimalData, raw);
  }

  /**
   * Create response for delete_workflow tool
   */
  createDeleteWorkflowResponse(
    workflowId: string
  ): MCPToolResponse<WorkflowDeleteResponse> {
    return {
      id: workflowId,
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
        id: workflow.id,
        name: workflow.name,
        graph,
        rawConnections: workflow.connections,
      };
    }

    return {
      id: workflow.id,
      name: workflow.name,
      graph,
    };
  }

  /**
   * Create response for get_workflow_node tool
   */
  createGetWorkflowNodeResponse(
    node: INode,
    raw = false
  ): MCPToolResponse<INode> {
    if (raw) {
      return node;
    }

    // Minimal response: remove UI-only fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { position, notesInFlow, ...minimalNode } = node;

    return minimalNode as INode;
  }

  /**
   * Create response for list_executions tool
   */
  createListExecutionsResponse(
    executions: Execution[],
    raw = false
  ): MCPToolResponse {
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

    return this.createResponse(executions, minimalData, raw);
  }

  /**
   * Create response for get_execution tool (Phase 2: Progressive Execution Loading)
   * Returns ExecutionSummary (500-1,000 tokens)
   */
  createExecutionSummaryResponse(
    summary: ExecutionSummary
  ): MCPToolResponse<ExecutionSummary> {
    return summary;
  }

  /**
   * Create response for get_execution_by_node tool (Phase 5: Progressive Execution Loading)
   * Returns NodeExecutionData (complete node execution data)
   */
  createExecutionByNodeResponse(
    nodeData: NodeExecutionData
  ): MCPToolResponse<NodeExecutionData> {
    return nodeData;
  }

  /**
   * Create response for get_execution tool (legacy, kept for compatibility)
   * @deprecated Use createExecutionSummaryResponse instead
   */
  createGetExecutionResponse(
    execution: Execution,
    raw = false
  ): MCPToolResponse {
    // Minimal response: extract only essential fields
    const minimalData = {
      id: execution.id,
      workflowId: execution.workflowId,
      status: execution.status,
      startedAt: execution.startedAt,
      stoppedAt: execution.stoppedAt,
    };

    return this.createResponse(execution, minimalData, raw);
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

        const result = builder.createListWorkflowsResponse(workflows, false) as WorkflowListResponse;

        expect(result).toHaveProperty("count");
        expect(result).toHaveProperty("workflows");
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

        expect(Array.isArray(result)).toBe(true);
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

        const result = builder.createGetWorkflowConnectionsResponse(workflow, false) as Record<string, unknown>;

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("graph");
        expect(Array.isArray(result.graph)).toBe(true);
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

        const result = builder.createGetWorkflowConnectionsResponse(workflow, true) as Record<string, unknown>;

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("graph");
        expect(result).toHaveProperty("rawConnections");
      });
    });

    describe("createGetWorkflowNodeResponse", () => {
      it("should create minimal response by default", () => {
        const node: INode = {
          id: "node1",
          name: "Start",
          type: "n8n-nodes-base.start",
          typeVersion: 1,
          position: [250, 300],
          parameters: {},
          notesInFlow: true,
        };

        const result = builder.createGetWorkflowNodeResponse(node, false);

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("name");
        expect(result).not.toHaveProperty("position");
        expect(result).not.toHaveProperty("notesInFlow");
      });

      it("should create full response with raw=true", () => {
        const node: INode = {
          id: "node1",
          name: "Start",
          type: "n8n-nodes-base.start",
          typeVersion: 1,
          position: [250, 300],
          parameters: {},
          notesInFlow: true,
        };

        const result = builder.createGetWorkflowNodeResponse(node, true);

        expect(result).toHaveProperty("position");
        expect(result).toHaveProperty("notesInFlow");
      });
    });
  });
}
