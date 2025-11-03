/**
 * BaseTool Error Handling Unit Tests (TDD - Red Phase)
 * These tests are written BEFORE implementation to define the expected error handling behavior
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BaseTool } from '../base-tool.js';
import type { ToolContext, ToolResponse } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import { NotFoundError, ApiError, ValidationError } from '../../../errors/custom-errors.js';
import { logger } from '../../../utils/logger.js';
import type { ZodSchema } from 'zod';
import { z } from 'zod';

// Concrete test implementation of BaseTool
class TestTool extends BaseTool<{ id: string }> {
  readonly name = 'test_tool';
  readonly description = 'Test tool for error handling';

  private mockExecute: (args: { id: string }) => Promise<unknown>;

  constructor(context: ToolContext, mockExecute: (args: { id: string }) => Promise<unknown>) {
    super(context);
    this.mockExecute = mockExecute;
  }

  getInputSchema(): ZodSchema {
    return z.object({
      id: z.string(),
    });
  }

  async execute(args: { id: string }): Promise<unknown> {
    return this.mockExecute(args);
  }
}

describe('BaseTool Error Handling', () => {
  let mockN8nClient: N8nApiClient;
  let mockResponseBuilder: ToolResponseBuilder;
  let context: ToolContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loggerErrorSpy: any;

  beforeEach(() => {
    // Mock n8n API client
    mockN8nClient = {} as N8nApiClient;

    // Mock response builder
    mockResponseBuilder = {} as ToolResponseBuilder;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder: mockResponseBuilder,
    };

    // Spy on logger.error
    loggerErrorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {
      // Mock implementation (do nothing)
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('エラーハンドリングテスト', () => {
    it('TC-ERROR-001: NotFoundError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = "Workflow 'abc123' not found";
      const mockExecute = vi.fn().mockRejectedValue(
        new NotFoundError(errorMessage, {
          operation: 'get workflow',
          resourceType: 'Workflow',
          resourceId: 'abc123',
        })
      );

      const tool = new TestTool(context, mockExecute);

      // Act
      const response: ToolResponse = await tool.handler({ id: 'abc123' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
       
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        '[test_tool] Error',
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: expect.any(NotFoundError),
        })
      );
    });

    it('TC-ERROR-002: ApiError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Failed to update workflow';
      const mockExecute = vi.fn().mockRejectedValue(
        new ApiError(errorMessage, 400, {
          operation: 'update workflow',
          resourceId: 'abc123',
          errorDetails: "Field 'settings' is required",
        })
      );

      const tool = new TestTool(context, mockExecute);

      // Act
      const response: ToolResponse = await tool.handler({ id: 'abc123' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
       
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        '[test_tool] Error',
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: expect.any(ApiError),
        })
      );
    });

    it('TC-ERROR-003: ValidationError発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Workflow ID is required';
      const mockExecute = vi.fn().mockRejectedValue(
        new ValidationError(errorMessage, {
          field: 'id',
        })
      );

      const tool = new TestTool(context, mockExecute);

      // Act
      const response: ToolResponse = await tool.handler({ id: '' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
       
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        '[test_tool] Error',
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: expect.any(ValidationError),
        })
      );
    });

    it('TC-ERROR-004: Unknown Error発生時にerror.messageを返す', async () => {
      // Arrange
      const errorMessage = 'Unexpected error occurred';
      const mockExecute = vi.fn().mockRejectedValue(new Error(errorMessage));

      const tool = new TestTool(context, mockExecute);

      // Act
      const response: ToolResponse = await tool.handler({ id: 'test' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorMessage);
       
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        '[test_tool] Error',
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: expect.any(Error),
        })
      );
    });

    it('TC-ERROR-005: 非Errorオブジェクトがthrowされた場合にStringに変換する', async () => {
      // Arrange
      const errorValue = 'String error';
      const mockExecute = vi.fn().mockRejectedValue(errorValue);

      const tool = new TestTool(context, mockExecute);

      // Act
      const response: ToolResponse = await tool.handler({ id: 'test' });

      // Assert
      expect(response.isError).toBe(true);
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(response.content[0]?.text).toBe(errorValue);
      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('正常系テスト（エラーハンドリング実装による影響確認）', () => {
    it('TC-SUCCESS-001: 正常時にはisError: trueが設定されない', async () => {
      // Arrange
      const successData = { success: true, message: 'Operation completed' };
      const mockExecute = vi.fn().mockResolvedValue(successData);

      const tool = new TestTool(context, mockExecute);

      // Act
      const response: ToolResponse = await tool.handler({ id: 'test' });

      // Assert
      expect(response.isError).toBeUndefined();
      expect(response.content).toHaveLength(1);
      expect(response.content[0]?.type).toBe('text');
      expect(loggerErrorSpy).not.toHaveBeenCalled();
    });
  });
});

