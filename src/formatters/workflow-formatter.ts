/**
 * Workflow data formatter
 */

import type { WorkflowDetail, ConnectionSummary, NodeConnection } from "../types/index.js";
import type { WorkflowDetailInternal } from "../clients/n8n-api-client.js";
import type { IConnections, IWorkflowSettings } from "../types/n8n-types.js";
import { isPlainObject, isArray, isString } from 'remeda';

/**
 * Workflow formatter implementation
 */
export class WorkflowFormatter {

  /**
   * Format workflow detail for context efficiency
   */
  formatWorkflowDetail(workflow: WorkflowDetailInternal): WorkflowDetail {
    // Extract only essential node information
    const formattedNodes = workflow.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      position: node.position,
      disabled: node.disabled ?? false,
    }));

    // Simplify connections structure
    const formattedConnections = this.formatConnections(workflow.connections);

    return {
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
      tags: workflow.tags,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
      nodes: formattedNodes,
      connections: formattedConnections as ConnectionSummary,
      settings: workflow.settings
        ? this.formatSettings(workflow.settings)
        : undefined,
    };
  }

  /**
   * Format connections structure
   */
  private formatConnections(connections: IConnections): Record<string, unknown> {
    if (!isPlainObject(connections)) {
      return {};
    }

    const formatted: Record<string, unknown> = {};

    for (const [sourceNode, targets] of Object.entries(connections)) {
      if (isPlainObject(targets)) {
        formatted[sourceNode] = {};

        for (const [outputName, conns] of Object.entries(targets)) {
          if (isArray(conns)) {
            (formatted[sourceNode] as Record<string, unknown>)[outputName] = conns.map((conn) => {
              if (!isPlainObject(conn)) {
                return { node: '', type: '', index: 0 };
              }
              return {
                node: isString(conn.node) ? conn.node : '',
                type: isString(conn.type) ? conn.type : '',
                index: typeof conn.index === 'number' ? conn.index : 0,
              };
            });
          }
        }
      }
    }

    return formatted;
  }

  /**
   * Format workflow settings
   */
  private formatSettings(settings: IWorkflowSettings): Record<string, unknown> {
    return {
      executionOrder: settings.executionOrder,
      saveManualExecutions: settings.saveManualExecutions,
      saveExecutionProgress: settings.saveExecutionProgress,
      saveDataErrorExecution: settings.saveDataErrorExecution,
      saveDataSuccessExecution: settings.saveDataSuccessExecution,
      timezone: settings.timezone,
    };
  }

  /**
   * Format workflow connections as a graph structure
   * Shows inputs and outputs for each node
   */
  formatWorkflowConnections(workflow: WorkflowDetailInternal): NodeConnection[] {
    const outputMap = this.buildOutputMap(workflow.connections);
    const inputMap = this.buildInputMap(outputMap);

    return workflow.nodes.map((node): NodeConnection => {
      const nodeName = node.name;
      return {
        node: nodeName,
        id: node.id,
        type: node.type,
        inputs: inputMap.get(nodeName) ?? [],
        outputs: outputMap.get(nodeName) ?? [],
      };
    });
  }

  /**
   * Build output map from connections structure
   */
  private buildOutputMap(connections: IConnections): Map<string, string[]> {
    const outputMap = new Map<string, string[]>();

    for (const [sourceNodeName, outputs] of Object.entries(connections)) {
      const targetNodes = this.extractTargetNodes(outputs);
      outputMap.set(sourceNodeName, targetNodes);
    }

    return outputMap;
  }

  /**
   * Extract target node names from connection outputs
   */
  private extractTargetNodes(outputs: unknown): string[] {
    const targetNodes: string[] = [];

    if (!isPlainObject(outputs)) {
      return targetNodes;
    }

    for (const conns of Object.values(outputs)) {
      if (!isArray(conns)) continue;

      for (const connArray of conns) {
        if (!isArray(connArray)) continue;

        for (const conn of connArray) {
          if (!isPlainObject(conn)) continue;

          const nodeName = conn.node;
          if (isString(nodeName)) {
            targetNodes.push(nodeName);
          }
        }
      }
    }

    return targetNodes;
  }

  /**
   * Build input map by reversing output connections
   */
  private buildInputMap(outputMap: Map<string, string[]>): Map<string, string[]> {
    const inputMap = new Map<string, string[]>();

    for (const [sourceNodeName, targets] of outputMap.entries()) {
      for (const targetNodeName of targets) {
        const inputs = inputMap.get(targetNodeName) ?? [];
        inputs.push(sourceNodeName);
        inputMap.set(targetNodeName, inputs);
      }
    }

    return inputMap;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("WorkflowFormatter", () => {
    const formatter = new WorkflowFormatter();

    describe("formatWorkflowConnections", () => {
      it("should convert simple linear workflow connections to graph structure", () => {
        const workflow = {
          id: "wf-1",
          name: "Test Workflow",
          active: true,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start", typeVersion: 1, position: [250, 300] as [number, number], parameters: {} },
            { id: "node2", name: "HTTP Request", type: "n8n-nodes-base.httpRequest", typeVersion: 1, position: [450, 300] as [number, number], parameters: {} },
            { id: "node3", name: "Set", type: "n8n-nodes-base.set", typeVersion: 1, position: [650, 300] as [number, number], parameters: {} },
          ],
          connections: {
            Start: {
              main: [[{ node: "HTTP Request", type: "main", index: 0 }]],
            },
            "HTTP Request": {
              main: [[{ node: "Set", type: "main", index: 0 }]],
            },
          },
        };

        const result = formatter.formatWorkflowConnections(workflow);

        expect(result).toEqual([
          {
            node: "Start",
            id: "node1",
            type: "n8n-nodes-base.start",
            inputs: [],
            outputs: ["HTTP Request"],
          },
          {
            node: "HTTP Request",
            id: "node2",
            type: "n8n-nodes-base.httpRequest",
            inputs: ["Start"],
            outputs: ["Set"],
          },
          {
            node: "Set",
            id: "node3",
            type: "n8n-nodes-base.set",
            inputs: ["HTTP Request"],
            outputs: [],
          },
        ]);
      });

      it("should handle workflow with branching connections", () => {
        const workflow = {
          id: "wf-2",
          name: "Branching Workflow",
          active: true,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start", typeVersion: 1, position: [250, 300] as [number, number], parameters: {} },
            { id: "node2", name: "HTTP", type: "n8n-nodes-base.httpRequest", typeVersion: 1, position: [450, 300] as [number, number], parameters: {} },
            { id: "node3", name: "Set1", type: "n8n-nodes-base.set", typeVersion: 1, position: [650, 300] as [number, number], parameters: {} },
            { id: "node4", name: "Set2", type: "n8n-nodes-base.set", typeVersion: 1, position: [650, 450] as [number, number], parameters: {} },
          ],
          connections: {
            Start: {
              main: [[{ node: "HTTP", type: "main", index: 0 }]],
            },
            HTTP: {
              main: [
                [
                  { node: "Set1", type: "main", index: 0 },
                  { node: "Set2", type: "main", index: 0 },
                ],
              ],
            },
          },
        };

        const result = formatter.formatWorkflowConnections(workflow);

        expect(result[1]).toEqual({
          node: "HTTP",
          id: "node2",
          type: "n8n-nodes-base.httpRequest",
          inputs: ["Start"],
          outputs: ["Set1", "Set2"],
        });
      });

      it("should handle workflow with no connections", () => {
        const workflow = {
          id: "wf-3",
          name: "Standalone Workflow",
          active: true,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodes: [
            { id: "node1", name: "Standalone", type: "n8n-nodes-base.start", typeVersion: 1, position: [250, 300] as [number, number], parameters: {} },
          ],
          connections: {},
        };

        const result = formatter.formatWorkflowConnections(workflow);

        expect(result).toEqual([
          {
            node: "Standalone",
            id: "node1",
            type: "n8n-nodes-base.start",
            inputs: [],
            outputs: [],
          },
        ]);
      });
    });
  });
}
