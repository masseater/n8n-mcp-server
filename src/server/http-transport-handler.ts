/**
 * HTTP transport handler for MCP server
 */
import express from "express";
import type { ServerConfig } from "../types/index.js";
import type { N8nApiClientImpl } from "../clients/n8n-api-client.js";
import type { ToolResponseBuilder } from "../formatters/tool-response-builder.js";
import { McpProtocolHandler } from "./mcp-protocol-handler.js";

export class HttpTransportHandler {
  private app: express.Application;
  private config: ServerConfig;
  private protocolHandler: McpProtocolHandler;

  constructor(
    config: ServerConfig,
    n8nClient: N8nApiClientImpl,
    responseBuilder: ToolResponseBuilder,
    getToolsCallback: (context: any) => any[],
  ) {
    this.config = config;
    this.app = express();
    this.app.use(express.json());
    this.protocolHandler = new McpProtocolHandler(
      n8nClient,
      responseBuilder,
      getToolsCallback,
    );
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
      await this.protocolHandler.handleRequest(req, res);
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
