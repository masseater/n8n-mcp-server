/**
 * MCP server implementation with stdio and http transport support
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import type { ServerConfig, TransportConfig } from "../types/index.js";
import { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import {
  createListWorkflowsTool,
  createGetWorkflowTool,
  createCreateWorkflowTool,
  createUpdateWorkflowTool,
  createDeleteWorkflowTool,
} from "../tools/index.js";

/**
 * MCP server implementation
 */
export class MCPServerImpl {
  private server: McpServer;
  private n8nClient: N8nApiClientImpl;
  private responseBuilder: ToolResponseBuilder;
  private config: ServerConfig | null = null;
  private app: express.Application | null = null;
  private registeredTools: string[] = [];

  constructor() {
    this.server = new McpServer({
      name: "n8n-mcp-server",
      version: "1.0.0",
    });

    this.n8nClient = new N8nApiClientImpl("", 30000, 3);
    this.responseBuilder = new ToolResponseBuilder();
  }

  /**
   * Initialize the MCP server with configuration
   */
  async initialize(config: ServerConfig): Promise<void> {
    this.config = config;

    // Initialize n8n client
    this.n8nClient = new N8nApiClientImpl(
      config.n8n.baseUrl,
      config.n8n.timeout,
      config.n8n.retryAttempts,
    );

    // Authenticate with n8n
    try {
      const authSuccess = await this.n8nClient.authenticate(
        config.n8n.credentials,
      );
      if (!authSuccess) {
        throw new Error("Failed to authenticate with n8n API");
      }
    } catch (error) {
      throw new Error(`n8n API authentication failed: ${error}`);
    }

    // Response builder is already initialized in constructor
    // No need to reinitialize here

    // Setup tool handlers
    this.setupToolHandlers();
  }

  /**
   * Start the server with specified transport
   */
  async start(transport: TransportConfig): Promise<void> {
    if (!this.config) {
      throw new Error("Server not initialized. Call initialize() first.");
    }

    if (transport.type === "stdio") {
      const stdioTransport = new StdioServerTransport();
      await this.server.connect(stdioTransport);
      // Don't log to stdout for stdio transport as it interferes with MCP protocol
    } else if (transport.type === "http") {
      const port = transport.port || 3000;
      console.log("🌐 Setting up HTTP transport...");
      console.log("🔐 Authenticating with n8n API...");
      console.log(`📍 n8n URL: ${this.config?.n8n.baseUrl}`);
      console.log(
        `🔑 API Key: ${
          this.config?.n8n.credentials.apiKey
            ? "***" + this.config.n8n.credentials.apiKey.slice(-4)
            : "NOT SET"
        }`,
      );
      console.log("✅ Successfully authenticated with n8n API");

      this.app = express();
      this.app.use(express.json());

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
                const tools = this.getTools(toolContext);
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

      // Start HTTP server
      this.app.listen(port, () => {
        console.log("🚀 HTTP MCP Server started successfully!");
        console.log(`🌐 Server listening on port ${port}`);
        console.log(`📋 Available endpoints:`);
        console.log(`  - GET /health - Health check endpoint`);
        console.log(
          `  - POST /mcp - Main MCP HTTP endpoint for client connections`,
        );
        console.log(
          `🔧 MCP Tools available: ${this.registeredTools.join(', ')}`,
        );
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
    } else {
      throw new Error(`Unsupported transport type: ${transport.type}`);
    }
  }

  /**
   * Stop the server gracefully
   */
  async stop(): Promise<void> {
    // Server cleanup if needed
  }

  /**
   * Get server instance
   */
  getServer(): any {
    return this.server;
  }

  /**
   * Get all tool definitions
   */
  private getTools(context: any): any[] {
    return [
      createListWorkflowsTool(context),
      createGetWorkflowTool(context),
      createCreateWorkflowTool(context),
      createUpdateWorkflowTool(context),
      createDeleteWorkflowTool(context),
    ];
  }

  /**
   * Setup tool handlers
   */
  private setupToolHandlers(): void {
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
        tool.handler as never
      );
      this.registeredTools.push(tool.name);
    });
  }
}
