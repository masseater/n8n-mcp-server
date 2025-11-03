/**
 * NodeExecutionFormatter
 * Formats node execution data from Execution for Progressive Execution Loading
 */

import type { Execution } from '../generated/types.gen.js';
import type { NodeExecutionData } from '../types/index.js';

/**
 * Type guard for node run data structure
 */
type NodeRunData = {
  node?: {
    type?: string;
    name?: string;
    parameters?: Record<string, unknown>;
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
 * Maximum number of items to include in input/output
 * Prevents MCP response size from exceeding 25,000 token limit
 */
const MAX_ITEMS = 50;

/**
 * NodeExecutionFormatter class
 * Extracts and formats single node execution data from Execution
 */
export class NodeExecutionFormatter {
  /**
   * Format node execution data
   * @param execution - Full execution data from n8n API
   * @param nodeName - Node name (runData key)
   * @returns NodeExecutionData - Complete node execution data, or null if node not found
   */
  formatNodeExecution(
    execution: Execution,
    nodeName: string
  ): NodeExecutionData | null {
    const executionData = execution.data as ExecutionData | undefined;
    const runData = executionData?.resultData?.runData;

    // ノードが存在しない場合はnullを返す
    if (!runData?.[nodeName]) {
      return null;
    }

    const nodeData = runData[nodeName][0]; // 最初の実行データを取得
    if (!nodeData) {
      return null;
    }

    // 各privateメソッドを使用してデータを抽出
    const basicInfo = this.extractNodeBasicInfo(nodeData, nodeName);
    const inputOutputItems = this.extractInputOutputItems(nodeData);
    const error = this.extractError(nodeData);

    return {
      executionId: execution.id ? String(execution.id) : 'unknown',
      ...basicInfo,
      input: {
        items: inputOutputItems.input,
      },
      output: {
        items: inputOutputItems.output,
      },
      error,
    };
  }

  /**
   * Extract node basic information (nodeName, nodeType, status, timing, parameters)
   * @private
   */
  private extractNodeBasicInfo(
    nodeData: NodeRunData,
    nodeName: string
  ): {
    nodeName: string;
    nodeType: string;
    status: 'success' | 'error';
    executionTime: number;
    startTime: string;
    endTime: string;
    parameters: Record<string, unknown>;
  } {
    const nodeType = nodeData.node?.type ?? 'unknown';
    const status = nodeData.error ? 'error' : 'success';
    const executionTime = nodeData.executionTime ?? 0;
    const startTime = nodeData.startTime ?? '';
    const endTime = nodeData.endTime ?? '';
    const parameters = nodeData.node?.parameters ?? {};

    return {
      nodeName,
      nodeType,
      status,
      executionTime,
      startTime,
      endTime,
      parameters,
    };
  }

  /**
   * Extract input/output items from node data
   * Limits items to MAX_ITEMS to prevent MCP response size from exceeding limit
   * @private
   */
  private extractInputOutputItems(nodeData: NodeRunData): {
    input: unknown[];
    output: unknown[];
  } {
    const outputData = nodeData.data?.main;
    const allOutputItems = Array.isArray(outputData) && outputData.length > 0
      ? (Array.isArray(outputData[0]) ? outputData[0] : [])
      : [];

    // Limit items to MAX_ITEMS (50) to prevent response size from exceeding 25,000 tokens
    const outputItems = allOutputItems.slice(0, MAX_ITEMS);

    // 入力データは出力データと同じ構造を想定（n8nの仕様）
    const inputItems = outputItems;

    return {
      input: inputItems,
      output: outputItems,
    };
  }

  /**
   * Extract error information from node data
   * @private
   */
  private extractError(nodeData: NodeRunData): unknown {
    return nodeData.error ?? null;
  }
}
