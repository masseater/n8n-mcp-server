/**
 * Tool registry for MCP server
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import type { ToolContext, ToolSchema, AnyToolDefinition } from "../tools/base-tool.js";
import {
  createListWorkflowsTool,
  createGetWorkflowTool,
  createCreateWorkflowTool,
  createUpdateWorkflowTool,
  createDeleteWorkflowTool,
} from "../tools/index.js";

export class ToolRegistry {
  private registeredTools: string[] = [];
  private toolDefinitions: Map<string, AnyToolDefinition> = new Map();

  constructor(
    private server: McpServer,
    private n8nClient: N8nApiClientImpl,
    private responseBuilder: ToolResponseBuilder,
  ) {}

  /**
   * Get all tool schemas (without handlers)
   */
  getToolSchemas(): ToolSchema[] {
    const context: ToolContext = {
      n8nClient: this.n8nClient,
      responseBuilder: this.responseBuilder,
    };

    const tools = [
      createListWorkflowsTool(context),
      createGetWorkflowTool(context),
      createCreateWorkflowTool(context),
      createUpdateWorkflowTool(context),
      createDeleteWorkflowTool(context),
    ];

    // Store tool definitions for later use
    tools.forEach((tool) => {
      this.toolDefinitions.set(tool.name, tool);
    });

    // Return only schemas (without handlers)
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }

  /**
   * Get tool definition by name
   */
  getToolByName(name: string): AnyToolDefinition | undefined {
    return this.toolDefinitions.get(name);
  }

  /**
   * Setup tool handlers and register them with the MCP server
   */
  setupToolHandlers(): void {
    // Get all tool schemas (this also initializes toolDefinitions)
    const schemas = this.getToolSchemas();

    // Register all tools with the MCP server
    schemas.forEach((schema) => {
      const tool = this.toolDefinitions.get(schema.name);
      if (tool) {
        this.server.registerTool(
          tool.name,
          {
            description: tool.description,
            inputSchema: tool.inputSchema as Record<string, never>,
          },
          tool.handler as never,
        );
        this.registeredTools.push(tool.name);
      }
    });
  }

  /**
   * Get list of registered tool names
   */
  getRegisteredTools(): string[] {
    return this.registeredTools;
  }
}
