/**
 * ToolRegistry Unit Tests
 * Phase 3 Task 1: Verify GetExecutionTool is registered correctly
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToolRegistry } from '../tool-registry.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { N8nApiClientImpl } from '../../clients/n8n-api-client.js';
import type { ToolResponseBuilder } from '../../formatters/tool-response-builder.js';

describe('ToolRegistry', () => {
  let mockServer: McpServer;
  let mockN8nClient: N8nApiClientImpl;
  let mockResponseBuilder: ToolResponseBuilder;
  let toolRegistry: ToolRegistry;

  beforeEach(() => {
    // Mock MCP server
    mockServer = {
      registerTool: vi.fn(),
    } as unknown as McpServer;

    // Mock N8nApiClient
    mockN8nClient = {} as N8nApiClientImpl;

    // Mock ToolResponseBuilder
    mockResponseBuilder = {} as ToolResponseBuilder;

    toolRegistry = new ToolRegistry(mockServer, mockN8nClient, mockResponseBuilder);
  });

  describe('Phase 3 Task 1: GetExecutionTool registration', () => {
    it('TC-REGISTRY-001: should initialize with GetExecutionTool in tool instances', () => {
      // Act
      toolRegistry.initialize();

      // Assert - GetExecutionTool should be in the tool instances
      const getExecutionTool = toolRegistry.getToolByName('get_execution');
      expect(getExecutionTool).toBeDefined();
      expect(getExecutionTool?.name).toBe('get_execution');
    });

    it('TC-REGISTRY-002: should register GetExecutionTool with MCP server when setupToolHandlers is called', () => {
      // Arrange
      toolRegistry.initialize();

      // Act
      toolRegistry.setupToolHandlers();

      // Assert - registerTool should be called for get_execution
      expect(mockServer.registerTool).toHaveBeenCalled();

      // Verify get_execution is in registered tools
      const registeredTools = toolRegistry.getRegisteredTools();
      expect(registeredTools).toContain('get_execution');
    });

    it('TC-REGISTRY-003: should initialize with 10 tools including get_execution', () => {
      // Act
      toolRegistry.initialize();

      // Assert - Should have exactly 10 tools
      const getExecutionTool = toolRegistry.getToolByName('get_execution');
      const listExecutionsTool = toolRegistry.getToolByName('list_executions');
      const deleteWorkflowTool = toolRegistry.getToolByName('delete_workflow');
      const listWorkflowsTool = toolRegistry.getToolByName('list_workflows');
      const getWorkflowTool = toolRegistry.getToolByName('get_workflow');
      const getWorkflowConnectionsTool = toolRegistry.getToolByName('get_workflow_connections');
      const createWorkflowTool = toolRegistry.getToolByName('create_workflow');
      const createWorkflowFromFileTool = toolRegistry.getToolByName('create_workflow_from_file');
      const updateWorkflowTool = toolRegistry.getToolByName('update_workflow');
      const replaceWorkflowFromFileTool = toolRegistry.getToolByName('replace_workflow_from_file');

      expect(getExecutionTool).toBeDefined();
      expect(listExecutionsTool).toBeDefined();
      expect(deleteWorkflowTool).toBeDefined();
      expect(listWorkflowsTool).toBeDefined();
      expect(getWorkflowTool).toBeDefined();
      expect(getWorkflowConnectionsTool).toBeDefined();
      expect(createWorkflowTool).toBeDefined();
      expect(createWorkflowFromFileTool).toBeDefined();
      expect(updateWorkflowTool).toBeDefined();
      expect(replaceWorkflowFromFileTool).toBeDefined();
    });

    it('TC-REGISTRY-004: GetExecutionTool should have correct description', () => {
      // Act
      toolRegistry.initialize();

      // Assert
      const getExecutionTool = toolRegistry.getToolByName('get_execution');
      expect(getExecutionTool?.description).toContain('サマリー情報');
      expect(getExecutionTool?.description).toContain('get_execution_by_node');
    });
  });
});
