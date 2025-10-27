/**
 * MCP tool response types
 */

/**
 * Common response structure for all MCP tools
 */
export type MCPToolResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

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
