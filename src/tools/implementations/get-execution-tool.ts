/**
 * GetExecutionTool - Get detailed execution information
 * Implements RawTool pattern for context optimization
 */

import { RawTool } from '../base/raw-tool.js';
import {
  getExecutionArgsSchema,
  type GetExecutionArgs,
} from '../../schemas/execution-schemas.js';
import type { Execution } from '../../generated/types.gen.js';
import { pickBy } from 'remeda';

/**
 * GetExecutionTool
 * Get detailed information about a specific execution
 */
export class GetExecutionTool extends RawTool<GetExecutionArgs> {
  readonly name = 'get_execution';
  readonly description =
    '特定の実行の詳細情報を取得します。ノードごとの実行結果、エラー情報を含みます。';

  getInputSchema() {
    return getExecutionArgsSchema;
  }

  /**
   * Execute core logic to fetch execution detail
   */
  async executeCore(
    args: Omit<GetExecutionArgs, 'raw'>
  ): Promise<Execution> {
    // Call n8n API client to get execution detail
    // Build options object with only defined properties to satisfy exactOptionalPropertyTypes
    const options = pickBy(
      {
        includeData: args.includeData,
      },
      (value) => value !== undefined
    );

    const execution = await this.context.n8nClient.getExecution(args.id, options);

    return execution;
  }

  /**
   * Format response based on raw option
   */
  formatResponse(data: unknown, raw: boolean): unknown {
    return this.context.responseBuilder.createGetExecutionResponse(
      data as Execution,
      raw
    );
  }
}
