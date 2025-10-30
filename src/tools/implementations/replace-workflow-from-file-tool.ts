/**
 * ReplaceWorkflowFromFileTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import type { WorkflowDetailInternal } from "../../clients/n8n-api-client.js";
import { loadWorkflowFromFile } from "../utils/file-loader.js";

type ReplaceWorkflowFromFileArgs = {
  id: string;
  filePath: string;
  raw?: boolean;
};

type ReplaceWorkflowFromFileCoreArgs = Omit<ReplaceWorkflowFromFileArgs, "raw">;

/**
 * Tool for replacing workflows completely from local JSON files
 * Supports raw option for controlling response verbosity
 */
export class ReplaceWorkflowFromFileTool extends RawTool<ReplaceWorkflowFromFileArgs> {
  readonly name = "replace_workflow_from_file";
  readonly description =
    "Replace an existing workflow completely with data from a local JSON file. All workflow fields will be overwritten with the file contents.";

  getInputSchema() {
    return z.object({
      id: z.string().describe("Workflow ID to replace"),
      filePath: z.string().describe("Path to workflow JSON file (absolute or relative)"),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: ReplaceWorkflowFromFileCoreArgs): Promise<WorkflowDetailInternal> {
    const workflow = await loadWorkflowFromFile(args.filePath);
    return await this.context.n8nClient.updateWorkflow(args.id, workflow);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowDetailInternal;
    return this.context.responseBuilder.createUpdateWorkflowResponse(workflow, raw);
  }
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;
  const fs = await import("fs/promises");

  type MockFn = ReturnType<typeof vi.fn>;
  type MockN8nClient = {
    updateWorkflow: MockFn;
  };
  type MockResponseBuilder = {
    createUpdateWorkflowResponse: MockFn;
  };

  type MockToolContext = {
    n8nClient: MockN8nClient;
    responseBuilder: MockResponseBuilder;
  };

  describe("ReplaceWorkflowFromFileTool", () => {
    let tool: ReplaceWorkflowFromFileTool;
    let mockN8nClient: MockN8nClient;
    let mockResponseBuilder: MockResponseBuilder;
    const testDir = "/tmp/n8n-mcp-test-replace-tool";
    const validWorkflowPath = `${testDir}/valid.json`;

    beforeEach(async () => {
      await fs.mkdir(testDir, { recursive: true });

      await fs.writeFile(
        validWorkflowPath,
        JSON.stringify({
          name: "Replacement Workflow",
          nodes: [
            {
              id: "node1",
              name: "Start",
              type: "n8n-nodes-base.start",
              typeVersion: 1,
              position: [250, 300],
              parameters: {},
            },
            {
              id: "node2",
              name: "HTTP",
              type: "n8n-nodes-base.httpRequest",
              typeVersion: 1,
              position: [450, 300],
              parameters: {},
            },
          ],
          connections: {
            Start: {
              main: [[{ node: "HTTP", type: "main", index: 0 }]],
            },
          },
          settings: {},
          tags: ["replaced"],
        }),
      );

      mockN8nClient = {
        updateWorkflow: vi.fn(),
      };

      mockResponseBuilder = {
        createUpdateWorkflowResponse: vi.fn(),
      };

      const context: MockToolContext = {
        n8nClient: mockN8nClient,
        responseBuilder: mockResponseBuilder,
      };

      tool = new ReplaceWorkflowFromFileTool(context as never);
    });

    describe("getInputSchema", () => {
      it("should have correct schema", () => {
        const schema = tool.getInputSchema();
        const result = schema.safeParse({
          id: "workflow-123",
          filePath: "/path/to/workflow.json",
          raw: true,
        });

        expect(result.success).toBe(true);
      });

      it("should require id and filePath", () => {
        const schema = tool.getInputSchema();
        const result1 = schema.safeParse({ filePath: "/path/to/workflow.json" });
        const result2 = schema.safeParse({ id: "workflow-123" });

        expect(result1.success).toBe(false);
        expect(result2.success).toBe(false);
      });
    });

    describe("executeCore", () => {
      it("should load workflow from file and replace existing workflow", async () => {
        const expectedWorkflow = {
          id: "workflow-123",
          name: "Replacement Workflow",
          active: true,
          tags: ["replaced"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-02",
          nodeCount: 2,
        };

        mockN8nClient.updateWorkflow.mockResolvedValue(expectedWorkflow);

        const result = await tool.executeCore({
          id: "workflow-123",
          filePath: validWorkflowPath,
        });

        expect(result).toEqual(expectedWorkflow);
        expect(mockN8nClient.updateWorkflow).toHaveBeenCalledWith(
          "workflow-123",
          expect.objectContaining({
            name: "Replacement Workflow",
            nodes: expect.any(Array) as unknown[],
            connections: expect.any(Object) as Record<string, unknown>,
            settings: expect.any(Object) as Record<string, unknown>,
            tags: ["replaced"],
          }),
        );
      });

      it("should propagate file loading errors", async () => {
        await expect(
          tool.executeCore({
            id: "workflow-123",
            filePath: "/nonexistent/file.json",
          }),
        ).rejects.toThrow("File not found");
      });

      it("should propagate API errors", async () => {
        mockN8nClient.updateWorkflow.mockRejectedValue(new Error("API Error"));

        await expect(
          tool.executeCore({
            id: "workflow-123",
            filePath: validWorkflowPath,
          }),
        ).rejects.toThrow("API Error");
      });
    });

    describe("formatResponse", () => {
      it("should delegate to responseBuilder", () => {
        const workflow = {
          id: "test-id",
          name: "Test",
          active: false,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodeCount: 1,
        };

        const expectedResponse = { success: true, data: workflow };
        mockResponseBuilder.createUpdateWorkflowResponse.mockReturnValue(expectedResponse);

        const result = tool.formatResponse(workflow, false);

        expect(result).toEqual(expectedResponse);
        expect(mockResponseBuilder.createUpdateWorkflowResponse).toHaveBeenCalledWith(
          workflow,
          false,
        );
      });

      it("should pass raw parameter correctly", () => {
        const workflow = {
          id: "test-id",
          name: "Test",
          active: false,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodeCount: 1,
        };

        tool.formatResponse(workflow, true);

        expect(mockResponseBuilder.createUpdateWorkflowResponse).toHaveBeenCalledWith(
          workflow,
          true,
        );
      });
    });
  });
}
