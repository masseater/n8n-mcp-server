/**
 * MCP tool response types
 */

/**
 * Common response structure for all MCP tools
 * Simplified to return data directly without wrapper
 */
export type MCPToolResponse<T = unknown> = T;

/**
 * Response for list_workflows tool
 */
export type WorkflowListResponse = {
  count: number;
  workflows: {
    id: string;
    name: string;
    active: boolean;
  }[];
}

/**
 * Response for get_workflow tool
 */
export type WorkflowDetailResponse = {
  id: string;
  name: string;
  active: boolean;
  nodeCount: number;
  tags: string[];
}

/**
 * Response for delete_workflow tool
 */
export type WorkflowDeleteResponse = {
  id: string;
}

/**
 * Execution summary response (for Progressive Execution Loading)
 * Provides overview of execution with statistics and available nodes
 */
export type ExecutionSummary = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error" | "waiting" | "running" | "canceled";
  startedAt: string;
  stoppedAt: string | undefined;
  duration: number | undefined; // milliseconds
  statistics: {
    totalNodes: number;
    executedNodes: number;
    successfulNodes: number;
    failedNodes: number;
    totalItemsProcessed: number;
  };
  availableNodes: {
    nodeName: string; // Node name from runData keys (user-defined name)
    nodeType: string; // Node type (e.g., "n8n-nodes-base.httpRequest")
    status: "success" | "error"; // Node execution status
  }[];
  _guidance: {
    message: string;
    example: string; // Next tool call example with nodeName
  };
}

/**
 * Node execution data response (for Progressive Execution Loading)
 * Provides detailed execution data for a single node
 */
export type NodeExecutionData = {
  executionId: string;
  nodeName: string; // Node name from runData keys (user-defined name)
  nodeType: string;
  status: "success" | "error";
  executionTime: number; // milliseconds
  startTime: string;
  endTime: string;
  input: {
    items: unknown[]; // JSON data (type depends on workflow)
  };
  output: {
    items: unknown[]; // JSON data (type depends on workflow)
  };
  parameters: Record<string, unknown>;
  error: unknown;
}
