/**
 * HTTP Authentication feature tests for MCP Server
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type express from 'express';
import { MCPServerImpl } from '../mcp-server.js';

// Mock the n8n API client to avoid actual network calls
vi.mock('../../clients/n8n-api-client.js', () => {
  class MockN8nApiClientImpl {
    authenticate() {
      return true;
    }
    testConnection() {
      return true;
    }
  }

  return {
    N8nApiClientImpl: MockN8nApiClientImpl,
  };
});

// Mock StreamableHTTPServerTransport
vi.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => {
  class MockStreamableHTTPServerTransport {
    start = vi.fn();
    close = vi.fn();
    handleRequest = vi.fn();
  }

  return {
    StreamableHTTPServerTransport: MockStreamableHTTPServerTransport,
  };
});

// Mock generated client
vi.mock('../../generated/client.gen.js', () => {
  return {
    client: {
      setConfig: vi.fn(),
    },
  };
});

describe('MCPServerImpl - HTTP Authentication', () => {
  let server: MCPServerImpl;

  beforeEach(() => {
    server = new MCPServerImpl();
  });

  describe('POST /mcp handler (existing)', () => {
    it('should be defined and ready for refactoring', () => {
      // This test verifies that the server instance is created successfully
      // Before refactoring, we just ensure the server can be instantiated
      expect(server).toBeDefined();
      expect(server.getServer()).toBeDefined();
    });
  });

  describe('extractApiKeyFromHeader', () => {
    it('should return API key when header exists as string', () => {
      const headers = { 'x-n8n-api-key': 'test-api-key-123' };
      // @ts-expect-error - Testing private method
      const result = server.extractApiKeyFromHeader(headers);
      expect(result).toBe('test-api-key-123');
    });

    it('should return first value when header is an array', () => {
      const headers = { 'x-n8n-api-key': ['key1', 'key2'] };
      // @ts-expect-error - Testing private method
      const result = server.extractApiKeyFromHeader(headers);
      expect(result).toBe('key1');
    });

    it('should throw error when header does not exist', () => {
      const headers = {};
      // @ts-expect-error - Testing private method
      expect(() => server.extractApiKeyFromHeader(headers)).toThrow('X-N8N-API-KEY header is required');
    });

    it('should throw error when header is empty string', () => {
      const headers = { 'x-n8n-api-key': '' };
      // @ts-expect-error - Testing private method
      expect(() => server.extractApiKeyFromHeader(headers)).toThrow('X-N8N-API-KEY cannot be empty');
    });
  });

  describe('handleMcpRequest with authentication', () => {
    it('should extract API key and create request-scoped clients', async () => {
      const mockReq = {
        headers: { 'x-n8n-api-key': 'test-key-123' },
        body: {},
      } as unknown as express.Request;

      const mockRes = {
        on: vi.fn(),
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as express.Response;

      // Initialize server with mock config first
      await server.initialize({
        n8n: {
          baseUrl: 'http://localhost:5678/api/v1',
          credentials: {
            apiKey: 'initial-key',
            baseUrl: 'http://localhost:5678/api/v1',
          },
          timeout: 30000,
          retryAttempts: 3,
        },
        mcp: {
          maxResponseSize: 100000,
          defaultPageSize: 20,
          verboseMode: false,
        },
        logging: {
          level: 'info',
          enableApiStats: false,
          enableDebugConsole: false,
        },
      });

      // @ts-expect-error - Testing private method
      await server.handleMcpRequest(mockReq, mockRes);

      // Verify that no error was returned
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 when API key header is missing', async () => {
      const mockReq = {
        headers: {},
        body: {},
      } as express.Request;

      const mockRes = {
        on: vi.fn(),
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as express.Response;

      await server.initialize({
        n8n: {
          baseUrl: 'http://localhost:5678/api/v1',
          credentials: {
            apiKey: 'initial-key',
            baseUrl: 'http://localhost:5678/api/v1',
          },
          timeout: 30000,
          retryAttempts: 3,
        },
        mcp: {
          maxResponseSize: 100000,
          defaultPageSize: 20,
          verboseMode: false,
        },
        logging: {
          level: 'info',
          enableApiStats: false,
          enableDebugConsole: false,
        },
      });

      // @ts-expect-error - Testing private method
      await server.handleMcpRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'X-N8N-API-KEY header is required' });
    });
  });
});
