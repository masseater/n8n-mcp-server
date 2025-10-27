/**
 * Tool loader utility for automatic tool discovery
 */

import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { ToolContext, AnyToolDefinition } from "../tools/base-tool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export type ToolFactory = (context: ToolContext) => AnyToolDefinition;

/**
 * Load all tools from the tools directory
 */
export async function loadTools(): Promise<Map<string, ToolFactory>> {
  const toolsDir = join(__dirname, "../tools");
  const files = readdirSync(toolsDir);
  const tools = new Map<string, ToolFactory>();

  for (const file of files) {
    // Skip non-tool files
    if (file.match(/^(base-tool|index|schemas|tool-types)\.ts$/)) continue;

    // Match tool files pattern: xxx-workflow.ts
    if (file.match(/^(create|get|update|delete|list)-.*\.ts$/)) {
      const moduleName = file.replace(".ts", "");

      try {
        const module = await import(`../tools/${moduleName}.js`);

        // Build factory function name: create + XxxWorkflow + Tool
        const parts = moduleName.split("-");
        const factoryName = `create${parts
          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
          .join("")}Tool`;

        if (typeof module[factoryName] === "function") {
          const toolName = moduleName.replace(/-/g, "_");
          tools.set(toolName, module[factoryName]);
          console.log(`✅ Loaded tool: ${toolName} from ${file}`);
        } else {
          console.warn(`⚠️ Factory function ${factoryName} not found in ${file}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load tool from ${file}:`, error);
      }
    }
  }

  console.log(`📦 Total tools loaded: ${tools.size}`);
  return tools;
}
