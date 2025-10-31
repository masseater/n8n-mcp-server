/**
 * ExecutionFormatter
 * Formats execution data into ExecutionSummary for Progressive Execution Loading
 */

import type { Execution } from '../generated/types.gen.js';
import type { ExecutionSummary } from '../types/index.js';

/**
 * Type guard for node data structure in runData
 */
type NodeRunData = {
  node?: {
    type?: string;
    name?: string;
  };
  data?: {
    main?: unknown[][];
  };
  error?: unknown;
  executionTime?: number;
  startTime?: string;
  endTime?: string;
};

/**
 * Type for execution data structure (based on n8n API response)
 */
type ExecutionData = {
  resultData?: {
    runData?: Record<string, NodeRunData[]>;
  };
};

/**
 * ExecutionFormatter class
 * Converts Execution to ExecutionSummary
 */
export class ExecutionFormatter {
  /**
   * Format execution data into summary
   * @param execution - Full execution data from n8n API
   * @returns ExecutionSummary - Optimized summary (500-1,000 tokens)
   */
  formatSummary(execution: Execution): ExecutionSummary {
    const executionData = execution.data as ExecutionData | undefined;
    const runData = executionData?.resultData?.runData ?? {};

    const statistics = this.calculateStatistics(runData);
    const availableNodes = this.extractAvailableNodes(runData);
    const duration = this.calculateDuration(
      execution.startedAt,
      execution.stoppedAt ?? undefined
    );
    const guidance = this.generateGuidance(
      String(execution.id ?? 'unknown'),
      availableNodes
    );

    return {
      id: String(execution.id ?? 'unknown'),
      workflowId: String(execution.workflowId ?? 'unknown'),
      workflowName: 'Unknown Workflow', // Will be populated from workflow API if needed
      status: this.normalizeStatus(execution.status),
      startedAt: execution.startedAt ?? '',
      stoppedAt: execution.stoppedAt ?? undefined,
      duration,
      statistics,
      availableNodes,
      _guidance: guidance,
    };
  }

  /**
   * Normalize execution status to expected values
   */
  private normalizeStatus(
    status: string | undefined
  ): "success" | "error" | "waiting" | "running" | "canceled" {
    const normalized = status?.toLowerCase();
    if (normalized === 'success' || normalized === 'error' ||
        normalized === 'waiting' || normalized === 'running' ||
        normalized === 'canceled') {
      return normalized;
    }
    // Default to 'error' for unknown statuses like 'crashed', 'unknown', 'new'
    return 'error';
  }

  /**
   * Calculate execution statistics from runData
   * @private
   */
  private calculateStatistics(runData: Record<string, NodeRunData[]>): {
    totalNodes: number;
    executedNodes: number;
    successfulNodes: number;
    failedNodes: number;
    totalItemsProcessed: number;
  } {
    const nodeNames = Object.keys(runData);
    const totalNodes = nodeNames.length;
    const executedNodes = totalNodes; // All nodes in runData have been executed

    let successfulNodes = 0;
    let failedNodes = 0;
    let totalItemsProcessed = 0;

    for (const nodeName of nodeNames) {
      const nodeData = runData[nodeName];
      if (!nodeData || nodeData.length === 0) {
        continue;
      }

      // Check the first run's error status
      const firstRun = nodeData[0];
      if (firstRun?.error) {
        failedNodes++;
      } else {
        successfulNodes++;
      }

      // Count output items from the first run
      const outputData = firstRun?.data?.main;
      if (Array.isArray(outputData) && outputData.length > 0) {
        const firstOutput = outputData[0];
        if (Array.isArray(firstOutput)) {
          totalItemsProcessed += firstOutput.length;
        }
      }
    }

    return {
      totalNodes,
      executedNodes,
      successfulNodes,
      failedNodes,
      totalItemsProcessed,
    };
  }

  /**
   * Extract available nodes from runData
   * @private
   */
  private extractAvailableNodes(
    runData: Record<string, NodeRunData[]>
  ): {
    nodeName: string;
    nodeType: string;
    status: "success" | "error";
  }[] {
    const nodeNames = Object.keys(runData);

    return nodeNames.map((nodeName) => {
      const nodeData = runData[nodeName];
      const firstRun = nodeData?.[0];

      return {
        nodeName,
        nodeType: firstRun?.node?.type ?? 'unknown',
        status: firstRun?.error ? 'error' : 'success',
      };
    });
  }

  /**
   * Calculate execution duration in milliseconds
   * @private
   */
  private calculateDuration(
    startedAt: string | undefined,
    stoppedAt: string | undefined
  ): number | undefined {
    if (!startedAt || !stoppedAt) {
      return undefined;
    }

    const startTime = new Date(startedAt).getTime();
    const stopTime = new Date(stoppedAt).getTime();

    return stopTime - startTime;
  }

  /**
   * Generate guidance for next tool call
   * @private
   */
  private generateGuidance(
    executionId: string,
    availableNodes: { nodeName: string; nodeType: string; status: string }[]
  ): {
    message: string;
    example: string;
  } {
    const firstNode = availableNodes[0];
    const exampleNodeName = firstNode?.nodeName ?? 'HTTP Request';

    return {
      message: 'Use get_execution_by_node tool to fetch detailed data for a specific node',
      example: `get_execution_by_node(id: '${executionId}', nodeName: '${exampleNodeName}')`,
    };
  }
}
