/**
 * Execution-related type definitions for n8n MCP Server
 */

/**
 * Execution status enumeration
 */
export type ExecutionStatus =
  | 'success'
  | 'error'
  | 'waiting'
  | 'running'
  | 'canceled'
  | 'unknown';

/**
 * Execution mode enumeration
 */
export type ExecutionMode =
  | 'manual'
  | 'trigger'
  | 'webhook'
  | 'retry'
  | 'internal';

/**
 * Node execution status enumeration
 */
export type NodeExecutionStatus = 'success' | 'error' | 'running' | 'waiting';

/**
 * Execution summary for list operations
 * This is the minimal representation returned by list_executions
 */
export interface ExecutionSummary {
  /** Execution ID */
  id: string;
  /** Workflow ID */
  workflowId: string;
  /** Workflow name (fetched separately from workflow API) */
  workflowName: string;
  /** Execution status */
  status: ExecutionStatus;
  /** Start timestamp (ISO 8601) */
  startedAt: string;
  /** Stop timestamp (ISO 8601), null if still running */
  stoppedAt?: string;
  /** Execution time in milliseconds (calculated from startedAt and stoppedAt) */
  executionTime?: number;
  /** Execution mode */
  mode: ExecutionMode;
  /** Whether execution has finished */
  finished: boolean;
  /** ID of the execution this is a retry of */
  retryOf?: string | null;
  /** ID of successful retry */
  retrySuccessId?: string | null;
  /** Wait until timestamp (ISO 8601) */
  waitTill?: string | null;
}

/**
 * Error information for failed executions
 */
export interface ExecutionError {
  /** Node where error occurred */
  node: string;
  /** Error message */
  message: string;
  /** Timestamp when error occurred (ISO 8601) */
  timestamp: string;
}

/**
 * Node execution information
 */
export interface NodeExecution {
  /** Node name */
  nodeName: string;
  /** Node ID */
  nodeId: string;
  /** Node type (e.g., n8n-nodes-base.httpRequest) */
  nodeType: string;
  /** Node execution status */
  status: NodeExecutionStatus;
  /** Execution time in milliseconds */
  executionTime: number;
  /** Start time (ISO 8601) */
  startTime: string;
  /** End time (ISO 8601), undefined if still running */
  endTime?: string;
  /** Error message if status is error */
  error?: string;
  /** Whether node has data (for includeData option) */
  hasData?: boolean;
}

/**
 * Execution data structure (when includeData=true)
 */
export interface ExecutionData {
  /** Execution result data by node */
  resultData: {
    /** Run data by node name */
    runData: Record<
      string,
      Array<{
        /** Start time */
        startTime: number;
        /** Execution time */
        executionTime: number;
        /** Source data */
        source: unknown[];
        /** Data output */
        data: {
          /** Main data array */
          main: unknown[][];
        };
      }>
    >;
  };
}

/**
 * Execution detail for get_execution operations
 * Extends ExecutionSummary with additional detail fields
 */
export interface ExecutionDetail extends ExecutionSummary {
  /** Created timestamp (ISO 8601) */
  createdAt: string;
  /** Deleted timestamp (ISO 8601), null if not deleted */
  deletedAt?: string | null;
  /** Error information if status is error */
  error?: ExecutionError;
  /** Node execution information array */
  nodeExecutions: NodeExecution[];
  /** Full execution data (when includeData=true) */
  data?: ExecutionData;
  /** Workflow settings (optional) */
  settings?: Record<string, unknown>;
}

/**
 * Raw execution response from n8n API (list)
 * This matches the actual n8n API response structure
 */
export interface N8nExecutionListResponse {
  data: Array<{
    id: string;
    finished: boolean;
    mode: string;
    retryOf: string | null;
    retrySuccessId: string | null;
    status: string;
    startedAt: string;
    stoppedAt: string | null;
    workflowId: string;
    waitTill: string | null;
  }>;
  nextCursor?: string;
}

/**
 * Raw execution response from n8n API (detail)
 * This matches the actual n8n API response structure
 */
export interface N8nExecutionDetailResponse {
  id: string;
  finished: boolean;
  mode: string;
  retryOf: string | null;
  retrySuccessId: string | null;
  status: string;
  createdAt: string;
  startedAt: string;
  stoppedAt: string | null;
  deletedAt: string | null;
  workflowId: string;
  waitTill: string | null;
  // Additional fields when includeData=true
  data?: ExecutionData;
}

/**
 * List executions response (minimal, raw=false)
 */
export interface ExecutionListResponse {
  count: number;
  executions: Array<{
    id: string;
    workflowId: string;
    workflowName: string;
    status: ExecutionStatus;
    startedAt: string;
    executionTime?: number;
  }>;
}

/**
 * Get execution response (minimal, raw=false)
 */
export interface ExecutionDetailResponse {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  startedAt: string;
  stoppedAt?: string;
  executionTime?: number;
  error?: {
    node: string;
    message: string;
  };
  nodeExecutions: Array<{
    nodeName: string;
    status: NodeExecutionStatus;
    executionTime: number;
  }>;
}
