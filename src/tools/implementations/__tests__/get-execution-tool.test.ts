/**
 * GetExecutionTool Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected behavior
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import { NotFoundError, ApiError } from '../../../errors/custom-errors.js';
import { GetExecutionTool } from '../get-execution-tool.js';
import { logger } from '../../../utils/logger.js';

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
      createGetExecutionResponse: vi.fn(),
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

    new GetExecutionTool(context);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本機能テスト', () => {
    it('TC-GET-001: 実行IDで詳細を取得', async () => {
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
      };

      const tool = new GetExecutionTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecution);
      (mockResponseBuilder.createGetExecutionResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: '実行詳細を取得しました',
        data: mockExecution,
      });

      // Act
      const result = await tool.execute({ id: '12345' }) as { success: boolean; data: { id: number } };

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(12345);
      expect((mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });

  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: NotFoundError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = "Execution '99999' not found";
      const tool = new GetExecutionTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockRejectedValue(
        new NotFoundError(errorMessage, {
          operation: 'get execution',
          resourceType: 'Execution',
          resourceId: '99999',
        })
      );

      // Act
      const response = await tool.handler({ id: '99999' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });

    it('TC-ERROR-002: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to get execution';
      const tool = new GetExecutionTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 500, {
          operation: 'get execution',
          resourceId: '12345',
        })
      );

      // Act
      const response = await tool.handler({ id: '12345' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });
  });
});
