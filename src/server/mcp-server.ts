/**
 * MCP server implementation with stdio and http transport support
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import express from "express";
import { createLogger, format, transports } from "winston";
import type { MCPServer } from "../interfaces/mcp-server.js";
import type { ServerConfig, TransportConfig, WorkflowDefinition } from "../types/index.js";
import type {
  INode,
  IConnections,
  IWorkflowSettings,
} from "../types/n8n-types.js";
import { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import { ResponseOptimizerImpl } from "../optimizers/response-optimizer.js";

/**
 * MCP server implementation
 */
export class MCPServerImpl implements MCPServer {
  private server: McpServer;
  private n8nClient: N8nApiClientImpl;
  private optimizer: ResponseOptimizerImpl;
  private config: ServerConfig | null = null;
  private app: express.Application | null = null;

  constructor() {
    this.server = new McpServer({
      name: "n8n-mcp-server",
      version: "1.0.0",
    });

    this.n8nClient = new N8nApiClientImpl("", 30000, 3);
    this.optimizer = new ResponseOptimizerImpl();
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

    // Update optimizer settings
    this.optimizer = new ResponseOptimizerImpl(
      config.mcp.maxResponseSize,
      config.mcp.defaultPageSize,
    );

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
      this.app.get("/health", (req, res) => {
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
          if (request && request.jsonrpc === "2.0") {
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
                let result: any;

                // Call the appropriate tool based on the name
                switch (toolName) {
                  case "list_workflows":
                    const workflows = await this.n8nClient.getWorkflows(args);
                    result = this.optimizer.optimizeWorkflows(workflows);
                    break;

                  case "get_workflow":
                    const workflow = await this.n8nClient.getWorkflow(args.id);
                    result = this.optimizer.optimizeWorkflowDetail(workflow);
                    break;

                  case "create_workflow":
                    result = await this.n8nClient.createWorkflow(args);
                    break;

                  case "update_workflow":
                    result = await this.n8nClient.updateWorkflow(args.id, args);
                    break;

                  case "delete_workflow":
                    await this.n8nClient.deleteWorkflow(args.id);
                    result = {
                      success: true,
                      message: `Workflow ${args.id} deleted successfully.`,
                    };
                    break;

                  case "activate_workflow":
                    result = await this.n8nClient.setWorkflowActive(
                      args.id,
                      true,
                    );
                    break;

                  case "deactivate_workflow":
                    result = await this.n8nClient.setWorkflowActive(
                      args.id,
                      false,
                    );
                    break;

                  default:
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

                res.json({
                  jsonrpc: "2.0",
                  id: request.id,
                  result: {
                    content: [
                      {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                      },
                    ],
                  },
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
          `🔧 MCP Tools available: list_workflows, get_workflow, create_workflow, update_workflow, delete_workflow, activate_workflow, deactivate_workflow`,
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
      return new Promise<void>((resolve) => {
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
   * Setup tool handlers
   */
  private setupToolHandlers(): void {
    // Define lazy recursive types for node parameters to avoid any/unknown
    type NodeParameterValue = string | number | boolean | NodeParameterValue[] | { [key: string]: NodeParameterValue };

    const nodeParameterValueSchema: z.ZodType<NodeParameterValue> = z.lazy(() =>
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(nodeParameterValueSchema),
        z.record(z.string(), nodeParameterValueSchema),
      ])
    );

    // Define node schema based on n8n's INode interface
    const nodeSchema = z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      typeVersion: z.number(),
      position: z.tuple([z.number(), z.number()]),
      parameters: z.record(z.string(), nodeParameterValueSchema),
      credentials: z.record(z.string(), z.object({
        id: z.string(),
        name: z.string(),
      })).optional(),
      disabled: z.boolean().optional(),
    });

    // Define connections schema based on n8n's IConnections interface
    const connectionsSchema = z.record(
      z.string(),
      z.record(
        z.string(),
        z.array(z.array(z.object({
          node: z.string(),
          type: z.string(),
          index: z.number(),
        })))
      )
    );

    // Define settings schema based on n8n's IWorkflowSettings interface
    const settingsSchema = z.object({
      timezone: z.string().optional(),
      errorWorkflow: z.string().optional(),
      callerIds: z.string().optional(),
      callerPolicy: z.string().optional(),
      saveDataErrorExecution: z.string().optional(),
      saveDataSuccessExecution: z.string().optional(),
      saveManualExecutions: z.boolean().optional(),
      saveExecutionProgress: z.boolean().optional(),
      executionOrder: z.string().optional(),
    }).optional();

    // Define reusable schemas based on n8n's WorkflowEntity
    const createWorkflowSchema = z.object({
      name: z.string(),
      active: z.boolean(),
      nodes: z.array(nodeSchema),
      connections: connectionsSchema,
      settings: settingsSchema,
      tags: z.array(z.string()).optional(),
    });

    const updateWorkflowSchema = z.object({
      id: z.string(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      nodes: z.array(nodeSchema).optional(),
      connections: connectionsSchema.optional(),
      settings: settingsSchema,
      tags: z.array(z.string()).optional(),
    });

    // Register list_workflows tool
    this.server.registerTool(
      "list_workflows",
      {
        description: "List n8n workflows with optional filtering",
        inputSchema: {
          active: z.boolean().optional(),
          tags: z.array(z.string()).optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        },
      },
      async (args) => {
        // Filter out undefined values for exactOptionalPropertyTypes compatibility
        const filteredArgs = Object.fromEntries(
          Object.entries(args).filter(([_, v]) => v !== undefined)
        );
        const workflows = await this.n8nClient.getWorkflows(filteredArgs);
        const optimizedWorkflows = workflows.map((workflow) =>
          this.optimizer.optimizeWorkflowSummary(workflow)
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(optimizedWorkflows, null, 2),
            },
          ],
        };
      },
    );

    // Register get_workflow tool
    this.server.registerTool(
      "get_workflow",
      {
        description: "Get detailed information about a specific workflow",
        inputSchema: {
          id: z.string(),
        },
      },
      async (args) => {
        const workflow = await this.n8nClient.getWorkflow(args.id);
        const optimizedWorkflow = this.optimizer.optimizeWorkflowDetail(
          workflow,
        );
        const minimizedWorkflow = this.optimizer.minimizeContext(
          optimizedWorkflow,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(minimizedWorkflow, null, 2),
            },
          ],
        };
      },
    );

    // Register create_workflow tool
    this.server.registerTool(
      "create_workflow",
      {
        description: "Create a new workflow",
        inputSchema: {
          name: z.string(),
          active: z.boolean().optional(),
          nodes: z.array(nodeSchema),
          connections: connectionsSchema,
          settings: settingsSchema,
          tags: z.array(z.string()).optional(),
        },
      },
      async (args) => {
        const workflow = await this.n8nClient.createWorkflow(args as WorkflowDefinition);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(workflow, null, 2),
            },
          ],
        };
      },
    );

