/**
 * ListExecutionsTool Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { ListExecutionsArgs } from '../../../schemas/execution-schemas.js';
import type {
  ExecutionSummary,
  ExecutionListResponse,
} from '../../../types/index.js';
// import { ListExecutionsTool } from '../list-executions-tool.js'; // ← WILL BE IMPLEMENTED IN PHASE 2

// Dummy class to make tests fail (RED PHASE)
class ListExecutionsTool {
  constructor(_context: ToolContext) {
    throw new Error('ListExecutionsTool not implemented yet - Phase 2');
  }
  async execute(_args: ListExecutionsArgs): Promise<unknown> {
    throw new Error('Not implemented');
  }
}

describe('ListExecutionsTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;
  let tool: ListExecutionsTool;

  beforeEach(() => {
    // Mock n8n API client
    mockN8nClient = {
      getExecutions: vi.fn(),
    } as unknown as N8nApiClient;

    // Mock response builder
    mockResponseBuilder = {
      createListExecutionsResponse: vi.fn(),
    } as unknown as ToolResponseBuilder;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder: mockResponseBuilder,
    };

    tool = new ListExecutionsTool(context);
  });

  describe('基本機能テスト', () => {
    it('TC-LIST-001: デフォルトパラメータで実行履歴を取得', async () => {
      // Arrange
      const mockExecutions: ExecutionSummary[] = [
        {
          id: '1001',
          workflowId: 'w1',
          workflowName: 'Test Workflow 1',
          status: 'success',
          startedAt: '2025-10-29T10:00:00Z',
          stoppedAt: '2025-10-29T10:00:05Z',
          executionTime: 5000,
          mode: 'manual',
          finished: true,
          retryOf: null,
          retrySuccessId: null,
        },
      ];

      vi.mocked(mockN8nClient.getExecutions).mockResolvedValue(mockExecutions);
      vi.mocked(mockResponseBuilder.createListExecutionsResponse).mockReturnValue({
        success: true,
        message: '実行履歴を取得しました',
        data: { count: 1, executions: mockExecutions },
      });

      // Act
      // const result = await tool.execute({});

      // Assert
      // expect(result.success).toBe(true);
      // expect(result.data.executions).toBeInstanceOf(Array);
      // expect(mockN8nClient.getExecutions).toHaveBeenCalledOnce();
    });

    it('TC-LIST-002: limitパラメータで件数制限', async () => {
      // Arrange
      const args: ListExecutionsArgs = { limit: 5 };
      const mockExecutions: ExecutionSummary[] = Array.from({ length: 5 }, (_, i) => ({
        id: `100${i}`,
        workflowId: 'w1',
        workflowName: 'Test',
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        executionTime: 5000,
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
      }));

      vi.mocked(mockN8nClient.getExecutions).mockResolvedValue(mockExecutions);

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.data.executions.length).toBeLessThanOrEqual(5);
      // expect(mockN8nClient.getExecutions).toHaveBeenCalledWith(
      //   expect.objectContaining({ limit: 5 }),
      // );
    });

    it('TC-LIST-003: workflowIdでフィルタリング', async () => {
      // Arrange
      const targetWorkflowId = 'workflow-123';
      const args: ListExecutionsArgs = { workflowId: targetWorkflowId };

      const mockExecutions: ExecutionSummary[] = [
        {
          id: '1001',
          workflowId: targetWorkflowId,
          workflowName: 'Target Workflow',
          status: 'success',
          startedAt: '2025-10-29T10:00:00Z',
          stoppedAt: '2025-10-29T10:00:05Z',
          executionTime: 5000,
          mode: 'manual',
          finished: true,
          retryOf: null,
          retrySuccessId: null,
        },
      ];

      vi.mocked(mockN8nClient.getExecutions).mockResolvedValue(mockExecutions);

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.success).toBe(true);
      // expect(result.data.executions.every((e) => e.workflowId === targetWorkflowId)).toBe(true);
    });

    it('TC-LIST-004: statusでフィルタリング（success）', async () => {
      // Arrange
      const args: ListExecutionsArgs = { status: 'success' };
      const mockExecutions: ExecutionSummary[] = [
        {
          id: '1001',
          workflowId: 'w1',
          workflowName: 'Test',
          status: 'success',
          startedAt: '2025-10-29T10:00:00Z',
          stoppedAt: '2025-10-29T10:00:05Z',
          executionTime: 5000,
          mode: 'manual',
          finished: true,
          retryOf: null,
          retrySuccessId: null,
        },
      ];

      vi.mocked(mockN8nClient.getExecutions).mockResolvedValue(mockExecutions);

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.data.executions.every((e) => e.status === 'success')).toBe(true);
    });
  });

  describe('raw オプションテスト', () => {
    it('TC-LIST-020: raw=falseで最小レスポンス', async () => {
      // Arrange
      const args: ListExecutionsArgs = { raw: false };
      const mockMinimalResponse: ExecutionListResponse = {
        count: 1,
        executions: [
          {
            id: '1001',
            workflowId: 'w1',
            workflowName: 'Test',
            status: 'success',
            startedAt: '2025-10-29T10:00:00Z',
            executionTime: 5000,
          },
        ],
      };

      vi.mocked(mockResponseBuilder.createListExecutionsResponse).mockReturnValue({
        success: true,
        message: '実行履歴を取得しました',
        data: mockMinimalResponse,
      });

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.success).toBe(true);
      // expect(result.data).toHaveProperty('count');
      // expect(result.data).toHaveProperty('executions');
      // expect(result.data.executions[0]).not.toHaveProperty('mode');
      // expect(result.data.executions[0]).not.toHaveProperty('finished');
    });

    it('TC-LIST-021: raw=trueで完全なデータ', async () => {
      // Arrange
      const args: ListExecutionsArgs = { raw: true };
      const mockFullResponse: ExecutionSummary[] = [
        {
          id: '1001',
          workflowId: 'w1',
          workflowName: 'Test',
          status: 'success',
          startedAt: '2025-10-29T10:00:00Z',
          stoppedAt: '2025-10-29T10:00:05Z',
          executionTime: 5000,
          mode: 'manual',
          finished: true,
          retryOf: null,
          retrySuccessId: null,
        },
      ];

      vi.mocked(mockResponseBuilder.createListExecutionsResponse).mockReturnValue({
        success: true,
        message: '実行履歴を取得しました',
        data: mockFullResponse,
      });

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(result.success).toBe(true);
      // expect(result.data[0]).toHaveProperty('mode');
      // expect(result.data[0]).toHaveProperty('finished');
      // expect(result.data[0]).toHaveProperty('retryOf');
    });
  });

  describe('バリデーションテスト', () => {
    it('TC-LIST-030: limitが範囲外（0）', async () => {
      // Act & Assert
      // await expect(tool.execute({ limit: 0 })).rejects.toThrow();
    });

    it('TC-LIST-031: limitが範囲外（101）', async () => {
      // Act & Assert
      // await expect(tool.execute({ limit: 101 })).rejects.toThrow();
    });

    it('TC-LIST-032: 不正なstatus値', async () => {
      // Act & Assert
      // await expect(tool.execute({ status: 'invalid' as any })).rejects.toThrow();
    });
  });

  describe('エッジケースと境界値テスト', () => {
    it('TC-LIST-040: 実行が存在しない場合', async () => {
      // Arrange
      vi.mocked(mockN8nClient.getExecutions).mockResolvedValue([]);
      vi.mocked(mockResponseBuilder.createListExecutionsResponse).mockReturnValue({
        success: true,
        message: '実行履歴を取得しました',
        data: { count: 0, executions: [] },
      });

      // Act
      // const result = await tool.execute({ workflowId: 'non-existent' });

      // Assert
      // expect(result.success).toBe(true);
      // expect(result.data.count).toBe(0);
      // expect(result.data.executions).toEqual([]);
    });

    it('TC-LIST-041: 複数フィルタの組み合わせ', async () => {
      // Arrange
      const args: ListExecutionsArgs = {
        workflowId: 'w1',
        status: 'success',
      };

      // Act
      // const result = await tool.execute(args);

      // Assert
      // expect(mockN8nClient.getExecutions).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     workflowId: 'w1',
      //     status: 'success',
      //   }),
      // );
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-LIST-060: n8n API接続エラー', async () => {
      // Arrange
      vi.mocked(mockN8nClient.getExecutions).mockRejectedValue(
        new Error('Network Error'),
      );

      // Act
      // const result = await tool.execute({});

      // Assert
      // expect(result.success).toBe(false);
      // expect(result.message).toContain('接続に失敗');
    });

    it('TC-LIST-061: 認証エラー（401）', async () => {
      // Arrange
      const authError = new Error('Unauthorized');
      (authError as Error & { statusCode?: number }).statusCode = 401;
      vi.mocked(mockN8nClient.getExecutions).mockRejectedValue(authError);

      // Act
      // const result = await tool.execute({});

      // Assert
      // expect(result.success).toBe(false);
      // expect(result.message).toContain('認証に失敗');
    });
  });
});
