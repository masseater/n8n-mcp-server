/**
 * GetWorkflowTool Unit Tests
 * Tests including error handling scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { WorkflowDetailInternal } from '../../../clients/n8n-api-client.js';
import { NotFoundError, ApiError } from '../../../errors/custom-errors.js';
import { GetWorkflowTool } from '../get-workflow-tool.js';
import { logger } from '../../../utils/logger.js';

describe('GetWorkflowTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      getWorkflow: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createGetWorkflowResponse: vi.fn(),
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
    it('TC-GET-001: ワークフローIDで詳細を取得', async () => {
      // Arrange
      const mockWorkflow: WorkflowDetailInternal = {
        id: 'wf-001',
        name: 'Test Workflow',
        active: true,
        tags: [],
        createdAt: '2025-10-29T10:00:00Z',
        updatedAt: '2025-10-29T10:00:00Z',
        nodes: [],
        connections: {},
        settings: {},
      };

      const tool = new GetWorkflowTool(context);
      (mockN8nClient.getWorkflow as ReturnType<typeof vi.fn>).mockResolvedValue(mockWorkflow);
      (mockResponseBuilder.createGetWorkflowResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: 'ワークフロー詳細を取得しました',
        data: mockWorkflow,
      });

      // Act
      const result = await tool.execute({ id: 'wf-001' }) as { success: boolean };

      // Assert
      expect(result.success).toBe(true);
      expect((mockN8nClient.getWorkflow as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: NotFoundError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = "Workflow 'wf-nonexistent' not found";
      const tool = new GetWorkflowTool(context);
      (mockN8nClient.getWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new NotFoundError(errorMessage, {
          operation: 'get workflow',
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
      const errorMessage = 'Failed to get workflow';
      const tool = new GetWorkflowTool(context);
      (mockN8nClient.getWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 500, {
          operation: 'get workflow',
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

