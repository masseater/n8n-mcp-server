/**
 * Tool registry for MCP server
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import type { ToolContext } from "../tools/base-tool.js";
import { DeleteWorkflowTool } from "../tools/implementations/delete-workflow-tool.js";
import { ListWorkflowsTool } from "../tools/implementations/list-workflows-tool.js";
import { GetWorkflowTool } from "../tools/implementations/get-workflow-tool.js";
import { GetWorkflowConnectionsTool } from "../tools/implementations/get-workflow-connections-tool.js";
import { CreateWorkflowTool } from "../tools/implementations/create-workflow-tool.js";
import { CreateWorkflowFromFileTool } from "../tools/implementations/create-workflow-from-file-tool.js";
import { UpdateWorkflowTool } from "../tools/implementations/update-workflow-tool.js";
import { ReplaceWorkflowFromFileTool } from "../tools/implementations/replace-workflow-from-file-tool.js";

type Tool =
  | DeleteWorkflowTool
  | ListWorkflowsTool
  | GetWorkflowTool
  | GetWorkflowConnectionsTool
  | CreateWorkflowTool
  | CreateWorkflowFromFileTool
  | UpdateWorkflowTool
  | ReplaceWorkflowFromFileTool;

export class ToolRegistry {
  private registeredTools: string[] = [];
  private toolInstances = new Map<string, Tool>();

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
      new GetWorkflowConnectionsTool(context),
      new CreateWorkflowTool(context),
      new CreateWorkflowFromFileTool(context),
      new UpdateWorkflowTool(context),
      new ReplaceWorkflowFromFileTool(context),
    ];

    for (const tool of tools) {
      this.toolInstances.set(tool.name, tool);
    }

    console.log(`✅ ToolRegistry initialized with ${String(this.toolInstances.size)} tools`);
  }

  getToolByName(name: string): Tool | undefined {
    return this.toolInstances.get(name);
  }

  setupToolHandlers(): void {
    for (const tool of this.toolInstances.values()) {
      // Pass Zod schema directly to MCP SDK
      // SDK handles JSON Schema conversion internally for both stdio and HTTP transports
      this.server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.getInputSchema().shape,
        },
        tool.handler.bind(tool) as never,
      );
      this.registeredTools.push(tool.name);
    }
  }

  getRegisteredTools(): string[] {
    return this.registeredTools;
  }
}
