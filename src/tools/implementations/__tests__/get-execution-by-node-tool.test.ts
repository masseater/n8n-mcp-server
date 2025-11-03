/**
 * GetExecutionByNodeTool Unit Tests (TDD - Red Phase)
 * Phase 5: Progressive Execution Loading - Node-level data retrieval
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import type { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import type { NodeExecutionData } from '../../../types/index.js';
import { GetExecutionByNodeTool } from '../get-execution-by-node-tool.js';

describe('GetExecutionByNodeTool', () => {
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
      createExecutionByNodeResponse: vi.fn(),
    };
    mockResponseBuilder = vi.mocked(mockBuilder) as unknown as ToolResponseBuilder;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder: mockResponseBuilder,
    };
  });

  describe('Phase 5: NodeExecutionDataレスポンステスト', () => {
    it('TC-NODE-001: 正常実行ノードの詳細データを取得', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-11-03T10:00:00Z',
        stoppedAt: '2025-11-03T10:00:05Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        data: {
          resultData: {
            runData: {
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: {
                    method: 'GET',
                    url: 'https://api.example.com/data',
                  },
                },
                data: {
                  main: [
                    [
                      { json: { id: 1, name: 'Item 1' } },
                      { json: { id: 2, name: 'Item 2' } },
                    ],
                  ],
                },
                executionTime: 250,
                startTime: '2025-11-03T10:00:01Z',
                endTime: '2025-11-03T10:00:01.250Z',
              }],
            },
          },
        },
      };

      const mockNodeData: NodeExecutionData = {
        executionId: '12345',
        nodeName: 'HTTP Request',
        nodeType: 'n8n-nodes-base.httpRequest',
        status: 'success',
        executionTime: 250,
        startTime: '2025-11-03T10:00:01Z',
        endTime: '2025-11-03T10:00:01.250Z',
        input: {
          items: [
            { json: { id: 1, name: 'Item 1' } },
            { json: { id: 2, name: 'Item 2' } },
          ],
        },
        output: {
          items: [
            { json: { id: 1, name: 'Item 1' } },
            { json: { id: 2, name: 'Item 2' } },
          ],
        },
        parameters: {
          method: 'GET',
          url: 'https://api.example.com/data',
        },
        error: null,
      };

      const tool = new GetExecutionByNodeTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecution);
      (mockResponseBuilder.createExecutionByNodeResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: "ノード 'HTTP Request' の実行詳細を取得しました",
        data: mockNodeData,
      });

      // Act
      const result = await tool.execute({
        id: '12345',
        nodeName: 'HTTP Request',
      }) as { success: boolean; message: string; data: NodeExecutionData };

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toContain('HTTP Request');
      expect(result.data.executionId).toBe('12345');
      expect(result.data.nodeName).toBe('HTTP Request');
      expect(result.data.nodeType).toBe('n8n-nodes-base.httpRequest');
      expect(result.data.status).toBe('success');
      expect(result.data.executionTime).toBe(250);
      expect(result.data.output.items).toHaveLength(2);
      expect(result.data.parameters).toHaveProperty('method', 'GET');
      expect(result.data.error).toBeNull();

      // Verify API client was called with includeData=true
      expect((mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
      expect((mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mock.calls[0]).toEqual([
        '12345',
        { includeData: true },
      ]);

      // Verify response builder was called
      expect((mockResponseBuilder.createExecutionByNodeResponse as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });

    it('TC-NODE-002: エラーノードの詳細データを取得', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 67890,
        workflowId: 2,
        status: 'error',
        startedAt: '2025-11-03T11:00:00Z',
        stoppedAt: '2025-11-03T11:00:02Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        data: {
          resultData: {
            runData: {
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: {
                    method: 'POST',
                    url: 'https://api.example.com/submit',
                  },
                },
                error: {
                  message: 'Connection timeout',
                  description: 'Failed to connect after 30 seconds',
                },
                executionTime: 30000,
                startTime: '2025-11-03T11:00:00Z',
                endTime: '2025-11-03T11:00:30Z',
              }],
            },
          },
        },
      };

      const mockNodeData: NodeExecutionData = {
        executionId: '67890',
        nodeName: 'HTTP Request',
        nodeType: 'n8n-nodes-base.httpRequest',
        status: 'error',
        executionTime: 30000,
        startTime: '2025-11-03T11:00:00Z',
        endTime: '2025-11-03T11:00:30Z',
        input: {
          items: [],
        },
        output: {
          items: [],
        },
        parameters: {
          method: 'POST',
          url: 'https://api.example.com/submit',
        },
        error: {
          message: 'Connection timeout',
          description: 'Failed to connect after 30 seconds',
        },
      };

      const tool = new GetExecutionByNodeTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecution);
      (mockResponseBuilder.createExecutionByNodeResponse as ReturnType<typeof vi.fn>).mockReturnValue({
        success: true,
        message: "ノード 'HTTP Request' の実行詳細を取得しました",
        data: mockNodeData,
      });

      // Act
      const result = await tool.execute({
        id: '67890',
        nodeName: 'HTTP Request',
      }) as { success: boolean; message: string; data: NodeExecutionData };

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.status).toBe('error');
      expect(result.data.error).toBeDefined();
      expect(result.data.error).toHaveProperty('message', 'Connection timeout');
    });

    it('TC-NODE-003: 存在しないノード名でエラーをthrow', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-11-03T10:00:00Z',
        stoppedAt: '2025-11-03T10:00:05Z',
        mode: 'manual',
        finished: true,
        retryOf: null,
        retrySuccessId: null,
        data: {
          resultData: {
            runData: {
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                },
                data: {
                  main: [[{ json: { test: 'data' } }]],
                },
              }],
            },
          },
        },
      };

      const tool = new GetExecutionByNodeTool(context);
      (mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mockResolvedValue(mockExecution);

      // Act & Assert
      await expect(
        tool.execute({
          id: '12345',
          nodeName: 'Non-Existent Node',
        })
      ).rejects.toThrow("Node 'Non-Existent Node' not found in execution '12345'");

      // Verify API client was called
      expect((mockN8nClient.getExecution as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);

      // Verify response builder was NOT called (error thrown before)
      expect((mockResponseBuilder.createExecutionByNodeResponse as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(0);
    });
  });
});
