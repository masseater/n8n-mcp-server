/**
 * Workflow data formatter
 */

import type { WorkflowDetail, WorkflowSummary, ConnectionSummary, NodeConnection } from "../types/index.js";

/**
 * Workflow formatter implementation
 */
export class WorkflowFormatter {
  /**
   * Format workflow summary for context efficiency
   */
  formatWorkflowSummary(workflow: unknown): WorkflowSummary {
    const wf = workflow as Record<string, unknown>;
    return {
      id: wf.id as string,
      name: wf.name as string,
      active: (wf.active as boolean | undefined) ?? false,
      tags: (wf.tags as string[] | undefined) ?? [],
      createdAt: wf.createdAt as string,
      updatedAt: wf.updatedAt as string,
      nodeCount: ((wf.nodes as unknown[] | undefined) ?? []).length,
    };
  }

  /**
   * Format multiple workflows for context efficiency
   */
  formatWorkflows(workflows: unknown[]): WorkflowSummary[] {
    return workflows.map((workflow) => this.formatWorkflowSummary(workflow));
  }

  /**
   * Format workflow detail for context efficiency
   */
  formatWorkflowDetail(workflow: unknown): WorkflowDetail {
    const wf = workflow as Record<string, unknown>;

    // Extract only essential node information
    const formattedNodes = (wf.nodes as unknown[]).map((node: unknown) => {
      const n = node as Record<string, unknown>;
      return {
        id: n.id as string,
        name: n.name as string,
        type: n.type as string,
        position: n.position as [number, number],
        disabled: (n.disabled as boolean | undefined) ?? false,
      };
    });

    // Simplify connections structure
    const connections = wf.connections as Record<string, unknown> | undefined;
    const formattedConnections = this.formatConnections(
      connections ?? {},
    );

    return {
      id: wf.id as string,
      name: wf.name as string,
      active: (wf.active as boolean | undefined) ?? false,
      tags: (wf.tags as string[] | undefined) ?? [],
      createdAt: wf.createdAt as string,
      updatedAt: wf.updatedAt as string,
      nodes: formattedNodes,
      connections: formattedConnections as ConnectionSummary,
      settings: wf.settings
        ? this.formatSettings(wf.settings as Record<string, unknown>)
        : undefined,
    };
  }

  /**
   * Format connections structure
   */
  private formatConnections(connections: Record<string, unknown>): Record<string, unknown> {
    if (typeof connections !== "object") {
      return {};
    }

    const formatted: Record<string, unknown> = {};

    for (const [sourceNode, targets] of Object.entries(connections)) {
      if (typeof targets === "object" && targets !== null) {
        formatted[sourceNode] = {};

        for (
          const [outputName, conns] of Object.entries(targets as Record<string, unknown>)
        ) {
          if (Array.isArray(conns)) {
            (formatted[sourceNode] as Record<string, unknown>)[outputName] = conns.map((
              conn: unknown,
            ) => {
              const c = conn as Record<string, unknown>;
              return {
                node: c.node as string,
                type: c.type as string,
                index: c.index as number,
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
  private formatSettings(settings: Record<string, unknown>): Record<string, unknown> {
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
  formatWorkflowConnections(workflow: unknown): NodeConnection[] {
    const wf = workflow as Record<string, unknown>;
    const nodes = (wf.nodes ?? []) as Record<string, unknown>[];
    const connections = (wf.connections ?? {}) as Record<string, unknown>;

    const outputMap = this.buildOutputMap(connections);
    const inputMap = this.buildInputMap(outputMap);

    return nodes.map((node): NodeConnection => {
      const nodeName = node.name as string;
      return {
        node: nodeName,
        id: node.id as string,
        type: node.type as string,
        inputs: inputMap.get(nodeName) ?? [],
        outputs: outputMap.get(nodeName) ?? [],
      };
    });
  }

  /**
   * Build output map from connections structure
   */
  private buildOutputMap(connections: Record<string, unknown>): Map<string, string[]> {
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

    if (typeof outputs !== "object" || outputs === null) {
      return targetNodes;
    }

    for (const conns of Object.values(outputs as Record<string, unknown>)) {
      if (!Array.isArray(conns)) continue;

      for (const connArray of conns) {
        if (!Array.isArray(connArray)) continue;

        for (const conn of connArray) {
          if (typeof conn !== "object" || conn === null) continue;

          const nodeName = (conn as Record<string, unknown>).node;
          if (typeof nodeName === "string") {
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

    describe("formatWorkflowSummary", () => {
      it("should extract essential workflow fields", () => {
        const workflow = {
          id: "workflow-1",
          name: "Test Workflow",
          active: true,
          tags: ["test"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodes: [{ id: "node1" }, { id: "node2" }],
          connections: {},
          settings: {},
        };

        const result = formatter.formatWorkflowSummary(workflow);

        expect(result).toEqual({
          id: "workflow-1",
          name: "Test Workflow",
          active: true,
          tags: ["test"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodeCount: 2,
        });
      });

      it("should handle missing optional fields", () => {
        const workflow = {
          id: "workflow-1",
          name: "Test Workflow",
        };

        const result = formatter.formatWorkflowSummary(workflow);

        expect(result).toEqual({
          id: "workflow-1",
          name: "Test Workflow",
          active: false,
          tags: [],
          createdAt: undefined,
          updatedAt: undefined,
          nodeCount: 0,
        });
      });
    });

    describe("formatWorkflows", () => {
      it("should format multiple workflows", () => {
        const workflows = [
          { id: "1", name: "Workflow 1", nodes: [{}] },
          { id: "2", name: "Workflow 2", nodes: [{}, {}] },
        ];

        const result = formatter.formatWorkflows(workflows);

        expect(result).toHaveLength(2);
        expect(result[0]?.nodeCount).toBe(1);
        expect(result[1]?.nodeCount).toBe(2);
      });
    });

    describe("formatWorkflowConnections", () => {
      it("should convert simple linear workflow connections to graph structure", () => {
        const workflow = {
          id: "wf-1",
          name: "Test Workflow",
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start" },
            { id: "node2", name: "HTTP Request", type: "n8n-nodes-base.httpRequest" },
            { id: "node3", name: "Set", type: "n8n-nodes-base.set" },
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
          nodes: [
            { id: "node1", name: "Start", type: "n8n-nodes-base.start" },
            { id: "node2", name: "HTTP", type: "n8n-nodes-base.httpRequest" },
            { id: "node3", name: "Set1", type: "n8n-nodes-base.set" },
            { id: "node4", name: "Set2", type: "n8n-nodes-base.set" },
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
          nodes: [
            { id: "node1", name: "Standalone", type: "n8n-nodes-base.start" },
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
