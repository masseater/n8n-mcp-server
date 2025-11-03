/**
 * UpdateWorkflowTool Unit Tests
 * Tests including error handling scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { WorkflowDetailInternal } from '../../../clients/n8n-api-client.js';
import { NotFoundError, ApiError } from '../../../errors/custom-errors.js';
import { UpdateWorkflowTool } from '../update-workflow-tool.js';
import { logger } from '../../../utils/logger.js';

describe('UpdateWorkflowTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      updateWorkflow: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createUpdateWorkflowResponse: vi.fn(),
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
    it('TC-UPDATE-001: ワークフローを更新', async () => {
      // Arrange
      const mockWorkflow: WorkflowDetailInternal = {
        id: 'wf-001',
        name: 'Updated Workflow',
        active: true,
        tags: [],
        createdAt: '2025-10-29T10:00:00Z',
        updatedAt: '2025-10-29T11:00:00Z',
        nodes: [],
        connections: {},
        settings: {},
      };

      const tool = new UpdateWorkflowTool(context);
      (mockN8nClient.updateWorkflow as ReturnType<typeof vi.fn>).mockResolvedValue(mockWorkflow);
      (mockResponseBuilder.createUpdateWorkflowResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: 'ワークフローを更新しました',
        data: mockWorkflow,
      });

      // Act
      const result = await tool.execute({
        id: 'wf-001',
        name: 'Updated Workflow',
      }) as { success: boolean };

      // Assert
      expect(result.success).toBe(true);
      expect((mockN8nClient.updateWorkflow as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: NotFoundError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = "Workflow 'wf-nonexistent' not found";
      const tool = new UpdateWorkflowTool(context);
      (mockN8nClient.updateWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new NotFoundError(errorMessage, {
          operation: 'update workflow',
          resourceType: 'Workflow',
          resourceId: 'wf-nonexistent',
        })
      );

      // Act
      const response = await tool.handler({
        id: 'wf-nonexistent',
        name: 'Updated Name',
      });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });

    it('TC-ERROR-002: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to update workflow';
      const tool = new UpdateWorkflowTool(context);
      (mockN8nClient.updateWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 400, {
          operation: 'update workflow',
          resourceId: 'wf-001',
          errorDetails: "Field 'settings' is required when updating nodes",
        })
      );

      // Act
      const response = await tool.handler({
        id: 'wf-001',
        nodes: [],
      });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });
  });
});

