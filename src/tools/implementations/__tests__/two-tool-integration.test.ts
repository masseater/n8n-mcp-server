/**
 * Two-Tool Integration Tests (get_execution + get_execution_by_node)
 * Phase 7: Progressive Execution Loading - AI Agent workflow scenarios
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ToolContext } from '../../base-tool.js';
import type { N8nApiClient } from '../../../clients/types.js';
import { ToolResponseBuilder } from '../../../formatters/tool-response-builder.js';
import type { Execution } from '../../../generated/types.gen.js';
import type { MCPToolResponse, ExecutionSummary, NodeExecutionData } from '../../../types/index.js';
import { GetExecutionTool } from '../get-execution-tool.js';
import { GetExecutionByNodeTool } from '../get-execution-by-node-tool.js';

describe('Two-Tool Integration Tests', () => {
  let mockN8nClient: N8nApiClient;
  let responseBuilder: ToolResponseBuilder;
  let context: ToolContext;
  let getExecutionTool: GetExecutionTool;
  let getExecutionByNodeTool: GetExecutionByNodeTool;

  beforeEach(() => {
    // Create real ToolResponseBuilder (not mocked)
    responseBuilder = new ToolResponseBuilder();

    // Mock n8n API client
    const mockClient = {
      getExecution: vi.fn(),
    };
    mockN8nClient = vi.mocked(mockClient) as unknown as N8nApiClient;

    context = {
      n8nClient: mockN8nClient,
      responseBuilder,
    };

    getExecutionTool = new GetExecutionTool(context);
    getExecutionByNodeTool = new GetExecutionByNodeTool(context);
  });

  describe('Phase 7 Task 2: 正常実行確認シナリオ', () => {
    it('TC-TWO-TOOL-001: AIエージェントが実行の状態を確認し、全ノードが正常であることを報告', async () => {
      // Arrange - 正常実行のfixture
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
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[{ json: { trigger: true } }]] },
                executionTime: 10,
                startTime: '2025-11-03T10:00:00Z',
                endTime: '2025-11-03T10:00:00.010Z',
              }],
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: { method: 'GET', url: 'https://api.example.com/data' },
                },
                data: { main: [[{ json: { result: 'success' } }]] },
                executionTime: 1500,
                startTime: '2025-11-03T10:00:00.010Z',
                endTime: '2025-11-03T10:00:01.510Z',
              }],
              'Set': [{
                node: {
                  type: 'n8n-nodes-base.set',
                  name: 'Set',
                  parameters: { values: {} },
                },
                data: { main: [[{ json: { processed: true } }]] },
                executionTime: 50,
                startTime: '2025-11-03T10:00:01.510Z',
                endTime: '2025-11-03T10:00:01.560Z',
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act - ステップ1: get_executionを呼び出し
      const summaryResult = (await getExecutionTool.execute({
        id: '12345',
      })) as MCPToolResponse<ExecutionSummary>;

      // Assert - ExecutionSummaryを確認
      expect(summaryResult.success).toBe(true);
      const summary = summaryResult.data;
      expect(summary).toBeDefined();
      if (!summary) return;

      // ステップ2: 全ノードが正常であることを確認（AIエージェントの判断）
      expect(summary.status).toBe('success');
      expect(summary.statistics.failedNodes).toBe(0);
      expect(summary.statistics.successfulNodes).toBe(3);
      expect(summary.availableNodes).toHaveLength(3);

      // ステップ3: AIエージェントが「正常完了」を報告（テストではログ出力で代用）
      console.log('✅ AI Agent: ワークフロー実行は正常に完了しました。3個のノードが成功しました。');
    });
  });

  describe('Phase 7 Task 3: エラー調査シナリオ', () => {
    it('TC-TWO-TOOL-002: AIエージェントがエラー実行を調査し、エラー原因を特定', async () => {
      // Arrange - エラー実行のfixture
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
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
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

      // Act - ステップ1: get_executionを呼び出し
      const summaryResult = (await getExecutionTool.execute({
        id: '67890',
      })) as MCPToolResponse<ExecutionSummary>;

      // Assert - ExecutionSummaryを確認
      expect(summaryResult.success).toBe(true);
      const summary = summaryResult.data;
      expect(summary).toBeDefined();
      if (!summary) return;

      // ステップ2: エラーノードを特定（AIエージェントの判断）
      expect(summary.status).toBe('error');
      expect(summary.statistics.failedNodes).toBe(1);

      const errorNode = summary.availableNodes.find((n) => n.status === 'error');
      expect(errorNode).toBeDefined();
      if (!errorNode) return; // Type guard
      expect(errorNode.nodeName).toBe('HTTP Request');

      console.log(`🔍 AI Agent: エラーノードを発見: ${errorNode.nodeName} (${errorNode.nodeType})`);

      // ステップ3: エラーノードの詳細を取得
      const nodeResult = (await getExecutionByNodeTool.execute({
        id: '67890',
        nodeName: errorNode.nodeName,
      })) as MCPToolResponse<NodeExecutionData>;

      // Assert - NodeExecutionDataを確認
      expect(nodeResult.success).toBe(true);
      const nodeData = nodeResult.data;
      expect(nodeData).toBeDefined();
      if (!nodeData) return;

      // ステップ4: エラー詳細を確認（AIエージェントの分析）
      expect(nodeData.status).toBe('error');
      expect(nodeData.error).toBeDefined();
      expect(nodeData.error).toHaveProperty('message', 'ETIMEDOUT: Connection timeout after 30000ms');

      // ステップ5: AIエージェントが人間ユーザーにエラー原因を報告
      console.log(`❌ AI Agent: HTTP Requestノードで接続タイムアウトエラーが発生しました。`);
      console.log(`   エラー: ${(nodeData.error as { message: string }).message}`);
    });
  });

  describe('Phase 7 Task 4: 複数ノード取得シナリオ', () => {
    it('TC-TWO-TOOL-003: AIエージェントが複数ノードの詳細を段階的に取得', async () => {
      // Arrange - 3ノード実行のfixture
      const mockExecution: Execution = {
        id: 11111,
        workflowId: 3,
        status: 'success',
        startedAt: '2025-11-03T12:00:00Z',
        stoppedAt: '2025-11-03T12:00:10Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'Node1': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'Node1',
                  parameters: { url: 'https://api1.example.com' },
                },
                data: { main: [[{ json: { data1: 'value1' } }]] },
                executionTime: 1000,
                startTime: '2025-11-03T12:00:00Z',
                endTime: '2025-11-03T12:00:01Z',
              }],
              'Node2': [{
                node: {
                  type: 'n8n-nodes-base.set',
                  name: 'Node2',
                  parameters: { values: {} },
                },
                data: { main: [[{ json: { data2: 'value2' } }]] },
                executionTime: 500,
                startTime: '2025-11-03T12:00:01Z',
                endTime: '2025-11-03T12:00:01.500Z',
              }],
              'Node3': [{
                node: {
                  type: 'n8n-nodes-base.code',
                  name: 'Node3',
                  parameters: { jsCode: 'return items;' },
                },
                data: { main: [[{ json: { data3: 'value3' } }]] },
                executionTime: 200,
                startTime: '2025-11-03T12:00:01.500Z',
                endTime: '2025-11-03T12:00:01.700Z',
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act - ステップ1: get_executionを呼び出し
      const summaryResult = (await getExecutionTool.execute({
        id: '11111',
      })) as MCPToolResponse<ExecutionSummary>;

      // Assert - ステップ2: availableNodesを確認
      const summary = summaryResult.data;
      expect(summary).toBeDefined();
      if (!summary) return;

      expect(summary.availableNodes).toHaveLength(3);
      const nodeNames = summary.availableNodes.map((n) => n.nodeName);
      expect(nodeNames).toContain('Node1');
      expect(nodeNames).toContain('Node2');
      expect(nodeNames).toContain('Node3');

      // ステップ3-5: 各ノードの詳細を順番に取得（AIエージェントが複数回呼び出し）
      const nodeDataList: NodeExecutionData[] = [];

      for (const node of summary.availableNodes) {
        const nodeResult = (await getExecutionByNodeTool.execute({
          id: '11111',
          nodeName: node.nodeName,
        })) as MCPToolResponse<NodeExecutionData>;

        expect(nodeResult.success).toBe(true);
        expect(nodeResult.data).toBeDefined();
        if (nodeResult.data) {
          nodeDataList.push(nodeResult.data);
        }
      }

      // ステップ6: AIエージェントが全ノードの情報を統合して報告
      expect(nodeDataList).toHaveLength(3);
      expect(nodeDataList[0]?.nodeName).toBe('Node1');
      expect(nodeDataList[1]?.nodeName).toBe('Node2');
      expect(nodeDataList[2]?.nodeName).toBe('Node3');

      console.log('📊 AI Agent: 3個のノードの詳細データを取得しました:');
      for (const nodeData of nodeDataList) {
        console.log(`  - ${nodeData.nodeName}: ${nodeData.nodeType}, ${String(nodeData.executionTime)}ms`);
      }
    });
  });

  describe('Phase 7 Task 5: レスポンス時間測定', () => {
    it('TC-TWO-TOOL-004: get_executionのレスポンス時間は1秒以内', async () => {
      // Arrange
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
                node: { type: 'n8n-nodes-base.start', name: 'Start' },
                data: { main: [[{ json: { test: 'data' } }]] },
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act - レスポンス時間測定
      const startTime = performance.now();
      await getExecutionTool.execute({ id: '12345' });
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      console.log(`⏱️ get_execution response time: ${responseTime.toFixed(2)}ms`);

      // Assert - レスポンス時間が1秒以内（目標）
      // Note: モックなので実際は数ミリ秒程度
      expect(responseTime).toBeLessThan(1000);
    });

    it('TC-TWO-TOOL-005: get_execution_by_nodeのレスポンス時間は2秒以内', async () => {
      // Arrange
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
              'HTTP Request': [{
                node: {
                  type: 'n8n-nodes-base.httpRequest',
                  name: 'HTTP Request',
                  parameters: { method: 'GET', url: 'https://api.example.com/data' },
                },
                data: {
                  main: [
                    Array.from({ length: 50 }, (_, i) => ({
                      json: { id: i + 1, name: `Item ${String(i + 1)}` },
                    })),
                  ],
                },
                executionTime: 1500,
                startTime: '2025-11-03T10:00:00Z',
                endTime: '2025-11-03T10:00:01.500Z',
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act - レスポンス時間測定
      const startTime = performance.now();
      await getExecutionByNodeTool.execute({
        id: '12345',
        nodeName: 'HTTP Request',
      });
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      console.log(`⏱️ get_execution_by_node response time: ${responseTime.toFixed(2)}ms`);

      // Assert - レスポンス時間が2秒以内（目標）
      expect(responseTime).toBeLessThan(2000);
    });

    it('TC-TWO-TOOL-006: 複数ノード取得（3ノード）の合計レスポンス時間は7秒以内', async () => {
      // Arrange - 3ノード実行のfixture
      const mockExecution: Execution = {
        id: 11111,
        workflowId: 3,
        status: 'success',
        startedAt: '2025-11-03T12:00:00Z',
        stoppedAt: '2025-11-03T12:00:10Z',
        mode: 'manual',
        finished: true,
        data: {
          resultData: {
            runData: {
              'Node1': [{
                node: { type: 'n8n-nodes-base.httpRequest', name: 'Node1' },
                data: { main: [[{ json: { data1: 'value1' } }]] },
              }],
              'Node2': [{
                node: { type: 'n8n-nodes-base.set', name: 'Node2' },
                data: { main: [[{ json: { data2: 'value2' } }]] },
              }],
              'Node3': [{
                node: { type: 'n8n-nodes-base.code', name: 'Node3' },
                data: { main: [[{ json: { data3: 'value3' } }]] },
              }],
            },
          },
        },
      };

      vi.mocked(mockN8nClient.getExecution).mockResolvedValue(mockExecution);

      // Act - ステップ1: get_execution
      const step1Start = performance.now();
      const summaryResult = (await getExecutionTool.execute({
        id: '11111',
      })) as MCPToolResponse<ExecutionSummary>;
      const step1End = performance.now();
      const step1Time = step1End - step1Start;

      const summary = summaryResult.data;
      expect(summary).toBeDefined();
      if (!summary) return;

      // ステップ2-4: 各ノードの詳細を取得
      const step2Start = performance.now();
      const nodeTimes: number[] = [];

      for (const node of summary.availableNodes) {
        const nodeStart = performance.now();
        await getExecutionByNodeTool.execute({
          id: '11111',
          nodeName: node.nodeName,
        });
        const nodeEnd = performance.now();
        nodeTimes.push(nodeEnd - nodeStart);
      }

      const step2End = performance.now();
      const step2Time = step2End - step2Start;
      const totalTime = step1Time + step2Time;

      console.log(`⏱️ Total workflow time: ${totalTime.toFixed(2)}ms`);
      console.log(`  - get_execution: ${step1Time.toFixed(2)}ms`);
      console.log(`  - get_execution_by_node (3 calls): ${step2Time.toFixed(2)}ms`);

      // Assert - 合計レスポンス時間が7秒以内（目標）
      expect(totalTime).toBeLessThan(7000);
    });
  });
});
