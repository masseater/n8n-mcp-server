/**
 * Interface definitions for MCP server components
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type {
  ServerConfig,
  TransportConfig,
  WorkflowSummary,
  WorkflowDetail,
  WorkflowDefinition,
  MCPToolResponse,
  WorkflowListResponse,
  WorkflowDetailResponse,
  WorkflowCreateResponse,
  WorkflowUpdateResponse,
  WorkflowDeleteResponse,
} from '../types/index.js';

/**
 * Main MCP server interface
 */
export interface MCPServer {
  /**
   * Initialize the MCP server with configuration
   */
  initialize(config: ServerConfig): Promise<void>;

  /**
   * Start the server with specified transport
   */
  start(transport: TransportConfig): Promise<void>;

  /**
   * Stop the server gracefully
   */
  stop(): Promise<void>;

  /**
   * Get server instance
   */
  getServer(): Server;
}

/**
 * Interface for response optimization
 */
export interface ResponseOptimizer {
  /**
   * Optimize workflow summary for context efficiency
   */
  optimizeWorkflowSummary(workflow: unknown): WorkflowSummary;

  /**
   * Optimize workflow detail for context efficiency
   */
  optimizeWorkflowDetail(workflow: unknown): WorkflowDetail;

  /**
   * Minimize context size by removing unnecessary fields
   */
  minimizeContext<T>(data: T, maxSize?: number): T;

  /**
   * Apply pagination to large result sets
   */
  paginate<T>(data: T[], limit: number, offset: number): {
    data: T[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };

  /**
   * Create response for list_workflows tool
   */
  createListWorkflowsResponse(
    workflows: unknown[],
    raw?: boolean
  ): MCPToolResponse<WorkflowListResponse | WorkflowSummary[]>;

  /**
   * Create response for get_workflow tool
   */
  createGetWorkflowResponse(
    workflow: unknown,
    raw?: boolean
  ): MCPToolResponse<WorkflowDetailResponse | WorkflowDetail>;

  /**
   * Create response for create_workflow tool
   */
  createCreateWorkflowResponse(
    workflow: unknown,
    raw?: boolean
  ): MCPToolResponse<WorkflowCreateResponse | unknown>;

  /**
   * Create response for update_workflow tool
   */
  createUpdateWorkflowResponse(
    workflow: unknown,
    raw?: boolean
  ): MCPToolResponse<WorkflowUpdateResponse | unknown>;

  /**
   * Create response for delete_workflow tool
   */
  createDeleteWorkflowResponse(
    workflowId: string
  ): MCPToolResponse<WorkflowDeleteResponse>;
}

/**
 * Interface for MCP tool handlers
 */
export interface ToolHandlers {
  listWorkflows(args: any): Promise<any>;
  getWorkflow(args: any): Promise<any>;
  createWorkflow(args: any): Promise<any>;
  updateWorkflow(args: any): Promise<any>;
  deleteWorkflow(args: any): Promise<any>;
  activateWorkflow(args: any): Promise<any>;
  deactivateWorkflow(args: any): Promise<any>;
}

/**
 * Interface for configuration management
 */
export interface ConfigManager {
  /**
   * Load configuration from environment and files
   */
  loadConfig(): Promise<ServerConfig>;

  /**
   * Validate configuration
   */
  validateConfig(config: ServerConfig): boolean;

  /**
   * Get default configuration
   */
  getDefaultConfig(): ServerConfig;
}