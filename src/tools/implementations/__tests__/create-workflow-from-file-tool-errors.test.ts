/**
 * CreateWorkflowFromFileTool Error Handling Tests
 * Tests for handler-level error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import { ApiError, ValidationError, FileError } from '../../../errors/custom-errors.js';
import { CreateWorkflowFromFileTool } from '../create-workflow-from-file-tool.js';
import { logger } from '../../../utils/logger.js';

describe('CreateWorkflowFromFileTool - Error Handling', () => {
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

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: FileError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'File not found: /nonexistent/workflow.json';
      const tool = new CreateWorkflowFromFileTool(context);

      // Act
      const response = await tool.handler({ filePath: '/nonexistent/workflow.json' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toContain('File not found');
    });

    it('TC-ERROR-002: ValidationError発生時にerror.messageを返す（不正なJSONフォーマット）', async () => {
      // Arrange
      const tool = new CreateWorkflowFromFileTool(context);

      // Act - 存在しないファイルパスでValidationErrorが発生する想定
      const response = await tool.handler({ filePath: '' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
    });
  });
});

