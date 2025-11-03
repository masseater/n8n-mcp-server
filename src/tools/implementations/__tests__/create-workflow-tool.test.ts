/**
 * CreateWorkflowTool Unit Tests
 * Tests including error handling scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { WorkflowDetailInternal } from '../../../clients/n8n-api-client.js';
import { ApiError, ValidationError } from '../../../errors/custom-errors.js';
import { CreateWorkflowTool } from '../create-workflow-tool.js';
import { logger } from '../../../utils/logger.js';

describe('CreateWorkflowTool', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;

  beforeEach(() => {
    // Mock n8n API client
    const mockClient = {
      createWorkflow: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    // Mock response builder
    const mockBuilder = {
      createCreateWorkflowResponse: vi.fn(),
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
    it('TC-CREATE-001: 新しいワークフローを作成', async () => {
      // Arrange
      const mockWorkflow: WorkflowDetailInternal = {
        id: 'wf-new',
        name: 'New Workflow',
        active: false,
        tags: [],
        createdAt: '2025-10-29T10:00:00Z',
        updatedAt: '2025-10-29T10:00:00Z',
        nodes: [],
        connections: {},
        settings: {},
      };

      const tool = new CreateWorkflowTool(context);
      (mockN8nClient.createWorkflow as ReturnType<typeof vi.fn>).mockResolvedValue(mockWorkflow);
      (mockResponseBuilder.createCreateWorkflowResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: 'ワークフローを作成しました',
        data: mockWorkflow,
      });

      // Act
      const result = await tool.execute({
        name: 'New Workflow',
        active: false,
        nodes: [],
        connections: {},
        settings: {},
      }) as { success: boolean };

      // Assert
      expect(result.success).toBe(true);
      expect((mockN8nClient.createWorkflow as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to create workflow';
      const tool = new CreateWorkflowTool(context);
      (mockN8nClient.createWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ApiError(errorMessage, 400, {
          operation: 'create workflow',
          errorDetails: 'Invalid workflow definition',
        })
      );

      // Act
      const response = await tool.handler({
        name: 'Test Workflow',
        active: false,
        nodes: [],
        connections: {},
        settings: {},
      });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });

    it('TC-ERROR-002: ValidationError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Workflow name is required';
      const tool = new CreateWorkflowTool(context);
      (mockN8nClient.createWorkflow as ReturnType<typeof vi.fn>).mockRejectedValue(
        new ValidationError(errorMessage, {
          field: 'name',
        })
      );

      // Act
      const response = await tool.handler({
        name: '',
        active: false,
        nodes: [],
        connections: {},
        settings: {},
      });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
    });
  });
});

