/**
 * Workflow data formatter
 */

import type { WorkflowDetail, WorkflowSummary, ConnectionSummary } from "../types/index.js";

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
    const formattedConnections = this.formatConnections(
      (wf.connections as Record<string, unknown>) ?? {},
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
  });
}
