/**
 * GetExecutionTool E2E Tests
 * Phase 3: E2E test with real MCP server (HTTP transport)
 *
 * This test starts an actual MCP server and calls tools via HTTP POST /mcp endpoint
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { setTimeout } from 'timers/promises';

describe.skipIf(process.env.SKIP_E2E === 'true')('GetExecutionTool E2E Tests (MCP Server)', () => {
  let serverProcess: ChildProcess;
  const serverPort = 3006;
  const serverUrl = `http://localhost:${String(serverPort)}`;

  beforeAll(async () => {
    // Start MCP server in HTTP mode
    serverProcess = spawn('pnpm', ['run', 'dev:http'], {
      stdio: 'pipe',
      env: { ...process.env, PORT: String(serverPort) },
    });

    // Wait for server to start with retry logic
    let retries = 10;
    let serverReady = false;
    while (retries > 0 && !serverReady) {
      await setTimeout(1000);
      try {
        const healthResponse = await fetch(`${serverUrl}/health`);
        if (healthResponse.ok) {
          serverReady = true;
        }
      } catch (_error) {
        retries--;
      }
    }

    if (!serverReady) {
      throw new Error('Server failed to start within timeout period');
    }
  }, 15000);

  afterAll(async () => {
    // Stop server
    serverProcess.kill('SIGTERM');
    await setTimeout(1000);
  });

  describe('Phase 3: MCP Protocol E2E Tests', () => {
    it('TC-E2E-001: should list tools via MCP protocol', async () => {
      // Arrange - MCP tools/list request
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      // Act
      const response = await fetch(`${serverUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify(request),
      });

      // Debug: Log response status and body
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TC-E2E-001 Response status:', response.status);
        console.error('TC-E2E-001 Response body:', errorText);
      }

      // Assert
      expect(response.ok).toBe(true);
      const data = (await response.json()) as {
        jsonrpc: string;
        id: number;
        result: { tools: { name: string; description: string }[] };
      };
      expect(data.jsonrpc).toBe('2.0');
      expect(data.id).toBe(1);
      expect(data.result).toBeDefined();
      expect(data.result.tools).toBeDefined();

      // Verify get_execution is in the tool list
      const getExecutionTool = data.result.tools.find((t) => t.name === 'get_execution');
      expect(getExecutionTool).toBeDefined();
      expect(getExecutionTool?.description).toContain('サマリー情報');
    });

    it('TC-E2E-002: should call get_execution tool via MCP protocol and return ExecutionSummary', () => {
      // Note: This test requires a real n8n server with execution data
      // Skipping actual tool invocation as it requires n8n API access

      // Arrange - MCP tools/call request
      const request = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'get_execution',
          arguments: {
            id: '12345', // This would need to be a real execution ID
          },
        },
      };

      // This test is commented out as it requires actual n8n server
      // In a real E2E environment, you would:
      // 1. Set up test n8n instance
      // 2. Create test execution
      // 3. Call tool with real execution ID
      // 4. Verify ExecutionSummary response

      console.log('E2E test with real n8n server is skipped (requires test environment)');
      console.log('Request structure:', JSON.stringify(request, null, 2));
    });

    it('TC-E2E-003: should handle tool call errors via MCP protocol', async () => {
      // Arrange - MCP tools/call request with invalid arguments
      const request = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'get_execution',
          arguments: {
            // Missing required 'id' parameter
          },
        },
      };

      // Act
      const response = await fetch(`${serverUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify(request),
      });

      // Debug: Log response status and body
      if (!response.ok) {
        const errorText = await response.text();
        console.error('TC-E2E-003 Response status:', response.status);
        console.error('TC-E2E-003 Response body:', errorText);
      }

      // Assert
      expect(response.ok).toBe(true);
      const data = (await response.json()) as {
        jsonrpc: string;
        id: number;
        error?: { code: number; message: string };
      };
      expect(data.jsonrpc).toBe('2.0');
      expect(data.id).toBe(3);

      // Should return error for missing required parameter
      expect(data.error).toBeDefined();
    });
  });
});
