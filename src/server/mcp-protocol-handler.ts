/**
 * MCP Protocol message handler
 */
import type { Request, Response } from "express";
import type { ToolSchema, AnyToolDefinition } from "../tools/base-tool.js";

export class McpProtocolHandler {
  constructor(
    private getToolSchemasCallback: () => ToolSchema[],
    private getToolByNameCallback: (name: string) => AnyToolDefinition | undefined,
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

    // Get tool schemas from ToolRegistry
    const toolSchemas = this.getToolSchemasCallback();

    res.json({
      jsonrpc: "2.0",
      id: request.id,
      result: {
        tools: toolSchemas,
      },
    });
  }

  /**
   * Handle tools/call method
   */
  private async handleToolsCall(req: Request, res: Response): Promise<void> {
    const request = req.body;
    const toolName = request.params?.name;
    const args = request.params?.arguments ?? {};

    console.log(`🔧 Tool call: ${toolName}`, args);

    try {
      // Get the tool definition by name
      const tool = this.getToolByNameCallback(toolName);

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
