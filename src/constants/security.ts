/**
 * Security-related constants for the n8n MCP server
 */

/**
 * List of sensitive keys that should be filtered out from error contexts
 * and other data structures to prevent information leakage
 */
export const SENSITIVE_KEYS = new Set([
  'apiKey',
  'password',
  'token',
  'secret',
  'auth',
  'authorization',
  'credentials',
]);
