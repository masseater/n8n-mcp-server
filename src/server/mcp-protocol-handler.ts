/**
 * MCP Protocol message handler
 */
import type { Request, Response } from "express";
import type { ToolSchema } from "../tools/base-tool.js";
import type { Tool } from "./tool-registry.js";

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
    private getToolByNameCallback: (name: string) => Tool | undefined,
  ) {}

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

  private createSuccessResponse(id: string | number | undefined, result: unknown): JsonRpcResponse {
    return {
      jsonrpc: "2.0",
      id,
      result,
    };
  }

  private createErrorResponse(
    id: string | number | undefined,
    code: number,
    message: string,
    data?: unknown,
  ): JsonRpcResponse {
    return {
      jsonrpc: "2.0",
      id,
      error: { code, message, data },
    };
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    console.log("🔌 MCP HTTP request received");
    console.log("📨 Request body:", req.body);

    try {
      const requestBody = req.body as unknown;

      if (this.isJsonRpcRequest(requestBody)) {
        const request = requestBody;
        if (request.method === "initialize") {
          this.handleInitialize(request, res);
        } else if (request.method === "tools/list") {
          this.handleToolsList(request, res);
        } else if (request.method === "tools/call") {
          await this.handleToolsCall(request, res);
        } else {
          res.json(this.createErrorResponse(request.id, -32601, `Method not found: ${request.method}`));
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
      const errorData = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json(this.createErrorResponse(requestId, -32603, "Internal error", errorData));
    }
  }

  private handleInitialize(request: JsonRpcRequest, res: Response): void {
    res.json(this.createSuccessResponse(request.id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: "n8n-mcp-server",
        version: "1.0.0",
      },
    }));
  }

  private handleToolsList(request: JsonRpcRequest, res: Response): void {
    const toolSchemas = this.getToolSchemasCallback();
    res.json(this.createSuccessResponse(request.id, { tools: toolSchemas }));
  }

  private async handleToolsCall(request: JsonRpcRequest, res: Response): Promise<void> {
    const toolName = request.params?.name ?? "";
    const args = request.params?.arguments ?? {};

    console.log(`🔧 Tool call: ${toolName}`, args);

    try {
      const toolInstance = this.getToolByNameCallback(toolName);

      if (!toolInstance) {
        res.json(this.createErrorResponse(request.id, -32601, `Unknown tool: ${toolName}`));
        return;
      }

      // Union type requires cast; runtime validation by Zod
      const result = await toolInstance.handler(args as never);
      res.json(this.createSuccessResponse(request.id, result));
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.json(this.createErrorResponse(request.id, -32603, `Tool execution failed: ${errorMessage}`));
    }
  }
}
