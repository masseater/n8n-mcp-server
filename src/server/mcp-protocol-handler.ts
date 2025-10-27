/**
 * MCP Protocol message handler
 */
import type { Request, Response } from "express";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";

export class McpProtocolHandler {
  constructor(
    private n8nClient: N8nApiClientImpl,
    private responseBuilder: ToolResponseBuilder,
    private getToolsCallback: (context: any) => any[],
  ) {}

  /**
   * Handle MCP HTTP request
   */
  async handleRequest(req: Request, res: Response): Promise<void> {
    console.log("🔌 MCP HTTP request received");
    console.log("📨 Request body:", req.body);

    try {
      const request = req.body;

      // Handle MCP protocol messages
      if (request?.jsonrpc === "2.0") {
        // Handle different MCP methods
        if (request.method === "initialize") {
          this.handleInitialize(req, res);
        } else if (request.method === "tools/list") {
          this.handleToolsList(req, res);
        } else if (request.method === "tools/call") {
          await this.handleToolsCall(req, res);
        } else {
          // Method not found
          res.json({
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`,
            },
          });
        }
      } else {
        res.status(400).json({
          error: "Invalid MCP request",
          message: "Request must be a valid JSON-RPC 2.0 message",
        });
      }
    } catch (error) {
      console.error("❌ MCP request processing failed:", error);
      res.status(500).json({
        jsonrpc: "2.0",
        id: req.body?.id,
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  /**
   * Handle initialize method
   */
  private handleInitialize(req: Request, res: Response): void {
    const request = req.body;
    res.json({
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: "n8n-mcp-server",
          version: "1.0.0",
        },
      },
    });
  }

  /**
   * Handle tools/list method
   */
  private handleToolsList(req: Request, res: Response): void {
    const request = req.body;
    res.json({
      jsonrpc: "2.0",
      id: request.id,
      result: {
        tools: [
          {
            name: "list_workflows",
            description: "List all workflows in n8n",
            inputSchema: {
              type: "object",
              properties: {
                limit: { type: "number" },
                active: { type: "boolean" },
              },
            },
          },
          {
            name: "get_workflow",
            description: "Get details of a specific workflow by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
              required: ["id"],
            },
          },
          {
            name: "create_workflow",
            description: "Create a new workflow",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string" },
                nodes: { type: "array" },
                connections: { type: "object" },
                active: { type: "boolean" },
                settings: { type: "object" },
                tags: { type: "array" },
              },
              required: ["name", "nodes"],
            },
          },
          {
            name: "update_workflow",
            description: "Update an existing workflow by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                nodes: { type: "array" },
                connections: { type: "object" },
                active: { type: "boolean" },
                settings: { type: "object" },
                tags: { type: "array" },
              },
              required: ["id"],
            },
          },
          {
            name: "delete_workflow",
            description: "Delete a workflow by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
              required: ["id"],
            },
          },
          {
            name: "activate_workflow",
            description: "Activate a workflow by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
              required: ["id"],
            },
          },
          {
            name: "deactivate_workflow",
            description: "Deactivate a workflow by ID",
            inputSchema: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
              required: ["id"],
            },
          },
        ],
      },
    });
  }

  /**
   * Handle tools/call method
   */
  private async handleToolsCall(req: Request, res: Response): Promise<void> {
    const request = req.body;
    const toolName = request.params?.name;
    const args = request.params?.arguments || {};

    console.log(`🔧 Tool call: ${toolName}`, args);

    try {
      // Find the registered tool
      const toolContext = {
        n8nClient: this.n8nClient,
        responseBuilder: this.responseBuilder,
      };

      // Get the tool definition
      let tool;
      const tools = this.getToolsCallback(toolContext);
      for (const t of tools) {
        if (t.name === toolName) {
          tool = t;
          break;
        }
      }

      if (!tool) {
        res.json({
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown tool: ${toolName}`,
          },
        });
        return;
      }

      // Execute the tool handler
      const result = await tool.handler(args);

      res.json({
        jsonrpc: "2.0",
        id: request.id,
        result,
      });
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      res.json({
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32603,
          message: `Tool execution failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      });
    }
  }
}
