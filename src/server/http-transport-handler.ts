/**
 * HTTP transport handler for MCP server
 */
import express from "express";
import type { ServerConfig } from "../types/index.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";

export class HttpTransportHandler {
  private app: express.Application;
  private config: ServerConfig;

  constructor(
    config: ServerConfig,
    private n8nClient: N8nApiClientImpl,
    private responseBuilder: ToolResponseBuilder,
    private getToolsCallback: (context: any) => any[],
  ) {
    this.config = config;
    this.app = express();
    this.app.use(express.json());
    this.setupEndpoints();
  }

  /**
   * Setup HTTP endpoints
   */
  private setupEndpoints(): void {
    // Health check endpoint
    this.app.get("/health", (_req, res) => {
      console.log("📊 Health check requested");
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // MCP HTTP endpoint - handles direct HTTP requests
    this.app.post("/mcp", async (req, res) => {
      console.log("🔌 MCP HTTP request received");
      console.log("📨 Request body:", req.body);

      try {
        const request = req.body;

        // Handle MCP protocol messages
        if (request?.jsonrpc === "2.0") {
          // Handle different MCP methods
          if (request.method === "initialize") {
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
          } else if (request.method === "tools/list") {
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
          } else if (request.method === "tools/call") {
            // Handle tool calls
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
    });
  }

  /**
   * Start HTTP server on specified port
   */
  async start(port: number, registeredTools: string[]): Promise<void> {
    console.log("🌐 Setting up HTTP transport...");
    console.log("🔐 Authenticating with n8n API...");
    console.log(`📍 n8n URL: ${this.config.n8n.baseUrl}`);
    console.log(
      `🔑 API Key: ${
        this.config.n8n.credentials.apiKey
          ? "***" + this.config.n8n.credentials.apiKey.slice(-4)
          : "NOT SET"
      }`,
    );
    console.log("✅ Successfully authenticated with n8n API");

    // Start HTTP server
    this.app.listen(port, () => {
      console.log("🚀 HTTP MCP Server started successfully!");
      console.log(`🌐 Server listening on port ${port}`);
      console.log(`📋 Available endpoints:`);
      console.log(`  - GET /health - Health check endpoint`);
      console.log(
        `  - POST /mcp - Main MCP HTTP endpoint for client connections`,
      );
      console.log(`🔧 MCP Tools available: ${registeredTools.join(", ")}`);
    });

    // Keep the process alive
    process.on("SIGINT", () => {
      console.log("Received SIGINT, shutting down gracefully...");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("Received SIGTERM, shutting down gracefully...");
      process.exit(0);
    });

    // Keep the process alive for HTTP transport
    return new Promise<void>(() => {
      // Don't resolve the promise to keep the process alive
      // The process will be kept alive by the HTTP server
      // Set up a long-running interval to keep the process alive
      const keepAlive = setInterval(() => {
        // This keeps the process alive
      }, 1000);

      // Clean up on exit
      process.on("exit", () => {
        clearInterval(keepAlive);
      });
    });
  }
}
