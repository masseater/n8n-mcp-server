/**
 * File loader utility for workflow JSON files
 */

import fs from "fs/promises";
import path from "path";
import type { WorkflowDefinition } from "../../types/index.js";
import { ValidationError, FileError } from "../../errors/custom-errors.js";

/**
 * Load workflow definition from a JSON file
 */
export async function loadWorkflowFromFile(filePath: string): Promise<WorkflowDefinition> {
  // 1. Validate file path
  if (!filePath) {
    throw new ValidationError("File path is required");
  }

  // 2. Resolve to absolute path
  const absolutePath = path.resolve(filePath);

  // 3. Check file existence
  try {
    await fs.access(absolutePath);
  } catch (error) {
    throw new FileError(
      `File not found: ${absolutePath}`,
      absolutePath,
      undefined,
      { cause: error }
    );
  }

  // 4. Read file
  let content: string;
  try {
    content = await fs.readFile(absolutePath, "utf-8");
  } catch (error) {
    throw new FileError(
      `Failed to read file: ${absolutePath}`,
      absolutePath,
      undefined,
      { cause: error }
    );
  }

  // 5. Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new FileError(
      "Invalid JSON",
      absolutePath,
      undefined,
      { cause: error }
    );
  }

  // 6. Validate workflow structure
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ValidationError(
      "Workflow must be an object",
      { filePath: absolutePath }
    );
  }

  const workflow = parsed as Record<string, unknown>;

  if (typeof workflow.name !== "string") {
    throw new ValidationError(
      "Workflow name is required and must be a string",
      { filePath: absolutePath }
    );
  }

  if (!Array.isArray(workflow.nodes)) {
    throw new ValidationError(
      "Workflow nodes must be an array",
      { filePath: absolutePath }
    );
  }

  if (typeof workflow.connections !== "object" || workflow.connections === null) {
    throw new ValidationError(
      "Workflow connections must be an object",
      { filePath: absolutePath }
    );
  }

  return workflow as WorkflowDefinition;
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, afterEach } = import.meta.vitest;

  describe("loadWorkflowFromFile", () => {
    const testDir = "/tmp/n8n-mcp-test";
    const validWorkflowPath = `${testDir}/valid-workflow.json`;
    const invalidJsonPath = `${testDir}/invalid.json`;
    const missingFieldsPath = `${testDir}/missing-fields.json`;

    beforeEach(async () => {
      await fs.mkdir(testDir, { recursive: true });

      // Valid workflow JSON
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

      // Invalid JSON
      await fs.writeFile(invalidJsonPath, "{ invalid json");

      // Missing required fields
      await fs.writeFile(
        missingFieldsPath,
        JSON.stringify({
          nodes: [],
        }),
      );
    });

    afterEach(async () => {
      await fs.rm(testDir, { recursive: true, force: true });
    });

    it("should load valid workflow from file", async () => {
      const workflow = await loadWorkflowFromFile(validWorkflowPath);

        expect(workflow.name).toBe("Test Workflow");
        expect(workflow.nodes).toHaveLength(1);
        expect(workflow.nodes[0]?.name).toBe("Start");
        expect(workflow.connections).toEqual({});
      });

    it("should throw error if file path is empty", async () => {
      await expect(loadWorkflowFromFile("")).rejects.toThrow(
          "File path is required",
        );
      });

    it("should throw error if file does not exist", async () => {
      await expect(
        loadWorkflowFromFile(`${testDir}/nonexistent.json`),
        ).rejects.toThrow("File not found");
      });

    it("should throw error for invalid JSON", async () => {
      await expect(loadWorkflowFromFile(invalidJsonPath)).rejects.toThrow(
          "Invalid JSON",
        );
      });

    it("should throw error if workflow is not an object", async () => {
      const arrayPath = `${testDir}/array.json`;
      await fs.writeFile(arrayPath, JSON.stringify([]));

      await expect(loadWorkflowFromFile(arrayPath)).rejects.toThrow(
          "Workflow must be an object",
        );
      });

    it("should throw error if name is missing", async () => {
      await expect(loadWorkflowFromFile(missingFieldsPath)).rejects.toThrow(
          "Workflow name is required and must be a string",
        );
      });

    it("should throw error if nodes is not an array", async () => {
      const noNodesPath = `${testDir}/no-nodes.json`;
      await fs.writeFile(
        noNodesPath,
        JSON.stringify({
          name: "Test",
          nodes: "not an array",
          connections: {},
        }),
      );

      await expect(loadWorkflowFromFile(noNodesPath)).rejects.toThrow(
          "Workflow nodes must be an array",
        );
      });

    it("should throw error if connections is not an object", async () => {
      const noConnectionsPath = `${testDir}/no-connections.json`;
      await fs.writeFile(
        noConnectionsPath,
        JSON.stringify({
          name: "Test",
          nodes: [],
          connections: "not an object",
        }),
      );

      await expect(loadWorkflowFromFile(noConnectionsPath)).rejects.toThrow(
          "Workflow connections must be an object",
        );
      });

    it("should resolve relative paths to absolute paths", async () => {
      // Create a file with a known absolute path
      const workflow = await loadWorkflowFromFile(validWorkflowPath);

      expect(workflow.name).toBe("Test Workflow");
    });
  });
}
