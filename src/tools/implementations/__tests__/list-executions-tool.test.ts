/**
 * ListExecutionsTool Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import { ListExecutionsTool } from '../list-executions-tool.js';

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

    new ListExecutionsTool(context);
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
});