    // Register update_workflow tool
    this.server.registerTool(
      "update_workflow",
      {
        description: "Update an existing workflow by ID",
        inputSchema: {
          id: z.string(),
          name: z.string().optional(),
          active: z.boolean().optional(),
          nodes: z.array(nodeSchema).optional(),
          connections: connectionsSchema.optional(),
          settings: settingsSchema.optional(),
          tags: z.array(z.string()).optional(),
        },
      },
      async (args) => {
        const { id, ...workflowData } = args;
        const workflow = await this.n8nClient.updateWorkflow(
          id,
          workflowData as WorkflowDefinition,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(workflow, null, 2),
            },
          ],
        };
      },
    );

    // Register delete_workflow tool
    this.server.registerTool(
      "delete_workflow",
      {
        description: "Delete a workflow",
        inputSchema: {
          id: z.string(),
        },
      },
      async (args) => {
        await this.n8nClient.deleteWorkflow(args.id);
        return {
          content: [
            {
              type: "text",
              text: `Workflow ${args.id} deleted successfully`,
            },
          ],
        };
      },
    );

    // Register activate_workflow tool
    this.server.registerTool(
      "activate_workflow",
      {
        description: "Activate a workflow",
        inputSchema: {
          id: z.string(),
        },
      },
      async (args) => {
        await this.n8nClient.setWorkflowActive(args.id, true);
        return {
          content: [
            {
              type: "text",
              text: `Workflow ${args.id} activated successfully`,
            },
          ],
        };
      },
    );

    // Register deactivate_workflow tool
    this.server.registerTool(
      "deactivate_workflow",
      {
        description: "Deactivate a workflow",
        inputSchema: {
          id: z.string(),
        },
      },
      async (args) => {
        await this.n8nClient.setWorkflowActive(args.id, false);
        return {
          content: [
            {
              type: "text",
              text: `Workflow ${args.id} deactivated successfully`,
            },
          ],
        };
      },
    );
  }
}
