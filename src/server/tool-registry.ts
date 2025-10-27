/**
 * Tool registry for MCP server
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import {
  createListWorkflowsTool,
  createGetWorkflowTool,
  createCreateWorkflowTool,
  createUpdateWorkflowTool,
  createDeleteWorkflowTool,
} from "../tools/index.js";

export class ToolRegistry {
  private registeredTools: string[] = [];

  constructor(
    private server: McpServer,
    private n8nClient: N8nApiClientImpl,
    private responseBuilder: ToolResponseBuilder,
  ) {}

  /**
   * Get all tool definitions
   */
  getTools(context: any): any[] {
    return [
      createListWorkflowsTool(context),
      createGetWorkflowTool(context),
      createCreateWorkflowTool(context),
      createUpdateWorkflowTool(context),
      createDeleteWorkflowTool(context),
    ];
  }

  /**
   * Setup tool handlers and register them with the MCP server
   */
  setupToolHandlers(): void {
    // Create tool context
    const context = {
      n8nClient: this.n8nClient,
      responseBuilder: this.responseBuilder,
    };

    // Create all tools
    const tools = this.getTools(context);

    // Register all tools
    tools.forEach((tool) => {
      this.server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.inputSchema as Record<string, never>,
        },
        tool.handler as never,
      );
      this.registeredTools.push(tool.name);
    });
  }

  /**
   * Get list of registered tool names
   */
  getRegisteredTools(): string[] {
    return this.registeredTools;
  }
}
