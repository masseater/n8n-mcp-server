/**
 * CreateWorkflowFromFileTool class implementation
 */

import { z } from "zod";
import { RawTool } from "../base/raw-tool.js";
import type { WorkflowSummary } from "../../types/index.js";
import { loadWorkflowFromFile } from "../utils/file-loader.js";

type CreateWorkflowFromFileArgs = {
  filePath: string;
  raw?: boolean;
};

type CreateWorkflowFromFileCoreArgs = Omit<CreateWorkflowFromFileArgs, "raw">;

/**
 * Tool for creating workflows from local JSON files
 * Supports raw option for controlling response verbosity
 */
export class CreateWorkflowFromFileTool extends RawTool<CreateWorkflowFromFileArgs> {
  readonly name = "create_workflow_from_file";
  readonly description =
    "Create a new workflow from a local JSON file. The JSON file must contain a valid workflow definition with name, nodes, connections, and settings fields.";

  getInputSchema() {
    return z.object({
      filePath: z.string().describe("Path to workflow JSON file (absolute or relative)"),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: CreateWorkflowFromFileCoreArgs): Promise<WorkflowSummary> {
    const workflow = await loadWorkflowFromFile(args.filePath);
    return await this.context.n8nClient.createWorkflow(workflow);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowSummary;
    return this.context.responseBuilder.createCreateWorkflowResponse(workflow, raw);
  }
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;
  const fs = await import("fs/promises");

  type MockFn = ReturnType<typeof vi.fn>;
  type MockN8nClient = {
    createWorkflow: MockFn;
  };
  type MockResponseBuilder = {
    createCreateWorkflowResponse: MockFn;
  };

  type MockToolContext = {
    n8nClient: MockN8nClient;
    responseBuilder: MockResponseBuilder;
  };

  describe("CreateWorkflowFromFileTool", () => {
    let tool: CreateWorkflowFromFileTool;
    let mockN8nClient: MockN8nClient;
    let mockResponseBuilder: MockResponseBuilder;
    const testDir = "/tmp/n8n-mcp-test-create-tool";
    const validWorkflowPath = `${testDir}/valid.json`;

    beforeEach(async () => {
      await fs.mkdir(testDir, { recursive: true });

      await fs.writeFile(
        validWorkflowPath,
        JSON.stringify({
          name: "Test Workflow",
          nodes: [
            {
              id: "node1",
              name: "Start",
              type: "n8n-nodes-base.start",
              typeVersion: 1,
              position: [250, 300],
              parameters: {},
            },
          ],
          connections: {},
          settings: {},
        }),
      );

      mockN8nClient = {
        createWorkflow: vi.fn(),
      };

      mockResponseBuilder = {
        createCreateWorkflowResponse: vi.fn(),
      };

      const context: MockToolContext = {
        n8nClient: mockN8nClient,
        responseBuilder: mockResponseBuilder,
      };

      tool = new CreateWorkflowFromFileTool(context as never);
    });

    describe("getInputSchema", () => {
      it("should have correct schema", () => {
        const schema = tool.getInputSchema();
        const result = schema.safeParse({
          filePath: "/path/to/workflow.json",
          raw: true,
        });

        expect(result.success).toBe(true);
      });

      it("should require filePath", () => {
        const schema = tool.getInputSchema();
        const result = schema.safeParse({});

        expect(result.success).toBe(false);
      });
    });

    describe("executeCore", () => {
      it("should load workflow from file and create it", async () => {
        const expectedWorkflow = {
          id: "new-id",
          name: "Test Workflow",
          active: false,
          tags: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          nodeCount: 1,
        };

        mockN8nClient.createWorkflow.mockResolvedValue(expectedWorkflow);

        const result = await tool.executeCore({ filePath: validWorkflowPath });

        expect(result).toEqual(expectedWorkflow);
        expect(mockN8nClient.createWorkflow).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Test Workflow",
            nodes: expect.any(Array) as unknown[],
            connections: expect.any(Object) as Record<string, unknown>,
            settings: expect.any(Object) as Record<string, unknown>,
          }),
        );
      });

      it("should propagate file loading errors", async () => {
        await expect(tool.executeCore({ filePath: "/nonexistent/file.json" })).rejects.toThrow(
          "File not found",
        );
      });

      it("should propagate API errors", async () => {
        mockN8nClient.createWorkflow.mockRejectedValue(new Error("API Error"));

        await expect(tool.executeCore({ filePath: validWorkflowPath })).rejects.toThrow(
          "API Error",
        );
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
        mockResponseBuilder.createCreateWorkflowResponse.mockReturnValue(expectedResponse);

        const result = tool.formatResponse(workflow, false);

        expect(result).toEqual(expectedResponse);
        expect(mockResponseBuilder.createCreateWorkflowResponse).toHaveBeenCalledWith(
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

        expect(mockResponseBuilder.createCreateWorkflowResponse).toHaveBeenCalledWith(
          workflow,
          true,
        );
      });
    });
  });
}
