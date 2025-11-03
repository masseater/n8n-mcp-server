/**
 * ToolRegistry Unit Tests
 * Phase 3 Task 1: Verify GetExecutionTool is registered correctly
 * Phase 6 Task 1: Verify GetExecutionByNodeTool is registered correctly
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

    it('TC-REGISTRY-003: should initialize with 11 tools including get_execution', () => {
      // Act
      toolRegistry.initialize();

      // Assert - Should have exactly 11 tools
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
      const getExecutionByNodeTool = toolRegistry.getToolByName('get_execution_by_node');

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
      expect(getExecutionByNodeTool).toBeDefined();
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

  describe('Phase 6 Task 1: GetExecutionByNodeTool registration', () => {
    it('TC-REGISTRY-005: should initialize with GetExecutionByNodeTool in tool instances', () => {
      // Act
      toolRegistry.initialize();

      // Assert - GetExecutionByNodeTool should be in the tool instances
      const getExecutionByNodeTool = toolRegistry.getToolByName('get_execution_by_node');
      expect(getExecutionByNodeTool).toBeDefined();
      expect(getExecutionByNodeTool?.name).toBe('get_execution_by_node');
    });

    it('TC-REGISTRY-006: should register GetExecutionByNodeTool with MCP server when setupToolHandlers is called', () => {
      // Arrange
      toolRegistry.initialize();

      // Act
      toolRegistry.setupToolHandlers();

      // Assert - registerTool should be called for get_execution_by_node
      expect(mockServer.registerTool).toHaveBeenCalled();

      // Verify get_execution_by_node is in registered tools
      const registeredTools = toolRegistry.getRegisteredTools();
      expect(registeredTools).toContain('get_execution_by_node');
    });

    it('TC-REGISTRY-007: GetExecutionByNodeTool should have correct description', () => {
      // Act
      toolRegistry.initialize();

      // Assert
      const getExecutionByNodeTool = toolRegistry.getToolByName('get_execution_by_node');
      expect(getExecutionByNodeTool?.description).toContain('ノードの実行詳細データ');
      expect(getExecutionByNodeTool?.description).toContain('availableNodes');
    });

    it('TC-REGISTRY-008: should initialize with 11 tools total', () => {
      // Act
      toolRegistry.initialize();

      // Assert - All 11 tools should be registered
      const allTools = [
        'delete_workflow',
        'list_workflows',
        'get_workflow',
        'get_workflow_connections',
        'create_workflow',
        'create_workflow_from_file',
        'update_workflow',
        'replace_workflow_from_file',
        'list_executions',
        'get_execution',
        'get_execution_by_node',
      ];

      for (const toolName of allTools) {
        const tool = toolRegistry.getToolByName(toolName);
        expect(tool).toBeDefined();
      }
    });
  });
});
