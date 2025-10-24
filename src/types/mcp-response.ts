/**
 * MCP tool response types
 */

/**
 * Common response structure for all MCP tools
 */
export interface MCPToolResponse<T = unknown> {
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
export interface WorkflowListResponse {
  count: number;
  workflows: Array<{
    id: string;
    name: string;
    active: boolean;
  }>;
}

/**
 * Response for get_workflow tool
 */
export interface WorkflowDetailResponse {
  id: string;
  name: string;
  active: boolean;
  nodeCount: number;
  tags: string[];
}

/**
 * Response for create_workflow tool
 */
export interface WorkflowCreateResponse {
  id: string;
  name: string;
  active: boolean;
}

/**
 * Response for update_workflow tool
 */
export interface WorkflowUpdateResponse {
  id: string;
  name: string;
}

/**
 * Response for delete_workflow tool
 */
export interface WorkflowDeleteResponse {
  id: string;
}
