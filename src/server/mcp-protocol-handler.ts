/**
 * MCP Protocol message handler
 */
import type { Request, Response } from "express";
import type { ToolSchema, AnyToolDefinition } from "../tools/base-tool.js";

/**
 * JSON-RPC 2.0 request structure
 */
type JsonRpcRequest = {
  jsonrpc: "2.0";
  id: string | number | undefined;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
    [key: string]: unknown;
  };
};

/**
 * JSON-RPC 2.0 response structure
 */
type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: string | number | undefined;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

export class McpProtocolHandler {
  constructor(
    private getToolSchemasCallback: () => ToolSchema[],
    private getToolByNameCallback: (name: string) => AnyToolDefinition | undefined,
  ) {}

  /**
   * Type guard to check if the request is a valid JsonRpcRequest
   */
  private isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    const req = value as Record<string, unknown>;
    return (
      req.jsonrpc === "2.0" &&
      typeof req.method === "string"
    );
  }

  /**
   * Handle MCP HTTP request
   */
  async handleRequest(req: Request, res: Response): Promise<void> {
    console.log("🔌 MCP HTTP request received");
    console.log("📨 Request body:", req.body);

    try {
      const requestBody = req.body as unknown;

      // Handle MCP protocol messages
      if (this.isJsonRpcRequest(requestBody)) {
        const request = requestBody;
        // Handle different MCP methods
        if (request.method === "initialize") {
          this.handleInitialize(request, res);
        } else if (request.method === "tools/list") {
          this.handleToolsList(request, res);
        } else if (request.method === "tools/call") {
          await this.handleToolsCall(request, res);
        } else {
          // Method not found
          const response: JsonRpcResponse = {
            jsonrpc: "2.0",
            id: request.id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`,
            },
          };
          res.json(response);
        }
      } else {
        res.status(400).json({
          error: "Invalid MCP request",
          message: "Request must be a valid JSON-RPC 2.0 message",
        });
      }
    } catch (error) {
      console.error("❌ MCP request processing failed:", error);
      const requestBody = req.body as Record<string, unknown> | undefined;
      const requestId = requestBody?.id as string | number | undefined;
      const response: JsonRpcResponse = {
        jsonrpc: "2.0",
        id: requestId,
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : "Unknown error",
        },
      };
      res.status(500).json(response);
    }
  }

  /**
   * Handle initialize method
   */
  private handleInitialize(request: JsonRpcRequest, res: Response): void {
    const response: JsonRpcResponse = {
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
    };
    res.json(response);
  }

  /**
   * Handle tools/list method
   */
  private handleToolsList(request: JsonRpcRequest, res: Response): void {
    // Get tool schemas from ToolRegistry
    const toolSchemas = this.getToolSchemasCallback();

    const response: JsonRpcResponse = {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        tools: toolSchemas,
      },
    };
    res.json(response);
  }

  /**
   * Handle tools/call method
   */
  private async handleToolsCall(request: JsonRpcRequest, res: Response): Promise<void> {
    const toolName = request.params?.name ?? "";
    const args = request.params?.arguments ?? {};

    console.log(`🔧 Tool call: ${toolName}`, args);

    try {
      // Get the tool definition by name
      const tool = this.getToolByNameCallback(toolName);

      if (!tool) {
        const errorResponse: JsonRpcResponse = {
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown tool: ${toolName}`,
          },
        };
        res.json(errorResponse);
        return;
      }

      // Execute the tool handler
      // Type assertion is necessary because AnyToolDefinition is a union type
      // and TypeScript infers the parameter as an intersection of all types.
      // Runtime validation is handled by each tool's input schema.
      const result = await (tool.handler as (args: Record<string, unknown>) => Promise<{
        content: { type: string; text: string }[];
      }>)(args);

      const successResponse: JsonRpcResponse = {
        jsonrpc: "2.0",
        id: request.id,
        result,
      };
      res.json(successResponse);
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      const errorResponse: JsonRpcResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32603,
          message: `Tool execution failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      };
      res.json(errorResponse);
    }
  }
}
