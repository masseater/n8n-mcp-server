/**
 * ExecutionFormatter Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { ExecutionFormatter } from '../execution-formatter.js';
import type { Execution } from '../../generated/types.gen.js';

describe('ExecutionFormatter', () => {
  const formatter = new ExecutionFormatter();

  describe('formatSummary', () => {
    it('should format execution with successful nodes', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 12345,
        workflowId: 1,
        status: 'success',
        startedAt: '2025-10-29T10:00:00.000Z',
        stoppedAt: '2025-10-29T10:00:05.000Z',
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[{ json: { test: 1 } }, { json: { test: 2 } }]] },
                executionTime: 10,
              }],
              'HTTP Request': [{
                node: { type: 'n8n-nodes-base.httpRequest', name: 'HTTP Request' },
                data: { main: [[{ json: { result: 'ok' } }]] },
                executionTime: 4990,
              }],
            },
          },
        },
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.id).toBe('12345');
      expect(summary.workflowId).toBe('1');
      expect(summary.status).toBe('success');
      expect(summary.startedAt).toBe('2025-10-29T10:00:00.000Z');
      expect(summary.stoppedAt).toBe('2025-10-29T10:00:05.000Z');
      expect(summary.duration).toBe(5000); // 5 seconds

      // Statistics
      expect(summary.statistics.totalNodes).toBe(2);
      expect(summary.statistics.executedNodes).toBe(2);
      expect(summary.statistics.successfulNodes).toBe(2);
      expect(summary.statistics.failedNodes).toBe(0);
      expect(summary.statistics.totalItemsProcessed).toBe(3); // 2 from Start + 1 from HTTP Request

      // Available nodes
      expect(summary.availableNodes).toHaveLength(2);
      expect(summary.availableNodes[0]).toEqual({
        nodeName: 'Start',
        nodeType: 'n8n-nodes-base.start',
        status: 'success',
      });
      expect(summary.availableNodes[1]).toEqual({
        nodeName: 'HTTP Request',
        nodeType: 'n8n-nodes-base.httpRequest',
        status: 'success',
      });

      // Guidance
      expect(summary._guidance.message).toContain('get_execution_by_node');
      expect(summary._guidance.example).toContain('12345');
      expect(summary._guidance.example).toContain('Start');
    });

    it('should format execution with error nodes', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 456,
        workflowId: 2,
        status: 'error',
        startedAt: '2025-10-29T11:00:00.000Z',
        stoppedAt: '2025-10-29T11:00:03.000Z',
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[{ json: { test: 1 } }]] },
              }],
              'HTTP Request': [{
                node: { type: 'n8n-nodes-base.httpRequest', name: 'HTTP Request' },
                error: {
                  message: 'Connection timeout',
                  name: 'ETIMEDOUT',
                },
              }],
            },
          },
        },
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.status).toBe('error');
      expect(summary.statistics.totalNodes).toBe(2);
      expect(summary.statistics.successfulNodes).toBe(1);
      expect(summary.statistics.failedNodes).toBe(1);

      // Error node should be marked as error
      const errorNode = summary.availableNodes.find(n => n.nodeName === 'HTTP Request');
      expect(errorNode?.status).toBe('error');
    });

    it('should handle execution without runData', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 789,
        workflowId: 3,
        status: 'waiting',
        startedAt: '2025-10-29T12:00:00.000Z',
        data: {},
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.statistics.totalNodes).toBe(0);
      expect(summary.statistics.executedNodes).toBe(0);
      expect(summary.statistics.successfulNodes).toBe(0);
      expect(summary.statistics.failedNodes).toBe(0);
      expect(summary.statistics.totalItemsProcessed).toBe(0);
      expect(summary.availableNodes).toHaveLength(0);
    });

    it('should handle execution without stoppedAt (running execution)', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 999,
        workflowId: 4,
        status: 'running',
        startedAt: '2025-10-29T13:00:00.000Z',
        stoppedAt: null,
        data: {
          resultData: {
            runData: {
              'Start': [{
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[]] },
              }],
            },
          },
        },
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.stoppedAt).toBeUndefined();
      expect(summary.duration).toBeUndefined();
      expect(summary.status).toBe('running');
    });

    it('should normalize non-standard status values', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 111,
        workflowId: 5,
        status: 'crashed',
        startedAt: '2025-10-29T14:00:00.000Z',
        data: {},
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.status).toBe('error'); // 'crashed' should be normalized to 'error'
    });

    it('should count items correctly from multiple nodes', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 222,
        workflowId: 6,
        status: 'success',
        startedAt: '2025-10-29T15:00:00.000Z',
        stoppedAt: '2025-10-29T15:00:10.000Z',
        data: {
          resultData: {
            runData: {
              'Node1': [{
                node: { type: 'n8n-nodes-base.set', name: 'Node1' },
                data: {
                  main: [
                    [
                      { json: { id: 1 } },
                      { json: { id: 2 } },
                      { json: { id: 3 } },
                    ],
                  ],
                },
              }],
              'Node2': [{
                node: { type: 'n8n-nodes-base.set', name: 'Node2' },
                data: {
                  main: [
                    [
                      { json: { id: 4 } },
                      { json: { id: 5 } },
                    ],
                  ],
                },
              }],
            },
          },
        },
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.statistics.totalItemsProcessed).toBe(5); // 3 + 2
    });

    it('should handle nodes without output data', () => {
      // Arrange
      const mockExecution: Execution = {
        id: 333,
        workflowId: 7,
        status: 'success',
        startedAt: '2025-10-29T16:00:00.000Z',
        stoppedAt: '2025-10-29T16:00:01.000Z',
        data: {
          resultData: {
            runData: {
              'EmptyNode': [{
                node: { type: 'n8n-nodes-base.noOp', name: 'EmptyNode' },
                data: { main: [[]] }, // Empty output
              }],
            },
          },
        },
      };

      // Act
      const summary = formatter.formatSummary(mockExecution);

      // Assert
      expect(summary.statistics.totalItemsProcessed).toBe(0);
      expect(summary.statistics.successfulNodes).toBe(1);
    });
  });
});
