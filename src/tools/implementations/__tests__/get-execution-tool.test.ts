/**
 * GetExecutionTool Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { GetExecutionArgs } from '../../../schemas/execution-schemas.js';
import type {
  ExecutionDetail,
  ExecutionDetailResponse,
} from '../../../types/index.js';
// import { GetExecutionTool } from '../get-execution-tool.js'; // ← WILL BE IMPLEMENTED IN PHASE 2

// Dummy class to make tests fail (RED PHASE)
class GetExecutionTool {
  constructor(_context: ToolContext) {
    throw new Error('GetExecutionTool not implemented yet - Phase 2');
  }
  async execute(_args: GetExecutionArgs): Promise<unknown> {
    throw new Error('Not implemented');
  }
}

describe('GetExecutionTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;
  let tool: GetExecutionTool;

  beforeEach(() => {
    // Mock n8n API client
    mockN8nClient = {
      getExecution: vi.fn(),
    } as unknown as N8nApiClient;

    // Mock response builder
    mockResponseBuilder = {
      createGetExecutionResponse: vi.fn(),
    } as unknown as ToolResponseBuilder;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder: mockResponseBuilder,
    };

    tool = new GetExecutionTool(context);
  });

  describe('基本機能テスト', () => {
    it('TC-GET-001: 実行IDで詳細を取得', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12345' };
      const mockExecution: ExecutionDetail = {
        id: '12345',
        workflowId: 'w1',
        workflowName: 'Test Workflow',
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        executionTime: 5000,
        createdAt: '2025-10-29T09:59:50Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        nodeExecutions: [
          {
            nodeName: 'Start',
            nodeId: 'node1',
            nodeType: 'n8n-nodes-base.start',
            status: 'success',
            executionTime: 10,
            startTime: '2025-10-29T10:00:00.000Z',
            endTime: '2025-10-29T10:00:00.010Z',
          },
        ],
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);
      vi.mocked(mockResponseBuilder.createGetExecutionResponse).mockReturnValue({
        success: true,
        message: '実行詳細を取得しました',
        data: mockExecution,
      });

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.success).toBe(true);
      // expect(result.data.id).toBe('12345');
      // expect(result.data).toHaveProperty('workflowId');
      // expect(result.data).toHaveProperty('workflowName');
      // expect(result.data).toHaveProperty('nodeExecutions');
    });

    it('TC-GET-002: 成功した実行の詳細', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12345' };
      const mockExecution: ExecutionDetail = {
        id: '12345',
        workflowId: 'w1',
        workflowName: 'Test',
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        executionTime: 5000,
        createdAt: '2025-10-29T09:59:50Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        nodeExecutions: [
          {
            nodeName: 'Start',
            nodeId: 'node1',
            nodeType: 'n8n-nodes-base.start',
            status: 'success',
            executionTime: 10,
            startTime: '2025-10-29T10:00:00.000Z',
            endTime: '2025-10-29T10:00:00.010Z',
          },
        ],
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.data.status).toBe('success');
      // expect(result.data.error).toBeUndefined();
      // expect(result.data.nodeExecutions.every((n) => n.status === 'success')).toBe(true);
    });

    it('TC-GET-003: 失敗した実行の詳細', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12346' };
      const mockExecution: ExecutionDetail = {
        id: '12346',
        workflowId: 'w1',
        workflowName: 'Test',
        status: 'error',
        startedAt: '2025-10-29T09:00:00Z',
        stoppedAt: '2025-10-29T09:00:05Z',
        executionTime: 5000,
        createdAt: '2025-10-29T08:59:50Z',
        mode: 'trigger',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        error: {
          node: 'HTTP Request',
          message: 'Connection timeout',
          timestamp: '2025-10-29T09:00:05Z',
        },
        nodeExecutions: [
          {
            nodeName: 'Start',
            nodeId: 'node1',
            nodeType: 'n8n-nodes-base.start',
            status: 'success',
            executionTime: 10,
            startTime: '2025-10-29T09:00:00.000Z',
            endTime: '2025-10-29T09:00:00.010Z',
          },
          {
            nodeName: 'HTTP Request',
            nodeId: 'node2',
            nodeType: 'n8n-nodes-base.httpRequest',
            status: 'error',
            executionTime: 4990,
            startTime: '2025-10-29T09:00:00.010Z',
            endTime: '2025-10-29T09:00:05.000Z',
            error: 'Connection timeout',
          },
        ],
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.data.status).toBe('error');
      // expect(result.data.error).toBeDefined();
      // expect(result.data.error?.node).toBe('HTTP Request');
      // expect(result.data.error?.message).toBe('Connection timeout');
    });
  });

  describe('includeData オプションテスト', () => {
    it('TC-GET-010: includeData=false（デフォルト）', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12345', includeData: false };

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(mockN8nClient.getExecution).toHaveBeenCalledWith(
      //   '12345',
      //   expect.objectContaining({ includeData: false }),
      // );
      // expect(result.data.data).toBeUndefined();
    });

    it('TC-GET-011: includeData=true', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12345', includeData: true };

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(mockN8nClient.getExecution).toHaveBeenCalledWith(
      //   '12345',
      //   expect.objectContaining({ includeData: true }),
      // );
      // expect(result.data.data).toBeDefined();
    });
  });

  describe('raw オプションテスト', () => {
    it('TC-GET-020: raw=falseで最小レスポンス', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12345', raw: false };
      const mockMinimalResponse: ExecutionDetailResponse = {
        id: '12345',
        workflowId: 'w1',
        workflowName: 'Test',
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        executionTime: 5000,
        nodeExecutions: [
          {
            nodeName: 'Start',
            status: 'success',
            executionTime: 10,
          },
        ],
      };

      vi.mocked(mockResponseBuilder.createGetExecutionResponse).mockReturnValue({
        success: true,
        message: '実行詳細を取得しました',
        data: mockMinimalResponse,
      });

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.data).not.toHaveProperty('mode');
      // expect(result.data).not.toHaveProperty('finished');
      // expect(result.data.nodeExecutions[0]).not.toHaveProperty('nodeId');
      // expect(result.data.nodeExecutions[0]).not.toHaveProperty('nodeType');
    });

    it('TC-GET-021: raw=trueで完全なデータ', async () => {
      // Arrange
      const args: GetExecutionArgs = { id: '12345', raw: true };

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.data).toHaveProperty('mode');
      // expect(result.data).toHaveProperty('finished');
      // expect(result.data.nodeExecutions[0]).toHaveProperty('nodeId');
      // expect(result.data.nodeExecutions[0]).toHaveProperty('nodeType');
    });
  });

  describe('バリデーションテスト', () => {
    it('TC-GET-040: idパラメータが必須', async () => {
      // Act & Assert
      // await expect(tool.execute({} as any)).rejects.toThrow();
    });

    it('TC-GET-041: idが数値形式でない', async () => {
      // Act & Assert
      // await expect(tool.execute({ id: 'invalid-id-text' })).rejects.toThrow(/numeric/);
    });

    it('TC-GET-042: idが空文字列', async () => {
      // Act & Assert
      // await expect(tool.execute({ id: '' })).rejects.toThrow();
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-GET-050: 存在しない実行ID（404）', async () => {
      // Arrange
      const notFoundError = new Error('Not Found');
      (notFoundError as Error & { statusCode?: number }).statusCode = 404;
      vi.mocked(mockN8nClient.getExecution).mockRejectedValue(notFoundError);

      // Act
      // const result = await tool.execute({ id: '999999999' });

      // Assert
      // expect(result.success).toBe(false);
      // expect(result.message).toContain('見つかりません');
    });

    it('TC-GET-051: n8n API接続エラー', async () => {
      // Arrange
      vi.mocked(mockN8nClient.getExecution).mockRejectedValue(
        new Error('Network Error'),
      );

      // Act
      // const result = await tool.execute({ id: '12345' });

      // Assert
      // expect(result.success).toBe(false);
      // expect(result.message).toContain('接続に失敗');
    });

    it('TC-GET-052: 認証エラー（401）', async () => {
      // Arrange
      const authError = new Error('Unauthorized');
      (authError as Error & { statusCode?: number }).statusCode = 401;
      vi.mocked(mockN8nClient.getExecution).mockRejectedValue(authError);

      // Act
      // const result = await tool.execute({ id: '12345' });

      // Assert
      // expect(result.success).toBe(false);
      // expect(result.message).toContain('認証に失敗');
    });

    it('TC-GET-053: 権限エラー（403）', async () => {
      // Arrange
      const forbiddenError = new Error('Forbidden');
      (forbiddenError as Error & { statusCode?: number }).statusCode = 403;
      vi.mocked(mockN8nClient.getExecution).mockRejectedValue(forbiddenError);

      // Act
      // const result = await tool.execute({ id: '12345' });

      // Assert
      // expect(result.success).toBe(false);
      // expect(result.message).toContain('権限');
    });
  });

  describe('エッジケースと境界値テスト', () => {
    it('TC-GET-060: 実行中（running）のステータス', async () => {
      // Arrange
      const mockExecution: ExecutionDetail = {
        id: '12347',
        workflowId: 'w1',
        workflowName: 'Test',
        status: 'running',
        startedAt: '2025-10-29T10:00:00Z',
        createdAt: '2025-10-29T09:59:50Z',
        mode: 'manual',
        finished: false,
        retryOf: null,
        retrySuccessId: null,
        nodeExecutions: [],
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      // const result = await tool.execute({ id: '12347' });

      // Assert
      // expect(result.data.status).toBe('running');
      // expect(result.data.stoppedAt).toBeUndefined();
    });

    it('TC-GET-061: 待機中（waiting）のステータス', async () => {
      // Arrange
      const mockExecution: ExecutionDetail = {
        id: '12348',
        workflowId: 'w1',
        workflowName: 'Test',
        status: 'waiting',
        startedAt: '2025-10-29T10:00:00Z',
        createdAt: '2025-10-29T09:59:50Z',
        mode: 'manual',
        finished: false,
        retryOf: null,
        retrySuccessId: null,
        waitTill: '2025-10-29T11:00:00Z',
        nodeExecutions: [],
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      // const result = await tool.execute({ id: '12348' });

      // Assert
      // expect(result.data.status).toBe('waiting');
      // expect(result.data.waitTill).toBe('2025-10-29T11:00:00Z');
    });
  });
});
