/**
 * GetExecutionTool - Get execution summary (Progressive Execution Loading)
 * Phase 2: Extended to return ExecutionSummary instead of full Execution
 */

import { BaseTool } from '../base/base-tool.js';
import {
  getExecutionArgsSchema,
  type GetExecutionArgs,
} from '../../schemas/execution-schemas.js';
import type { ExecutionSummary } from '../../types/index.js';
import { ExecutionFormatter } from '../../formatters/execution-formatter.js';

/**
 * GetExecutionTool
 * Get execution summary (500-1,000 tokens) instead of full execution data
 * Supports Progressive Execution Loading pattern
 */
export class GetExecutionTool extends BaseTool<GetExecutionArgs> {
  readonly name = 'get_execution';
  readonly description =
    '実行のサマリー情報を取得します。統計情報とavailableNodesリストを含みます。詳細なノードデータは get_execution_by_node を使用してください。';

  getInputSchema() {
    return getExecutionArgsSchema;
  }

  /**
   * Execute: Fetch execution and format as summary
   */
  async execute(args: GetExecutionArgs): Promise<unknown> {
    // Always fetch with includeData=true to get runData
    const execution = await this.context.n8nClient.getExecution(args.id, {
      includeData: true,
    });

    // Format execution to summary using ExecutionFormatter
    const formatter = new ExecutionFormatter();
    const summary: ExecutionSummary = formatter.formatSummary(execution);

    // Return response using ToolResponseBuilder
    return this.context.responseBuilder.createExecutionSummaryResponse(summary);
  }
}
