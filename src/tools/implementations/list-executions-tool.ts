/**
 * ListExecutionsTool - Get workflow execution history
 * Implements RawTool pattern for context optimization
 */

import { RawTool } from '../base/raw-tool.js';
import {
  listExecutionsArgsSchema,
  type ListExecutionsArgs,
} from '../../schemas/execution-schemas.js';
import type { Execution } from '../../generated/types.gen.js';
import { pickBy } from 'remeda';

/**
 * ListExecutionsTool
 * Get list of workflow executions with optional filtering
 */
export class ListExecutionsTool extends RawTool<ListExecutionsArgs> {
  readonly name = 'list_executions';
  readonly description =
    'ワークフロー実行履歴を取得します。ステータス、ワークフローID、日付範囲でフィルタリング可能です。';

  getInputSchema() {
    return listExecutionsArgsSchema;
  }

  /**
   * Execute core logic to fetch executions
   */
  async executeCore(
    args: Omit<ListExecutionsArgs, 'raw'>
  ): Promise<Execution[]> {
    // Call n8n API client to get executions
    // Build options object with only defined properties to satisfy exactOptionalPropertyTypes
    const options = pickBy(
      {
        workflowId: args.workflowId,
        status: args.status,
        limit: args.limit,
        cursor: args.cursor,
      },
      (value) => value !== undefined
    );

    const executions = await this.context.n8nClient.getExecutions(options);

    return executions;
  }

  /**
   * Format response based on raw option
   */
  formatResponse(data: unknown, raw: boolean): unknown {
    return this.context.responseBuilder.createListExecutionsResponse(
      data as Execution[],
      raw
    );
  }
}
