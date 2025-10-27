/**
 * Tool registry for MCP server
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import type { ToolContext, ToolSchema, AnyToolDefinition } from "../tools/base-tool.js";
import { loadTools, type ToolFactory } from "./tool-loader.js";

export class ToolRegistry {
  private registeredTools: string[] = [];
  private toolDefinitions: Map<string, AnyToolDefinition> = new Map();
  private toolFactories: Map<string, ToolFactory> = new Map();
  private schemasCache: ToolSchema[] | null = null;

  constructor(
    private server: McpServer,
    private n8nClient: N8nApiClientImpl,
    private responseBuilder: ToolResponseBuilder,
  ) {}

  /**
   * Initialize tool registry by loading tools
   */
  async initialize(): Promise<void> {
    this.toolFactories = await loadTools();
    console.log(`✅ ToolRegistry initialized with ${this.toolFactories.size} tools`);
  }

  /**
   * Get all tool schemas (without handlers)
   */
  getToolSchemas(): ToolSchema[] {
    const startTime = performance.now();

    // Return cached schemas if available
    if (this.schemasCache) {
      const endTime = performance.now();
      console.debug(`📊 Tool schemas served from cache in ${(endTime - startTime).toFixed(2)}ms`);
      return this.schemasCache;
    }

    const context: ToolContext = {
      n8nClient: this.n8nClient,
      responseBuilder: this.responseBuilder,
    };

    const schemas: ToolSchema[] = [];

    // Create tools from factories and extract schemas
    for (const [name, factory] of this.toolFactories) {
      const tool = factory(context);
      this.toolDefinitions.set(name, tool);
      schemas.push({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      });
    }

    // Cache the schemas
    this.schemasCache = schemas;

    const endTime = performance.now();
    console.debug(`📊 Tool schemas generated in ${(endTime - startTime).toFixed(2)}ms`);

    return schemas;
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

  /**
   * Clear cached schemas and tool definitions
   */
  clearCache(): void {
    this.schemasCache = null;
    this.toolDefinitions.clear();
    console.debug("🧹 Tool cache cleared");
  }
}
