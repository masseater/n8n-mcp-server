/**
 * DeleteWorkflowTool Unit Tests
 * Tests including error handling scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import { NotFoundError, ApiError } from '../../../errors/custom-errors.js';
import { DeleteWorkflowTool } from '../delete-workflow-tool.js';
import { logger } from '../../../utils/logger.js';

describe('DeleteWorkflowTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      deleteWorkflow: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createDeleteWorkflowResponse: vi.fn(),
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
    it('TC-DELETE-001: ワークフローを削除', async () => {
      // Arrange
      const tool = new DeleteWorkflowTool(context);
      (mockN8nClient.deleteWorkflow as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      (mockResponseBuilder.createDeleteWorkflowResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: 'ワークフローを削除しました',
      });

      // Act
      const result = await tool.execute({ id: 'wf-001' }) as { success: boolean };

      // Assert
      expect(result.success).toBe(true);
      expect((mockN8nClient.deleteWorkflow as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: NotFoundError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = "Workflow 'wf-nonexistent' not found";
      const tool = new DeleteWorkflowTool(context);
      (mockN8nClient.deleteWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new NotFoundError(errorMessage, {
          operation: 'delete workflow',
          resourceType: 'Workflow',
          resourceId: 'wf-nonexistent',
        })
      );

      // Act
      const response = await tool.handler({ id: 'wf-nonexistent' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });

    it('TC-ERROR-002: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to delete workflow';
      const tool = new DeleteWorkflowTool(context);
      (mockN8nClient.deleteWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 500, {
          operation: 'delete workflow',
          resourceId: 'wf-001',
        })
      );

      // Act
      const response = await tool.handler({ id: 'wf-001' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });
  });
});
