/**
 * NodeExecutionFormatter tests
 * Tests for node execution data extraction and formatting
 */

import { describe, it, expect } from 'vitest';
import type { Execution } from '../../generated/types.gen.js';
import { NodeExecutionFormatter } from '../node-execution-formatter.js';

describe('NodeExecutionFormatter', () => {
  const formatter = new NodeExecutionFormatter();

  describe('formatNodeExecution', () => {
    it('should extract node execution data for a successful node', () => {
      // Red: テストを先に書く
      const execution: Execution = {
        id: 123,
        workflowId: 456,
        status: 'success',
        startedAt: '2025-10-31T10:00:00Z',
        stoppedAt: '2025-10-31T10:00:05Z',
        data: {
          resultData: {
            runData: {
              'HTTP Request': [
                {
                  node: {
                    type: 'n8n-nodes-base.httpRequest',
                    name: 'HTTP Request',
                  },
                  data: {
                    main: [
                      [
                        { json: { id: 1, name: 'Test Item 1' } },
                        { json: { id: 2, name: 'Test Item 2' } },
                      ],
                    ],
                  },
                  executionTime: 150,
                  startTime: '2025-10-31T10:00:00Z',
                  endTime: '2025-10-31T10:00:00.150Z',
                },
              ],
            },
          },
        },
      };

      const result = formatter.formatNodeExecution(execution, 'HTTP Request');

      expect(result).toBeDefined();
      expect(result?.executionId).toBe('123');
      expect(result?.nodeName).toBe('HTTP Request');
      expect(result?.nodeType).toBe('n8n-nodes-base.httpRequest');
      expect(result?.status).toBe('success');
      expect(result?.executionTime).toBe(150);
      expect(result?.startTime).toBe('2025-10-31T10:00:00Z');
      expect(result?.endTime).toBe('2025-10-31T10:00:00.150Z');
      expect(result?.error).toBeNull();
    });

    it('should extract node execution data for an error node', () => {
      const execution: Execution = {
        id: 789,
        workflowId: 456,
        status: 'error',
        startedAt: '2025-10-31T10:00:00Z',
        stoppedAt: '2025-10-31T10:00:02Z',
        data: {
          resultData: {
            runData: {
              'HTTP Request': [
                {
                  node: {
                    type: 'n8n-nodes-base.httpRequest',
                    name: 'HTTP Request',
                  },
                  data: {
                    main: [[{ json: { id: 1 } }]],
                  },
                  error: {
                    message: 'Connection timeout',
                    description: 'Failed to connect to the server',
                  },
                  executionTime: 2000,
                  startTime: '2025-10-31T10:00:00Z',
                  endTime: '2025-10-31T10:00:02Z',
                },
              ],
            },
          },
        },
      };

      const result = formatter.formatNodeExecution(execution, 'HTTP Request');

      expect(result).toBeDefined();
      expect(result?.status).toBe('error');
      expect(result?.error).toBeDefined();
      expect(result?.error).toEqual({
        message: 'Connection timeout',
        description: 'Failed to connect to the server',
      });
    });

    it('should return null for non-existent node', () => {
      const execution: Execution = {
        id: 123,
        workflowId: 456,
        status: 'success',
        startedAt: '2025-10-31T10:00:00Z',
        stoppedAt: '2025-10-31T10:00:05Z',
        data: {
          resultData: {
            runData: {
              'HTTP Request': [
                {
                  node: {
                    type: 'n8n-nodes-base.httpRequest',
                    name: 'HTTP Request',
                  },
                  data: {
                    main: [[{ json: { id: 1 } }]],
                  },
                },
              ],
            },
          },
        },
      };

      const result = formatter.formatNodeExecution(execution, 'Non-Existent Node');

      expect(result).toBeNull();
    });

    it('should handle node with empty input/output', () => {
      const execution: Execution = {
        id: 123,
        workflowId: 456,
        status: 'success',
        startedAt: '2025-10-31T10:00:00Z',
        stoppedAt: '2025-10-31T10:00:05Z',
        data: {
          resultData: {
            runData: {
              'Start Node': [
                {
                  node: {
                    type: 'n8n-nodes-base.start',
                    name: 'Start Node',
                  },
                  data: {
                    main: [],
                  },
                  executionTime: 0,
                  startTime: '2025-10-31T10:00:00Z',
                  endTime: '2025-10-31T10:00:00Z',
                },
              ],
            },
          },
        },
      };

      const result = formatter.formatNodeExecution(execution, 'Start Node');

      expect(result).toBeDefined();
      expect(result?.input.items).toEqual([]);
      expect(result?.output.items).toEqual([]);
    });

    it('should handle node with missing runData', () => {
      const execution: Execution = {
        id: 123,
        workflowId: 456,
        status: 'success',
        startedAt: '2025-10-31T10:00:00Z',
        stoppedAt: '2025-10-31T10:00:05Z',
        data: {},
      };

      const result = formatter.formatNodeExecution(execution, 'HTTP Request');

      expect(result).toBeNull();
    });

    it('should extract node parameters', () => {
      const execution: Execution = {
        id: 123,
        workflowId: 456,
        status: 'success',
        startedAt: '2025-10-31T10:00:00Z',
        stoppedAt: '2025-10-31T10:00:05Z',
        data: {
          resultData: {
            runData: {
              'HTTP Request': [
                {
                  node: {
                    type: 'n8n-nodes-base.httpRequest',
                    name: 'HTTP Request',
                    parameters: {
                      method: 'GET',
                      url: 'https://example.com/api',
                      timeout: 30000,
                    },
                  },
                  data: {
                    main: [[{ json: { result: 'ok' } }]],
                  },
                  executionTime: 100,
                  startTime: '2025-10-31T10:00:00Z',
                  endTime: '2025-10-31T10:00:00.100Z',
                },
              ],
            },
          },
        },
      };

      const result = formatter.formatNodeExecution(execution, 'HTTP Request');

      expect(result).toBeDefined();
      expect(result?.parameters).toEqual({
        method: 'GET',
        url: 'https://example.com/api',
        timeout: 30000,
      });
    });
  });
});
