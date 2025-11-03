/**
 * ListExecutionsTool Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected behavior
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import { ApiError } from '../../../errors/custom-errors.js';
import { ListExecutionsTool } from '../list-executions-tool.js';
import { logger } from '../../../utils/logger.js';

describe('ListExecutionsTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      getExecutions: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createListExecutionsResponse: vi.fn(),
    };
    mockResponseBuilder = vi.mocked(mockBuilder) as unknown as ToolResponseBuilder;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder: mockResponseBuilder,
    };

    // Mock logger.error
    vi.spyOn(logger, 'error').mockImplementation(() => {
      // Mock implementation (do nothing)
    });

    new ListExecutionsTool(context);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本機能テスト', () => {
    it('TC-LIST-001: デフォルトパラメータで実行履歴を取得', async () => {
      // Arrange
      const mockExecutions: Execution[] = [
        {
          id: 1001,
          workflowId: 1,
          status: 'success',
          startedAt: '2025-10-29T10:00:00Z',
          stoppedAt: '2025-10-29T10:00:05Z',
          mode: 'manual',
          finished: true,
          retryOf: null,
          retrySuccessId: null,
        },
      ];

      const tool = new ListExecutionsTool(context);

      (mockN8nClient.getExecutions as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecutions);
      (mockResponseBuilder.createListExecutionsResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: '実行履歴を取得しました',
        data: { count: 1, executions: mockExecutions },
      });

      // Act
      const result = await tool.execute({}) as { success: boolean; data: { count: number; executions: unknown[] } };

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.executions).toBeInstanceOf(Array);
      expect((mockN8nClient.getExecutions as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });


  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch executions from n8n API';
      const tool = new ListExecutionsTool(context);
      (mockN8nClient.getExecutions as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 500, {
          operation: 'list executions',
        })
      );

      // Act
      const response = await tool.handler({});

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });

    it('TC-ERROR-002: 汎用Error発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Unexpected error occurred';
      const tool = new ListExecutionsTool(context);
      (mockN8nClient.getExecutions as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(errorMessage)
      );

      // Act
      const response = await tool.handler({});

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });
  });
});
