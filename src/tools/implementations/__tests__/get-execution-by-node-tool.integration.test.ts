/**
 * GetExecutionByNodeTool Integration Tests
 * Phase 6 Task 3: Integration test with real N8nApiClient and NodeExecutionFormatter
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import type { MCPToolResponse, NodeExecutionData } from '../../../types/index.js';
import { GetExecutionByNodeTool } from '../get-execution-by-node-tool.js';

describe('GetExecutionByNodeTool Integration Tests', () => {
  let mockN8nClient: N8nApiClient;
  let responseBuilder: ToolResponseBuilder;
  let context: ToolContext;
  let tool: GetExecutionByNodeTool;

  beforeEach(() => {
    // Create real ToolResponseBuilder (not mocked)
    responseBuilder = new ToolResponseBuilder();

    // Mock n8n API client with realistic execution data
    const mockClient = {
      getExecution: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder,
    };

    tool = new GetExecutionByNodeTool(context);
  });

  describe('Phase 6 Task 3: Integration test with NodeExecutionData', () => {
    it('TC-NODE-INT-001: should return NodeExecutionData for successful node with all fields', async () => {
      // Arrange - Realistic execution data fixture
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-11-03T10:00:00Z',
        stoppedAt: '2025-11-03T10:00:05Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: {
                  type: 'n8n-nodes-base.start',
                  name: 'Start',
                  parameters: {},
                },
                data: { main: [[{ json: { trigger: true } }]] },
                executionTime: 10,
                startTime: '2025-11-03T10:00:00Z',
                endTime: '2025-11-03T10:00:00.010Z',
              }],
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: {
                    method: 'GET',
                    url: 'https://api.example.com/users',
                    timeout: 30000,
                  },
                },
                data: {
                  main: [
                    Array.from({ length: 100 }, (_, i) => ({
                      json: {
                        id: i + 1,
                        name: `User ${String(i + 1)}`,
                        email: `user${String(i + 1)}@example.com`,
                      },
                    })),
                  ],
                },
                executionTime: 1500,
                startTime: '2025-11-03T10:00:00.010Z',
                endTime: '2025-11-03T10:00:01.510Z',
              }],
              'Set': [{
                node: {
                  type: 'n8n-nodes-base.set',
                  name: 'Set',
                  parameters: {
                    values: {
                      string: [{ name: 'processed', value: 'true' }],
                    },
                  },
                },
                data: {
                  main: [
                    Array.from({ length: 100 }, (_, i) => ({
                      json: {
                        id: i + 1,
                        processed: true,
                      },
                    })),
                  ],
                },
                executionTime: 50,
                startTime: '2025-11-03T10:00:01.510Z',
                endTime: '2025-11-03T10:00:01.560Z',
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      const result = (await tool.execute({
        id: '12345',
        nodeName: 'HTTP Request',
      })) as MCPToolResponse<NodeExecutionData>;

      // Assert - Verify MCPToolResponse structure
      expect(result.success).toBe(true);
      expect(result.message).toContain("ノード 'HTTP Request' の実行詳細を取得しました");
      expect(result.data).toBeDefined();

      // Assert - Verify NodeExecutionData fields
      const nodeData = result.data;
      expect(nodeData).toBeDefined();
      if (!nodeData) return; // Type guard

      expect(nodeData.executionId).toBe('12345');
      expect(nodeData.nodeName).toBe('HTTP Request');
      expect(nodeData.nodeType).toBe('n8n-nodes-base.httpRequest');
      expect(nodeData.status).toBe('success');
      expect(nodeData.executionTime).toBe(1500);
      expect(nodeData.startTime).toBe('2025-11-03T10:00:00.010Z');
      expect(nodeData.endTime).toBe('2025-11-03T10:00:01.510Z');

      // Assert - Verify parameters
      expect(nodeData.parameters).toBeDefined();
      expect(nodeData.parameters.method).toBe('GET');
      expect(nodeData.parameters.url).toBe('https://api.example.com/users');
      expect(nodeData.parameters.timeout).toBe(30000);

      // Assert - Verify input/output items (limited to MAX_ITEMS=50)
      expect(nodeData.input.items).toHaveLength(50);
      expect(nodeData.output.items).toHaveLength(50);
      expect(nodeData.output.items[0]).toHaveProperty('json');
      expect((nodeData.output.items[0] as { json: { id: number } }).json.id).toBe(1);

      // Assert - Verify no error
      expect(nodeData.error).toBeNull();

      // Verify N8nApiClient was called with includeData=true
      expect(mockN8nClient.getExecution).toHaveBeenCalledWith('12345', {
        includeData: true,
      });
    });

    it('TC-NODE-INT-002: should return NodeExecutionData for error node with error details', async () => {
      // Arrange - Execution with error node
      const mockExecution: Execution = {
        id: 67890,
        workflowId: 2,
        status: 'error',
        startedAt: '2025-11-03T11:00:00Z',
        stoppedAt: '2025-11-03T11:00:30Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: {
                  type: 'n8n-nodes-base.start',
                  name: 'Start',
                  parameters: {},
                },
                data: { main: [[{ json: { trigger: true } }]] },
                executionTime: 10,
                startTime: '2025-11-03T11:00:00Z',
                endTime: '2025-11-03T11:00:00.010Z',
              }],
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: {
                    method: 'POST',
                    url: 'https://api.example.com/submit',
                    timeout: 30000,
                  },
                },
                error: {
                  message: 'ETIMEDOUT: Connection timeout after 30000ms',
                  name: 'Error',
                  description: 'The server did not respond within the specified timeout period',
                },
                executionTime: 30000,
                startTime: '2025-11-03T11:00:00.010Z',
                endTime: '2025-11-03T11:00:30.010Z',
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      const result = (await tool.execute({
        id: '67890',
        nodeName: 'HTTP Request',
      })) as MCPToolResponse<NodeExecutionData>;

      // Assert
      expect(result.success).toBe(true);
      const nodeData = result.data;
      expect(nodeData).toBeDefined();
      if (!nodeData) return; // Type guard

      expect(nodeData.status).toBe('error');
      expect(nodeData.error).toBeDefined();
      expect(nodeData.error).toHaveProperty('message', 'ETIMEDOUT: Connection timeout after 30000ms');
      expect(nodeData.error).toHaveProperty('description');
    });

    it('TC-NODE-INT-003: should throw error for non-existent node name', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-11-03T10:00:00Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                },
                data: { main: [[{ json: { test: 'data' } }]] },
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act & Assert
      await expect(
        tool.execute({
          id: '12345',
          nodeName: 'Non-Existent Node',
        })
      ).rejects.toThrow("Node 'Non-Existent Node' not found in execution '12345'");
    });

    it('TC-NODE-INT-004: should handle node with large output items', async () => {
      // Arrange - Node with 500 items (test response size handling)
      const mockExecution: Execution = {
        id: 99999,
        workflowId: 10,
        status: 'success',
        startedAt: '2025-11-03T12:00:00Z',
        stoppedAt: '2025-11-03T12:00:10Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: {
                    method: 'GET',
                    url: 'https://api.example.com/large-dataset',
                  },
                },
                data: {
                  main: [
                    Array.from({ length: 500 }, (_, i) => ({
                      json: {
                        id: i + 1,
                        name: `Item ${String(i + 1)}`,
                        description: `This is a test item with index ${String(i + 1)}`,
                        metadata: {
                          created: '2025-11-03T12:00:00Z',
                          updated: '2025-11-03T12:00:00Z',
                          tags: ['test', 'large-dataset', `item-${String(i + 1)}`],
                        },
                      },
                    })),
                  ],
                },
                executionTime: 5000,
                startTime: '2025-11-03T12:00:00Z',
                endTime: '2025-11-03T12:00:05Z',
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      const result = (await tool.execute({
        id: '99999',
        nodeName: 'HTTP Request',
      })) as MCPToolResponse<NodeExecutionData>;

      // Assert
      expect(result.success).toBe(true);
      const nodeData = result.data;
      expect(nodeData).toBeDefined();
      if (!nodeData) return; // Type guard

      // Assert - Items should be limited to MAX_ITEMS (50)
      expect(nodeData.output.items).toHaveLength(50);

      // Verify response size (Phase 6 Task 4: Response size validation)
      const responseJson = JSON.stringify(result);
      const responseSizeBytes = Buffer.byteLength(responseJson, 'utf8');
      const responseSizeTokens = Math.ceil(responseSizeBytes / 4); // Rough token estimate

      console.log(`Response size after optimization: ${String(responseSizeBytes)} bytes (~${String(responseSizeTokens)} tokens)`);

      // Assert - Response size should be within MCP limit (25,000 tokens)
      expect(responseSizeTokens).toBeLessThan(25000);
    });
  });
});
