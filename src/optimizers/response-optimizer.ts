/**
 * Response optimizer for context efficiency
 */

import type { ResponseOptimizer } from "../interfaces/mcp-server.js";
import type { WorkflowDetail, WorkflowSummary } from "../types/index.js";

/**
 * Response optimizer implementation
 */
export class ResponseOptimizerImpl implements ResponseOptimizer {
  private maxSize: number;
  private defaultPageSize: number;

  constructor(maxSize: number = 100000, defaultPageSize: number = 50) {
    this.maxSize = maxSize;
    this.defaultPageSize = defaultPageSize;
  }

  /**
   * Optimize workflow summary for context efficiency
   */
  optimizeWorkflowSummary(workflow: any): WorkflowSummary {
    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active || false,
      tags: workflow.tags || [],
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodeCount: workflow.nodes?.length || 0,
    };
  }

  /**
   * Optimize multiple workflows for context efficiency
   */
  optimizeWorkflows(workflows: any[]): WorkflowSummary[] {
    return workflows.map((workflow) => this.optimizeWorkflowSummary(workflow));
  }

  /**
   * Optimize workflow detail for context efficiency
   */
  optimizeWorkflowDetail(workflow: any): WorkflowDetail {
    // Extract only essential node information
    const optimizedNodes = (workflow.nodes || []).map((node: any) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      position: node.position,
      disabled: node.disabled || false,
    }));

    // Simplify connections structure
    const optimizedConnections = this.optimizeConnections(
      workflow.connections || {},
    );

    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active || false,
      tags: workflow.tags || [],
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodes: optimizedNodes,
      connections: optimizedConnections,
      settings: workflow.settings
        ? this.optimizeSettings(workflow.settings)
        : undefined,
    };
  }

  /**
   * Minimize context size by removing unnecessary fields
   */
  minimizeContext<T>(data: T, maxSize?: number): T {
    const sizeLimit = maxSize || this.maxSize;
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= sizeLimit) {
      return data;
    }

    // If data is too large, try to reduce it
    if (Array.isArray(data)) {
      return this.minimizeArray(data, sizeLimit) as T;
    } else if (typeof data === "object" && data !== null) {
      return this.minimizeObject(data, sizeLimit) as T;
    }

    return data;
  }

  /**
   * Apply pagination to large result sets
   */
  paginate<T>(
    data: T[],
    limit: number = this.defaultPageSize,
    offset: number = 0,
  ): {
    data: T[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  } {
    const total = data.length;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedData = data.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    return {
      data: paginatedData,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
      },
    };
  }

  /**
   * Optimize connections structure
   */
  private optimizeConnections(connections: any): any {
    if (!connections || typeof connections !== "object") {
      return {};
    }

    const optimized: any = {};

    for (const [sourceNode, targets] of Object.entries(connections)) {
      if (typeof targets === "object" && targets !== null) {
        optimized[sourceNode] = {};

        for (
          const [outputName, connections] of Object.entries(targets as any)
        ) {
          if (Array.isArray(connections)) {
            optimized[sourceNode][outputName] = connections.map((
              conn: any,
            ) => ({
              node: conn.node,
              type: conn.type,
              index: conn.index,
            }));
          }
        }
      }
    }

    return optimized;
  }

  /**
   * Optimize workflow settings
   */
  private optimizeSettings(settings: any): any {
    return {
      executionOrder: settings.executionOrder,
      saveManualExecutions: settings.saveManualExecutions,
      saveExecutionProgress: settings.saveExecutionProgress,
      saveDataErrorExecution: settings.saveDataErrorExecution,
      saveDataSuccessExecution: settings.saveDataSuccessExecution,
      timezone: settings.timezone,
    };
  }

  /**
   * Minimize array data
   */
  private minimizeArray<T>(data: T[], maxSize: number): T[] {
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= maxSize) {
      return data;
    }

    // Try to reduce array size by taking fewer items
    const targetSize = Math.floor(maxSize * 0.8); // Leave some buffer
    const itemSize = jsonString.length / data.length;
    const maxItems = Math.floor(targetSize / itemSize);

    return data.slice(0, Math.max(1, maxItems));
  }

  /**
   * Minimize object data
   */
  private minimizeObject<T>(data: T, maxSize: number): T {
    const jsonString = JSON.stringify(data);

    if (jsonString.length <= maxSize) {
      return data;
    }

    // Remove less important fields
    if (typeof data === "object" && data !== null) {
      const optimized = { ...data } as any;

      // Remove execution logs and verbose data
      delete optimized.executionLogs;
      delete optimized.executionData;
      delete optimized.verbose;

      // Check if still too large
      const newJsonString = JSON.stringify(optimized);
      if (newJsonString.length <= maxSize) {
        return optimized as T;
      }
    }

    return data;
  }
}
