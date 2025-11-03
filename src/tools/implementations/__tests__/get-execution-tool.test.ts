/**
 * GetExecutionTool Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import type { ExecutionSummary } from '../../../types/index.js';
import { GetExecutionTool } from '../get-execution-tool.js';

describe('GetExecutionTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      getExecution: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createExecutionSummaryResponse: vi.fn(),
    };
    mockResponseBuilder = vi.mocked(mockBuilder) as unknown as ToolResponseBuilder;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder: mockResponseBuilder,
    };

    new GetExecutionTool(context);
  });

  describe('Phase 2: ExecutionSummaryレスポンステスト', () => {
    it('TC-GET-002: 実行IDでサマリーを取得（TDD Red Phase）', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[{ json: { test: 'data' } }]] },
              }],
              'HTTP Request': [{
                node: { type: 'n8n-nodes-base.httpRequest', name: 'HTTP Request' },
                data: { main: [[{ json: { result: 'ok' } }]] },
              }],
            },
          },
        },
      };

      const mockSummary: ExecutionSummary = {
        id: '12345',
        workflowId: '1',
        workflowName: 'Unknown Workflow',
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        duration: 5000,
        statistics: {
          totalNodes: 2,
          executedNodes: 2,
          successfulNodes: 2,
          failedNodes: 0,
          totalItemsProcessed: 2,
        },
        availableNodes: [
          { nodeName: 'Start', nodeType: 'n8n-nodes-base.start', status: 'success' },
          { nodeName: 'HTTP Request', nodeType: 'n8n-nodes-base.httpRequest', status: 'success' },
        ],
        _guidance: {
          message: 'Use get_execution_by_node tool to fetch detailed data for a specific node',
          example: "get_execution_by_node(id: '12345', nodeName: 'Start')",
        },
      };

      const tool = new GetExecutionTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecution);
      (mockResponseBuilder.createExecutionSummaryResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: '実行サマリーを取得しました',
        data: mockSummary,
      });

      // Act
      const result = await tool.execute({ id: '12345' }) as { success: boolean; message: string; data: ExecutionSummary };

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe('実行サマリーを取得しました');
      expect(result.data.id).toBe('12345');
      expect(result.data.statistics.totalNodes).toBe(2);
      expect(result.data.statistics.successfulNodes).toBe(2);
      expect(result.data.availableNodes).toHaveLength(2);
      expect(result.data._guidance.message).toContain('get_execution_by_node');

      // Verify API client was called with includeData=true
      expect((mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
      expect((mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mock.calls[0]).toEqual([
        '12345',
        { includeData: true },
      ]);

      // Verify response builder was called
      expect((mockResponseBuilder.createExecutionSummaryResponse as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });

    it('TC-GET-003: エラー実行のサマリーを取得（TDD Red Phase）', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 67890,
        workflowId: 2,
        status: 'error',
        startedAt: '2025-10-29T11:00:00Z',
        stoppedAt: '2025-10-29T11:00:03Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[{ json: { test: 'data' } }]] },
              }],
              'HTTP Request': [{
                node: { type: 'n8n-nodes-base.httpRequest', name: 'HTTP Request' },
                error: { message: 'Connection timeout' },
              }],
            },
          },
        },
      };

      const mockSummary: ExecutionSummary = {
        id: '67890',
        workflowId: '2',
        workflowName: 'Unknown Workflow',
        status: 'error',
        startedAt: '2025-10-29T11:00:00Z',
        stoppedAt: '2025-10-29T11:00:03Z',
        duration: 3000,
        statistics: {
          totalNodes: 2,
          executedNodes: 2,
          successfulNodes: 1,
          failedNodes: 1,
          totalItemsProcessed: 1,
        },
        availableNodes: [
          { nodeName: 'Start', nodeType: 'n8n-nodes-base.start', status: 'success' },
          { nodeName: 'HTTP Request', nodeType: 'n8n-nodes-base.httpRequest', status: 'error' },
        ],
        _guidance: {
          message: 'Use get_execution_by_node tool to fetch detailed data for a specific node',
          example: "get_execution_by_node(id: '67890', nodeName: 'Start')",
        },
      };

      const tool = new GetExecutionTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecution);
      (mockResponseBuilder.createExecutionSummaryResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: '実行サマリーを取得しました',
        data: mockSummary,
      });

      // Act
      const result = await tool.execute({ id: '67890' }) as { success: boolean; message: string; data: ExecutionSummary };

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('error');
      expect(result.data.statistics.failedNodes).toBe(1);
      expect(result.data.availableNodes[1]?.status).toBe('error');
    });
  });

});
