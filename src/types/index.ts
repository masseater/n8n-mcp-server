/**
 * Core type definitions for n8n MCP Server
 */

import type { INode, IConnections, IWorkflowSettings } from './n8n-types.js';

// Authentication types
export interface AuthCredentials {
  baseUrl: string;
  apiKey: string;
}

// Configuration types
export interface ServerConfig {
  n8n: {
    baseUrl: string;
    credentials: AuthCredentials;
    timeout: number;
    retryAttempts: number;
  };
  mcp: {
    maxResponseSize: number;
    defaultPageSize: number;
    verboseMode: boolean;
  };
  logging: {
    level: string;
    enableApiStats: boolean;
  };
}

// Workflow data models (optimized for context)
export interface WorkflowSummary {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
}

export interface WorkflowDetail {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodes: NodeSummary[];
  connections: ConnectionSummary;
  settings?: WorkflowSettings | undefined;
}

export interface NodeSummary {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  disabled?: boolean;
}

export interface ConnectionSummary {
  [key: string]: {
    [key: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}

export interface WorkflowSettings {
  executionOrder?: string;
  saveManualExecutions?: boolean;
  saveExecutionProgress?: boolean;
  saveDataErrorExecution?: string;
  saveDataSuccessExecution?: string;
  timezone?: string;
}

// API request/response types
export interface ListOptions {
  active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// Workflow definition types for create/update operations
export interface WorkflowDefinition {
  name: string;
  active: boolean;
  nodes: INode[];
  connections: IConnections;
  settings?: IWorkflowSettings;
  tags?: string[];
}

// Error handling types
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Transport types
export type TransportType = "stdio" | "http";

export interface TransportConfig {
  type: TransportType;
  port?: number | undefined;
}

// Re-export MCP response types
export * from './mcp-response.js';
