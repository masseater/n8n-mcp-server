/**
 * Interface definitions for MCP server components
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { 
  ServerConfig, 
  TransportConfig,
  WorkflowSummary,
  WorkflowDetail,
  WorkflowDefinition 
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
  optimizeWorkflowSummary(workflow: any): WorkflowSummary;

  /**
   * Optimize workflow detail for context efficiency
   */
  optimizeWorkflowDetail(workflow: any): WorkflowDetail;

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