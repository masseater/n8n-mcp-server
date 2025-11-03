/**
 * ListWorkflowsTool Unit Tests
 * Tests including error handling scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { WorkflowSummary } from '../../../types/index.js';
import { ApiError } from '../../../errors/custom-errors.js';
import { ListWorkflowsTool } from '../list-workflows-tool.js';
import { logger } from '../../../utils/logger.js';

describe('ListWorkflowsTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      getWorkflows: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createListWorkflowsResponse: vi.fn(),
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基本機能テスト', () => {
    it('TC-LIST-001: デフォルトパラメータでワークフロー一覧を取得', async () => {
      // Arrange
      const mockWorkflows: WorkflowSummary[] = [
        {
          id: 'wf-001',
          name: 'Test Workflow',
          active: true,
          tags: [],
          createdAt: '2025-10-29T10:00:00Z',
          updatedAt: '2025-10-29T10:00:00Z',
          nodeCount: 0,
        },
      ];

      const tool = new ListWorkflowsTool(context);
      (mockN8nClient.getWorkflows as ReturnType<typeof vi.fn>).mockResolvedValue(mockWorkflows);
      (mockResponseBuilder.createListWorkflowsResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: 'ワークフロー一覧を取得しました',
        data: { count: 1, workflows: mockWorkflows },
      });

      // Act
      const result = await tool.execute({}) as { success: boolean };

      // Assert
      expect(result.success).toBe(true);
      expect((mockN8nClient.getWorkflows as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch workflows from n8n API';
      const tool = new ListWorkflowsTool(context);
      (mockN8nClient.getWorkflows as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 500, {
          operation: 'list workflows',
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
      const tool = new ListWorkflowsTool(context);
      (mockN8nClient.getWorkflows as ReturnType<typeof vi.fn>).mockRejectedValue(
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

