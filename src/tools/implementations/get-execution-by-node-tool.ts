/**
 * GetExecutionByNodeTool - Get detailed execution data for a single node
 * Phase 5: Progressive Execution Loading - Node-level data retrieval
 */

import { BaseTool } from '../base/base-tool.js';
import {
  getExecutionByNodeArgsSchema,
  type GetExecutionByNodeArgs,
} from '../../schemas/execution-schemas.js';
import type { NodeExecutionData } from '../../types/index.js';
import { NodeExecutionFormatter } from '../../formatters/node-execution-formatter.js';

/**
 * GetExecutionByNodeTool
 * Get detailed execution data for a single node
 * Supports Progressive Execution Loading pattern
 */
export class GetExecutionByNodeTool extends BaseTool<GetExecutionByNodeArgs> {
  readonly name = 'get_execution_by_node';
  readonly description =
    '指定されたノードの実行詳細データを取得します。ノード名はget_executionのavailableNodesリストから取得できます。';

  getInputSchema() {
    return getExecutionByNodeArgsSchema;
  }

  /**
   * Execute: Fetch execution and extract single node data
   */
  async execute(args: GetExecutionByNodeArgs): Promise<unknown> {
    // Fetch full execution data with includeData=true
    const execution = await this.context.n8nClient.getExecution(args.id, {
      includeData: true,
    });

    // Extract node data using NodeExecutionFormatter
    const formatter = new NodeExecutionFormatter();
    const nodeData: NodeExecutionData | null = formatter.formatNodeExecution(
      execution,
      args.nodeName
    );

    // Handle case where node is not found
    if (!nodeData) {
      throw new Error(
        `Node '${args.nodeName}' not found in execution '${args.id}'`
      );
    }

    // Return response using ToolResponseBuilder
    return this.context.responseBuilder.createExecutionByNodeResponse(nodeData);
  }
}

