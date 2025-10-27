/**
 * Tool registry for MCP server
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import type { ToolContext, ToolSchema } from "../tools/base-tool.js";
import { convertToJsonSchema } from "../tools/base-tool.js";
import { DeleteWorkflowTool } from "../tools/implementations/delete-workflow-tool.js";
import { ListWorkflowsTool } from "../tools/implementations/list-workflows-tool.js";
import { GetWorkflowTool } from "../tools/implementations/get-workflow-tool.js";
import { CreateWorkflowTool } from "../tools/implementations/create-workflow-tool.js";
import { UpdateWorkflowTool } from "../tools/implementations/update-workflow-tool.js";

export type Tool =
  | DeleteWorkflowTool
  | ListWorkflowsTool
  | GetWorkflowTool
  | CreateWorkflowTool
  | UpdateWorkflowTool;

export class ToolRegistry {
  private registeredTools: string[] = [];
  private toolInstances = new Map<string, Tool>();
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
    const tools: Tool[] = [
      new DeleteWorkflowTool(context),
      new ListWorkflowsTool(context),
      new GetWorkflowTool(context),
      new CreateWorkflowTool(context),
      new UpdateWorkflowTool(context),
    ];

    for (const tool of tools) {
      this.toolInstances.set(tool.name, tool);
    }

    console.log(`✅ ToolRegistry initialized with ${String(this.toolInstances.size)} tools`);
  }

  getToolSchemas(): ToolSchema[] {
    const startTime = performance.now();

    if (this.schemasCache) {
      const endTime = performance.now();
      console.debug(`📊 Tool schemas served from cache in ${(endTime - startTime).toFixed(2)}ms`);
      return this.schemasCache;
    }

    const schemas: ToolSchema[] = [];

    for (const tool of this.toolInstances.values()) {
      schemas.push({
        name: tool.name,
        description: tool.description,
        inputSchema: convertToJsonSchema(tool.getInputSchema()),
      });
    }

    this.schemasCache = schemas;

    const endTime = performance.now();
    console.debug(`📊 Tool schemas generated in ${(endTime - startTime).toFixed(2)}ms`);

    return schemas;
  }

  getToolByName(name: string): Tool | undefined {
    return this.toolInstances.get(name);
  }

  setupToolHandlers(): void {
    const schemas = this.getToolSchemas();

    for (const schema of schemas) {
      const toolInstance = this.toolInstances.get(schema.name);
      if (toolInstance) {
        this.server.registerTool(
          schema.name,
          {
            description: schema.description,
            // Use cached schema to avoid redundant conversion; cast required by MCP SDK
            inputSchema: schema.inputSchema as Record<string, never>,
          },
          // Union type requires cast; runtime validation by Zod
          toolInstance.handler.bind(toolInstance) as never,
        );
        this.registeredTools.push(schema.name);
      }
    }
  }

  getRegisteredTools(): string[] {
    return this.registeredTools;
  }

  clearCache(): void {
    this.schemasCache = null;
    console.debug("🧹 Tool cache cleared");
  }
}
