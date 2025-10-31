/**
 * GetExecutionTool Integration Tests
 * Phase 3 Task 3: Integration test with real N8nApiClient
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import type { MCPToolResponse, ExecutionSummary } from '../../../types/index.js';
import { GetExecutionTool } from '../get-execution-tool.js';

describe('GetExecutionTool Integration Tests', () => {
  let mockN8nClient: N8nApiClient;
  let responseBuilder: ToolResponseBuilder;
  let context: ToolContext;
  let tool: GetExecutionTool;

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

    tool = new GetExecutionTool(context);
  });

  describe('Phase 3 Task 3: Integration test with ExecutionSummary', () => {
    it('TC-GET-INT-001: should return ExecutionSummary with all required fields', async () => {
      // Arrange - Realistic execution data fixture (12 nodes, 110 items)
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-10-29T10:00:00Z',
        stoppedAt: '2025-10-29T10:00:05Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'Start': [{
                startTime: Date.now(),
                executionTime: 10,
                data: { main: [[{ json: { value: 1 } }]] },
              }],
              'HTTP Request 1': [{
                startTime: Date.now(),
                executionTime: 1000,
                data: { main: [Array.from({ length: 50 }, (_, i) => ({ json: { id: i } }))] },
              }],
              'HTTP Request 2': [{
                startTime: Date.now(),
                executionTime: 1200,
                data: { main: [Array.from({ length: 50 }, (_, i) => ({ json: { id: i + 50 } }))] },
              }],
              'Set': [{
                startTime: Date.now(),
                executionTime: 50,
                data: { main: [[{ json: { processed: true } }]] },
              }],
              'IF': [{
                startTime: Date.now(),
                executionTime: 30,
                data: { main: [[{ json: { condition: true } }]] },
              }],
              'Code 1': [{
                startTime: Date.now(),
                executionTime: 100,
                data: { main: [[{ json: { result: 'ok' } }]] },
              }],
              'Code 2': [{
                startTime: Date.now(),
                executionTime: 100,
                data: { main: [[{ json: { result: 'ok' } }]] },
              }],
              'Webhook': [{
                startTime: Date.now(),
                executionTime: 20,
                data: { main: [[{ json: { received: true } }]] },
              }],
              'Aggregate': [{
                startTime: Date.now(),
                executionTime: 200,
                data: { main: [[{ json: { total: 100 } }]] },
              }],
              'Filter': [{
                startTime: Date.now(),
                executionTime: 80,
                data: { main: [[{ json: { filtered: true } }]] },
              }],
              'Split In Batches': [{
                startTime: Date.now(),
                executionTime: 150,
                data: { main: [[{ json: { batch: 1 } }]] },
              }],
              'Merge': [{
                startTime: Date.now(),
                executionTime: 90,
                data: { main: [[{ json: { merged: true } }]] },
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      const result = (await tool.execute({ id: '12345' })) as MCPToolResponse<ExecutionSummary>;

      // Assert - Verify MCPToolResponse structure
      expect(result.success).toBe(true);
      expect(result.message).toContain('実行サマリーを取得しました');
      expect(result.data).toBeDefined();

      // Assert - Verify ExecutionSummary fields
      const summary = result.data;
      expect(summary).toBeDefined();
      if (!summary) return; // Type guard

      expect(summary.id).toBe('12345');
      expect(summary.workflowId).toBe('1');
      expect(summary.workflowName).toBe('Unknown Workflow');
      expect(summary.status).toBe('success');
      expect(summary.startedAt).toBe('2025-10-29T10:00:00Z');
      expect(summary.stoppedAt).toBe('2025-10-29T10:00:05Z');
      expect(summary.duration).toBe(5000);

      // Assert - Verify statistics
      expect(summary.statistics).toBeDefined();
      expect(summary.statistics.totalNodes).toBe(12);
      expect(summary.statistics.executedNodes).toBe(12);
      expect(summary.statistics.successfulNodes).toBe(12);
      expect(summary.statistics.failedNodes).toBe(0);
      expect(summary.statistics.totalItemsProcessed).toBe(110); // 1+50+50+1+1+1+1+1+1+1+1+1+1

      // Assert - Verify availableNodes
      expect(summary.availableNodes).toBeDefined();
      expect(summary.availableNodes.length).toBe(12);
      expect(summary.availableNodes[0]).toHaveProperty('nodeName');
      expect(summary.availableNodes[0]).toHaveProperty('nodeType');
      expect(summary.availableNodes[0]).toHaveProperty('status');

      // Assert - Verify _guidance
      expect(summary._guidance).toBeDefined();
      expect(summary._guidance.message).toContain('get_execution_by_node');
      expect(summary._guidance.example).toContain('12345');
    });

    it('TC-GET-INT-002: should handle execution with error node', async () => {
      // Arrange - Execution with error
      const mockExecution: Execution = {
        id: 12346,
        workflowId: 2,
        status: 'error',
        startedAt: '2025-10-29T11:00:00Z',
        stoppedAt: '2025-10-29T11:00:03Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'Start': [{
                startTime: Date.now(),
                executionTime: 10,
                data: { main: [[{ json: { value: 1 } }]] },
              }],
              'HTTP Request': [{
                startTime: Date.now(),
                executionTime: 2990,
                error: {
                  message: 'ETIMEDOUT: Connection timeout after 30000ms',
                  name: 'Error',
                },
                data: { main: [[]] },
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      const result = (await tool.execute({ id: '12346' })) as MCPToolResponse<ExecutionSummary>;

      // Assert
      expect(result.success).toBe(true);
      const summary = result.data;
      expect(summary).toBeDefined();
      if (!summary) return; // Type guard

      expect(summary.status).toBe('error');
      expect(summary.statistics.failedNodes).toBe(1);
      expect(summary.statistics.successfulNodes).toBe(1);

      // Assert - Error node should be in availableNodes with status='error'
      const errorNode = summary.availableNodes.find((n) => n.nodeName === 'HTTP Request');
      expect(errorNode).toBeDefined();
      expect(errorNode?.status).toBe('error');
    });

    it('TC-GET-INT-003: should call N8nApiClient with includeData=true', async () => {
      // Arrange
      const mockExecution: Execution = {
        id: 12347,
        workflowId: 3,
        status: 'success',
        startedAt: '2025-10-29T12:00:00Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {},
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act
      await tool.execute({ id: '12347' });

      // Assert - Verify N8nApiClient was called with includeData=true
      expect(mockN8nClient.getExecution).toHaveBeenCalledWith('12347', {
        includeData: true,
      });
    });
  });
});
