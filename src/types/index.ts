/**
 * Core type definitions for n8n MCP Server
 */

import type { INode, IConnections, IWorkflowSettings } from './n8n-types.js';

// Authentication types
export type AuthCredentials = {
  baseUrl: string;
  apiKey: string;
}

// Configuration types
export type ServerConfig = {
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
    enableDebugConsole: boolean;
  };
}

// Workflow data models (optimized for context)
export type WorkflowSummary = {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
}

export type WorkflowDetail = {
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

type NodeSummary = {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  disabled?: boolean;
}

// Node connection graph types
export type NodeConnection = {
  node: string;
  id: string;
  type: string;
  inputs: string[];
  outputs: string[];
}

export type ConnectionSummary = Record<string, Record<string, {
      node: string;
      type: string;
      index: number;
    }[]>>;

type WorkflowSettings = {
  executionOrder?: string;
  saveManualExecutions?: boolean;
  saveExecutionProgress?: boolean;
  saveDataErrorExecution?: string;
  saveDataSuccessExecution?: string;
  timezone?: string;
}

// API request/response types
export type ListOptions = {
  active?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// Workflow definition types for create/update operations
export type WorkflowDefinition = {
  name: string;
  active: boolean;
  nodes: INode[];
  connections: IConnections;
  settings?: IWorkflowSettings;
  tags?: string[];
}

// Transport types
export type TransportType = "stdio" | "http";

export type TransportConfig = {
  type: TransportType;
  port?: number | undefined;
}

// MCP response types
export type {
  MCPToolResponse,
  WorkflowListResponse,
  WorkflowDetailResponse,
  WorkflowDeleteResponse,
} from './mcp-response.js';
