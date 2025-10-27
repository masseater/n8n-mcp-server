/**
 * MCP server implementation with stdio and http transport support
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { ServerConfig, TransportConfig } from "../types/index.js";
import { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import { HttpTransportHandler } from "./http-transport-handler.js";
import { ToolRegistry } from "./tool-registry.js";

/**
 * MCP server implementation
 */
export class MCPServerImpl {
  private server: McpServer;
  private n8nClient: N8nApiClientImpl;
  private responseBuilder: ToolResponseBuilder;
  private config: ServerConfig | null = null;
  private httpHandler: HttpTransportHandler | null = null;
  private toolRegistry: ToolRegistry | null = null;

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

    // Setup tool registry and handlers
    this.toolRegistry = new ToolRegistry(
      this.server,
      this.n8nClient,
      this.responseBuilder,
    );
    this.toolRegistry.setupToolHandlers();
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

      if (!this.toolRegistry) {
        throw new Error("Tool registry not initialized");
      }

      const toolRegistry = this.toolRegistry;

      // Create HTTP transport handler
      this.httpHandler = new HttpTransportHandler(
        this.config,
        () => toolRegistry.getToolSchemas(),
        (name) => toolRegistry.getToolByName(name),
      );

      // Start HTTP server
      await this.httpHandler.start(port, toolRegistry.getRegisteredTools());
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
  getServer(): McpServer {
    return this.server;
  }
}
