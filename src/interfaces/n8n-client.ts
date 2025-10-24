/**
 * Interface definitions for n8n API client
 */

import type {
  AuthCredentials,
  ListOptions,
  WorkflowDefinition,
  WorkflowDetail,
  WorkflowSummary,
} from "../types/index.js";

/**
 * Main interface for n8n API client
 */
export interface N8nApiClient {
  /**
   * Authenticate with n8n API using provided credentials
   */
  authenticate(credentials: AuthCredentials): Promise<boolean>;

  /**
   * Get list of workflows with optional filtering
   */
  getWorkflows(options?: ListOptions): Promise<WorkflowSummary[]>;

  /**
   * Get detailed information about a specific workflow
   */
  getWorkflow(id: string): Promise<WorkflowDetail>;

  /**
   * Create a new workflow
   */
  createWorkflow(workflow: WorkflowDefinition): Promise<WorkflowSummary>;

  /**
   * Update an existing workflow
   */
  updateWorkflow(
    id: string,
    workflow: WorkflowDefinition,
  ): Promise<WorkflowSummary>;

  /**
   * Delete a workflow
   */
  deleteWorkflow(id: string): Promise<boolean>;

  /**
   * Set workflow active/inactive status
   */
  setWorkflowActive(id: string, active: boolean): Promise<boolean>;

  /**
   * Test connection to n8n API
   */
  testConnection(): Promise<boolean>;
}

/**
 * Interface for HTTP client wrapper
 */
export interface HttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
}

/**
 * Interface for authentication manager
 */
export interface AuthManager {
  validateCredentials(credentials: AuthCredentials): boolean;
  getAuthHeaders(credentials: AuthCredentials): Record<string, string>;
  isAuthenticated(): boolean;
  setCredentials(credentials: AuthCredentials): boolean;
  getCredentials(): AuthCredentials | null;
  clearAuth(): void;
}
