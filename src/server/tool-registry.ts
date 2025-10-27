/**
 * Tool registry for MCP server
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import type { ToolContext, ToolSchema, AnyToolDefinition } from "../tools/base-tool.js";
import { DeleteWorkflowTool } from "../tools/implementations/delete-workflow-tool.js";
import { ListWorkflowsTool } from "../tools/implementations/list-workflows-tool.js";
import { GetWorkflowTool } from "../tools/implementations/get-workflow-tool.js";
import { CreateWorkflowTool } from "../tools/implementations/create-workflow-tool.js";
import { UpdateWorkflowTool } from "../tools/implementations/update-workflow-tool.js";

export class ToolRegistry {
  private registeredTools: string[] = [];
  private toolDefinitions = new Map<string, AnyToolDefinition>();
  private toolInstances: (
    | DeleteWorkflowTool
    | ListWorkflowsTool
    | GetWorkflowTool
    | CreateWorkflowTool
    | UpdateWorkflowTool
  )[] = [];
  private schemasCache: ToolSchema[] | null = null;

  constructor(
    private server: McpServer,
    private n8nClient: N8nApiClientImpl,
    private responseBuilder: ToolResponseBuilder,
  ) {}

  /**
   * Initialize tool registry by creating tool instances
   */
  initialize(): void {
    const context: ToolContext = {
      n8nClient: this.n8nClient,
      responseBuilder: this.responseBuilder,
    };

    // Manual tool registration for safety and explicit review
    this.toolInstances = [
      new DeleteWorkflowTool(context),
      new ListWorkflowsTool(context),
      new GetWorkflowTool(context),
      new CreateWorkflowTool(context),
      new UpdateWorkflowTool(context),
    ];

    console.log(`✅ ToolRegistry initialized with ${String(this.toolInstances.length)} tools`);
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

    const schemas: ToolSchema[] = [];

    // Convert tool instances to definitions and extract schemas
    for (const toolInstance of this.toolInstances) {
      const tool = toolInstance.toDefinition();
      this.toolDefinitions.set(tool.name, tool);
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
