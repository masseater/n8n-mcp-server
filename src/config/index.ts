/**
 * Configuration management utilities
 */

import type { AuthCredentials, ServerConfig } from "../types/index.js";

/**
 * Default server configuration
 */
const DEFAULT_CONFIG: ServerConfig = {
  n8n: {
    baseUrl: process.env.N8N_URL ?? "http://localhost:5678",
    credentials: {
      baseUrl: process.env.N8N_URL ?? "http://localhost:5678",
      apiKey: process.env.N8N_API_KEY ?? "",
    },
    timeout: 30000,
    retryAttempts: 3,
  },
  mcp: {
    maxResponseSize: 100000,
    defaultPageSize: 50,
    verboseMode: false,
  },
  logging: {
    level: process.env.LOG_LEVEL ?? "info",
    enableApiStats: false,
  },
};

/**
 * Validate authentication credentials
 */
function validateCredentials(credentials: AuthCredentials): boolean {
  if (!credentials.baseUrl) {
    return false;
  }

  // Must have API key
  return Boolean(credentials.apiKey);
}

/**
 * Validate server configuration
 */
export function validateConfig(config: ServerConfig): boolean {
  try {
    // Validate n8n configuration
    if (!config.n8n.baseUrl) {
      throw new Error("n8n baseUrl is required");
    }

    if (!validateCredentials(config.n8n.credentials)) {
      throw new Error("Valid n8n API key is required");
    }

    if (config.n8n.timeout <= 0) {
      throw new Error("n8n timeout must be positive");
    }

    if (config.n8n.retryAttempts < 0) {
      throw new Error("n8n retryAttempts must be non-negative");
    }

    // Validate MCP configuration
    if (config.mcp.maxResponseSize <= 0) {
      throw new Error("MCP maxResponseSize must be positive");
    }

    if (config.mcp.defaultPageSize <= 0) {
      throw new Error("MCP defaultPageSize must be positive");
    }

    // Validate logging configuration
    const validLogLevels = ["error", "warn", "info", "debug"];
    if (!validLogLevels.includes(config.logging.level)) {
      throw new Error(`Invalid log level: ${config.logging.level}`);
    }

    return true;
  } catch (error) {
    console.error("Configuration validation failed:", error);
    return false;
  }
}

/**
 * Load configuration from environment variables and defaults
 */
export function loadConfig(): ServerConfig {
  return DEFAULT_CONFIG;
}
