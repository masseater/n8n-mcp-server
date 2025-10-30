# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Development with auto-reload
pnpm run dev          # stdio transport (default)
pnpm run dev:http     # HTTP transport on port 3000

# Build
pnpm run build        # Compile TypeScript to dist/
pnpm run clean        # Remove dist/ directory

# Type checking & Linting
pnpm run type-check   # Run TypeScript compiler without emitting
pnpm run lint         # Run ESLint
pnpm run lint:fix     # Fix ESLint errors automatically

# Code Quality
pnpm run knip         # Detect unused files, dependencies, exports
pnpm run knip:fix     # Auto-fix knip issues

# Testing
pnpm run test         # Run tests once
pnpm run test:watch   # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage

# Production
pnpm start            # Run built code with stdio transport
pnpm start:http       # Run built code with HTTP transport
```

### Recommended Development Workflow

**HTTPモードでバックグラウンド起動を推奨**

HTTPモードでバックグラウンド起動すると、コード修正が即座に反映され（HMR）、開発効率が大幅に向上します：

```bash
# バックグラウンドでHTTPサーバーを起動
pnpm run dev:http &

# または、別のターミナルで起動
pnpm run dev:http
```

**利点**:
- ファイル変更を検知して自動リロード（tsx --watch）
- MCPツールの動作確認がリアルタイムで可能
- ログ出力でツール登録状態を確認可能
- stdio transportと異なり、複数のクライアントから同時接続可能

## Architecture Overview

This is a Model Context Protocol (MCP) server that bridges AI models with n8n workflow automation platform.

### Core Architecture

**Layer 1: Server Layer (src/server/)**

1. **MCPServerImpl** (src/server/mcp-server.ts)
   - Main server orchestrator
   - Lifecycle: `constructor → initialize() → start() → stop()`
   - Manages two transport modes: stdio (default) and HTTP
   - Delegates tool management to ToolRegistry
   - Delegates HTTP handling to HttpTransportHandler

2. **ToolRegistry** (src/server/tool-registry.ts)
   - Centralized tool management system
   - Manual tool registration (no auto-discovery for safety)
   - Schema caching for performance (cleared via `clearCache()`)
   - Provides `getToolSchemas()`, `getToolByName()`, `setupToolHandlers()`
   - Tool instances stored in `Map<string, Tool>`

3. **HttpTransportHandler** (src/server/http-transport-handler.ts)
   - Express-based HTTP transport implementation
   - Endpoints: `GET /health` (health check), `POST /mcp` (MCP protocol)
   - Delegates MCP protocol handling to `McpProtocolHandler`
   - Keeps process alive with signal handlers (SIGINT, SIGTERM)

4. **McpProtocolHandler** (src/server/mcp-protocol-handler.ts)
   - Handles MCP HTTP protocol requests
   - Processes tool invocations from HTTP POST /mcp
   - Retrieves tool schemas and executes tools via callbacks

**Layer 2: Tool Layer (src/tools/)**

1. **BaseTool** (src/tools/base/base-tool.ts)
   - Abstract base class for all MCP tools
   - Template Method pattern for tool definition
   - Abstract methods: `name`, `description`, `getInputSchema()`, `execute()`
   - Default `handler()` wraps `execute()` with response creation
   - Converts to `ToolDefinition` via `toDefinition()`

2. **RawTool** (src/tools/base/raw-tool.ts)
   - Extends `BaseTool<TArgs>` and adds `raw` option support
   - Abstract methods: `executeCore()`, `formatResponse()`
   - Automatically extracts `raw` flag from args and passes to `formatResponse()`
   - Used by all workflow tools to support minimal/full response modes

3. **Tool Implementations** (src/tools/implementations/)
   - Each tool extends `RawTool<TArgs>` (not BaseTool directly)
   - Uses Zod for input validation with `raw?: boolean` field
   - Receives `ToolContext` with `n8nClient` and `responseBuilder`
   - Available tools: ListWorkflowsTool, GetWorkflowTool, CreateWorkflowTool, UpdateWorkflowTool, DeleteWorkflowTool

**Layer 3: Client Layer (src/clients/)**

1. **N8nApiClientImpl** (src/clients/n8n-api-client.ts)
   - Wrapper around @hey-api/openapi-ts generated SDK
   - Methods: `authenticate()`, `getWorkflows()`, `getWorkflow()`, `createWorkflow()`, `updateWorkflow()`, `deleteWorkflow()`
   - Returns `WorkflowSummary[]` for list operations
   - Returns `WorkflowDetailInternal` for detail operations (contains full INode[] and IConnections)
   - Uses generated SDK functions: `getWorkflows()`, `getWorkflowsById()`, `postWorkflows()`, `putWorkflowsById()`, `deleteWorkflowsById()`
   - Configures generated client via `generatedClient.setConfig()`

**Layer 4: Response Layer (src/formatters/)**

1. **ToolResponseBuilder** (src/formatters/tool-response-builder.ts)
   - Creates optimized MCP tool responses
   - Two response modes: minimal (default) and raw
   - Methods: `createListWorkflowsResponse()`, `createGetWorkflowResponse()`, etc.
   - Delegates to WorkflowFormatter and ContextMinimizer

2. **WorkflowFormatter** (src/formatters/workflow-formatter.ts)
   - Transforms n8n workflow data to simplified formats
   - `formatWorkflowSummary()`: Extracts id, name, active, tags, dates, nodeCount
   - `formatWorkflowDetail()`: Includes nodes (id, name, type, position, disabled) and simplified connections
   - Removes verbose fields: node parameters, typeVersion, credentials

3. **ContextMinimizer** (src/formatters/context-minimizer.ts)
   - Final pass to reduce response size if needed
   - Default max size: 100KB
   - Array minimization: reduces item count
   - Object minimization: removes executionLogs, executionData, verbose fields

### Data Flow

**stdio transport**:
```
User Request → StdioServerTransport → MCPServerImpl
  → ToolRegistry.getToolByName() → Tool Instance (RawTool)
  → Tool.handler() → Tool.execute() → Tool.executeCore()
  → N8nApiClientImpl.getWorkflows/getWorkflow/...
  → N8nHttpClient → n8n API
  ← Raw Response (WorkflowSummary[] or WorkflowDetailInternal)
  → Tool.formatResponse(data, raw)
  → ToolResponseBuilder.createXxxResponse(data, raw)
  → [if raw=true] WorkflowFormatter → ContextMinimizer
  → [if raw=false] Minimal response (id, name, active)
  → MCPToolResponse → createToolResponse() → ToolResponse
  → StdioServerTransport → User
```

**HTTP transport**:
```
User HTTP POST /mcp → HttpTransportHandler
  → McpProtocolHandler.handleRequest()
  → ToolRegistry.getToolByName() → Tool Instance (RawTool)
  → (same flow as stdio from here)
  → HTTP Response → User
```

### Tool Registration Pattern

Tools are registered in ToolRegistry.initialize():

```typescript
// 1. Create tool context
const context: ToolContext = {
  n8nClient: this.n8nClient,
  responseBuilder: this.responseBuilder,
};

// 2. Manually instantiate tools
const tools: Tool[] = [
  new DeleteWorkflowTool(context),
  new ListWorkflowsTool(context),
  // ...
];

// 3. Store in Map
for (const tool of tools) {
  this.toolInstances.set(tool.name, tool);
}

// 4. Register with MCP SDK
this.server.registerTool(
  schema.name,
  { description, inputSchema },
  toolInstance.handler.bind(toolInstance)
);
```

### n8n API Client Implementation Details

**N8nApiClientImpl** (src/clients/n8n-api-client.ts):

1. **Authentication**:
   - Uses `AuthManager.setApiKey()` which sets `X-N8N-API-KEY` header
   - `authenticate()` method validates credentials via GET /workflows

2. **Update Workflow Constraints**:
   - `active` and `id` fields are **read-only** in n8n API
   - Must be excluded from PUT request body
   - `connections` and `settings` are **required** fields
   - Implementation: `const { active, id, ...workflowData } = workflow;`

3. **Error Handling**:
   - HTTP client automatically retries on 5xx and network errors
   - Transforms Axios errors to standard Error format
   - Error messages include HTTP status codes

### Configuration System (src/config/)

**Environment Variables**:
- `N8N_URL`: n8n instance URL (required)
- `N8N_API_KEY`: API key for authentication (required)
- `LOG_LEVEL`: Log level (optional, default: info)

**CLI Options** (via Commander.js):
- Override environment variables
- `--n8n-url`, `--api-key`, `--log-level`
- `--transport stdio|http`, `--port <number>`

## Critical Implementation Notes

### n8n API Constraints

1. **Create Workflow** (POST /api/v1/workflows):
   - `name` is **required**
   - `nodes` and `connections` are **required** (can be empty arrays/objects)
   - `settings` is optional
   - `active` and `tags` fields are **read-only** - must be excluded from request body
   - Returns "read-only" error if included
   - Implementation: `const { active, tags, ...workflowPayload } = workflow;`

2. **Update Workflow** (PUT /api/v1/workflows/:id):
   - `active`, `tags`, and `id` fields are **read-only** - must be excluded from request body
   - Returns "read-only" error if included
   - Implementation: `sanitizeWorkflowForUpdate()` removes all three fields
   - Can update partial fields (name, nodes, connections, settings)

3. **Workflow Activation**:
   - No dedicated activate/deactivate endpoint exists in n8n API
   - `active` field cannot be toggled via PUT
   - activate_workflow and deactivate_workflow tools were **intentionally removed**
   - To change active status, must use n8n UI or separate API if available

### Zod Schema Usage

**Do NOT use `.shape` property of Zod schemas in MCP tool definitions**:
```typescript
// ❌ Bad - causes issues with MCP protocol
inputSchema: createWorkflowSchema.shape

// ✅ Good - explicit object definition from getInputSchema()
getInputSchema() {
  return z.object({
    name: z.string(),
    nodes: z.array(nodeSchema),
    // ...
  });
}
```

### RawTool Pattern

**All workflow tools must extend RawTool instead of BaseTool**:

```typescript
export class MyTool extends RawTool<MyToolArgs> {
  readonly name = "my_tool";
  readonly description = "...";

  getInputSchema() {
    return z.object({
      // ... other args
      raw: z.boolean().optional(), // Required for RawTool
    });
  }

  // Implement executeCore (without raw parameter)
  async executeCore(args: Omit<MyToolArgs, "raw">): Promise<ResultType> {
    return await this.context.n8nClient.doSomething(args);
  }

  // Implement formatResponse (with raw parameter)
  formatResponse(data: unknown, raw: boolean): unknown {
    return this.context.responseBuilder.createMyToolResponse(data, raw);
  }
}
```

**Why RawTool?**
- Separates business logic (executeCore) from response formatting (formatResponse)
- Automatically extracts `raw` flag from args
- Enables consistent minimal/full response pattern across all tools
- RawTool.execute() calls executeCore() then formatResponse()

## Type System

### Core Types (src/types/)

**n8n-types.ts** - n8n domain types:
- `INode`: Full node definition with parameters, credentials, typeVersion
- `IConnections`: Connection structure `{ [nodeName]: { [outputIndex]: [{ node, type, index }] } }`
- `IWorkflowSettings`: Workflow execution settings

**index.ts** - MCP server types:

1. **Workflow Response Types**:
   - `WorkflowSummary`: Minimal info (id, name, active, tags, dates, nodeCount) - no nodes/connections
   - `WorkflowDetail`: Formatted workflow with NodeSummary[] and ConnectionSummary (for MCP responses)
   - `WorkflowDetailInternal`: Internal type with full INode[] and IConnections (returned by N8nApiClient)
   - `WorkflowDefinition`: Input type for create/update (uses full INode[] from n8n)

2. **Node Types**:
   - `NodeSummary`: Simplified node (id, name, type, position, disabled) - no parameters
   - `ConnectionSummary`: Simplified connections with essential routing info

3. **MCP Response Types**:
   - `MCPToolResponse<T>`: `{ success: boolean, message: string, data: T }`
   - `WorkflowListResponse`: `{ count: number, workflows: Array<{id, name, active}> }`
   - `WorkflowDetailResponse`: `{ id, name, active, nodeCount, tags }`
   - `WorkflowDeleteResponse`: `{ id: string }`

**mcp-response.ts** - MCP protocol types:
- `ToolResponse`: MCP SDK response format
- `TextContent`: `{ type: "text", text: string }`

### Type Conversion Flow

**For get_workflow tool**:
```
n8n API: N8nWorkflowResponse (with INode[], IConnections)
  → N8nApiClientImpl.transformToWorkflowDetail()
  → WorkflowDetailInternal (INode[], IConnections preserved)
  → Tool.executeCore() returns WorkflowDetailInternal
  → Tool.formatResponse(data, raw)
  → ToolResponseBuilder.createGetWorkflowResponse(data, raw)

  [if raw=true]:
    → WorkflowFormatter.formatWorkflowDetail()
    → WorkflowDetail (NodeSummary[], ConnectionSummary)
    → ContextMinimizer.minimizeContext()
    → MCPToolResponse<WorkflowDetail>

  [if raw=false]:
    → Extract minimal fields: { id, name, active, nodeCount, tags }
    → MCPToolResponse<WorkflowDetailResponse>
```

**For list_workflows tool**:
```
n8n API: N8nWorkflowResponse[]
  → N8nApiClientImpl.transformToWorkflowSummary()
  → WorkflowSummary[] (already minimal)
  → Tool.formatResponse(data, raw)
  → ToolResponseBuilder.createListWorkflowsResponse(data, raw)

  [if raw=true]:
    → MCPToolResponse<WorkflowSummary[]>

  [if raw=false]:
    → Extract: { count, workflows: [{ id, name, active }] }
    → MCPToolResponse<WorkflowListResponse>
```

## Available MCP Tools

All tools support a `raw` option to control response verbosity. By default, tools return minimal information to reduce context usage. Set `raw=true` to get complete workflow data.

### 1. list_workflows

Get workflow list with optional filtering.

**Parameters**:
- `active` (boolean, optional): Filter by active status
- `tags` (string[], optional): Filter by tags
- `limit` (number, optional): Limit number of results (1-100)
- `offset` (number, optional): Offset for pagination
- `raw` (boolean, optional): Return full workflow summaries

**Response**:
- Default (`raw=false`): `{ success, message, data: { count, workflows: [{ id, name, active }] } }`
- With `raw=true`: `{ success, message, data: [WorkflowSummary...] }` (includes tags, dates, nodeCount)

**Context reduction**: 60-70% with default response

### 2. get_workflow

Get detailed information about a specific workflow.

**Parameters**:
- `id` (string, required): Workflow ID
- `raw` (boolean, optional): Return full workflow details including nodes and connections

**Response**:
- Default (`raw=false`): `{ success, message, data: { id, name, active, nodeCount, tags } }`
- With `raw=true`: `{ success, message, data: WorkflowDetail }` (includes nodes, connections, settings)

**Context reduction**: 85-90% with default response

### 3. get_workflow_connections

Get workflow node connections in a graph structure. Shows which nodes connect to which nodes.

**Parameters**:
- `id` (string, required): Workflow ID
- `raw` (boolean, optional): Include raw connection structure

**Response**:
- Default (`raw=false`): `{ success, message, data: { id, name, graph: [NodeConnection...] } }`
  - Each `NodeConnection` contains: `{ node, id, type, inputs: [node names], outputs: [node names] }`
- With `raw=true`: Same as default, but also includes `rawConnections` field with n8n's original connection structure

**Example response**:
```json
{
  "success": true,
  "message": "ワークフロー接続情報を取得しました",
  "data": {
    "id": "workflow-123",
    "name": "My Workflow",
    "graph": [
      {
        "node": "Start",
        "id": "node1",
        "type": "n8n-nodes-base.start",
        "inputs": [],
        "outputs": ["HTTP Request"]
      },
      {
        "node": "HTTP Request",
        "id": "node2",
        "type": "n8n-nodes-base.httpRequest",
        "inputs": ["Start"],
        "outputs": ["Set"]
      }
    ]
  }
}
```

**Context reduction**: 70-80% compared to full workflow data

**Use cases**:
- Understanding workflow structure without node details
- Debugging connection issues
- Visualizing data flow between nodes

### 4. create_workflow

Create a new workflow.

**Parameters**:
- `name` (string, required): Workflow name
- `nodes` (INode[], required): Workflow nodes
- `connections` (IConnections, required): Node connections
- `settings` (IWorkflowSettings, optional): Workflow settings
- `active` (boolean, optional): Active status
- `tags` (string[], optional): Tags
- `raw` (boolean, optional): Return full created workflow data

**Response**:
- Default (`raw=false`): `{ success, message, data: { id, name, active } }`
- With `raw=true`: `{ success, message, data: <full workflow data> }`

**Context reduction**: 90% with default response

### 5. update_workflow

Update an existing workflow.

**Parameters**:
- `id` (string, required): Workflow ID
- `name` (string, optional): Updated workflow name
- `nodes` (INode[], optional): Updated nodes
- `connections` (IConnections, optional): Updated connections
- `settings` (IWorkflowSettings, optional): Updated settings
- `active` (boolean, optional): Updated active status
- `tags` (string[], optional): Updated tags
- `raw` (boolean, optional): Return full updated workflow data

**Response**:
- Default (`raw=false`): `{ success, message, data: { id, name } }`
- With `raw=true`: `{ success, message, data: <full workflow data> }`

**Context reduction**: 90% with default response

### 6. delete_workflow

Delete a workflow by ID.

**Parameters**:
- `id` (string, required): Workflow ID

**Response**:
- `{ success, message, data: { id } }`

**Note**: activate_workflow and deactivate_workflow were removed due to n8n API limitations.

### 7. create_workflow_from_file

Create a new workflow from a local JSON file. This tool is useful for importing workflow definitions stored as JSON files.

**Parameters**:
- `filePath` (string, required): Path to workflow JSON file (absolute or relative to current working directory)
- `raw` (boolean, optional): Return full created workflow data

**JSON File Requirements**:
The JSON file must contain a valid workflow definition with these required fields:
- `name` (string): Workflow name
- `nodes` (array): Array of node definitions
- `connections` (object): Connection structure between nodes

Optional fields:
- `settings` (object): Workflow settings
- `active` (boolean): Active status (will be excluded as it's read-only)
- `tags` (array): Tags (will be excluded as it's read-only)

**Response**:
- Default (`raw=false`): `{ success, message, data: { id, name, active } }`
- With `raw=true`: `{ success, message, data: <full workflow data> }`

**Context reduction**: 90% with default response

**Example**:
```json
{
  "name": "My Workflow",
  "nodes": [
    {
      "id": "start",
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {}
    }
  ],
  "connections": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

**Error Handling**:
- File not found: Returns error if file doesn't exist
- Invalid JSON: Returns error if file contains invalid JSON
- Invalid workflow: Returns error if workflow structure is invalid

### 8. replace_workflow_from_file

Replace an existing workflow completely with data from a local JSON file. All workflow fields will be overwritten with the file contents.

**Parameters**:
- `id` (string, required): Workflow ID to replace
- `filePath` (string, required): Path to workflow JSON file (absolute or relative to current working directory)
- `raw` (boolean, optional): Return full updated workflow data

**JSON File Requirements**:
Same as `create_workflow_from_file`. The file should contain a complete workflow definition.

**Response**:
- Default (`raw=false`): `{ success, message, data: { id, name } }`
- With `raw=true`: `{ success, message, data: <full workflow data> }`

**Context reduction**: 90% with default response

**Use Cases**:
- Restoring workflow from backup
- Applying workflow templates
- Batch updating workflows with version control
- Deploying workflows across environments

**Important Notes**:
- This completely replaces the workflow - all existing nodes and connections will be removed
- The `active`, `tags`, and `id` fields in the JSON file are ignored (read-only in n8n API)
- The workflow ID is taken from the `id` parameter, not from the JSON file

## Context Optimization Strategy

**Overall context reduction**: Average 75-85% across all tools when using default (non-raw) responses.

This optimization is critical for:
- Reducing token usage in AI conversations
- Enabling more workflow operations within context limits
- Faster response processing

**When to use `raw=true`**:
- When you need complete workflow structure for modifications
- When debugging workflow issues
- When exporting workflow data

**When to use default (raw=false)**:
- Listing workflows to find a specific one
- Checking workflow status
- Confirming successful create/update operations
- Most common operations

## Phase 3 Refactoring and Optimization (2025-10-30)

This section documents the code quality improvements implemented in Phase 3 of the workflow execution tools project.

### Refactoring Summary

**Completed Tasks**:
1. ✅ Code quality analysis
2. ✅ DRY principle application  
3. ✅ Design pattern application
4. ✅ Performance optimization
5. ✅ Type safety enhancement
6. ✅ External library adoption (Remeda)

### 1. DRY Principle - Code Deduplication

**Problem**: Repetitive object property filtering logic in execution tools.

**Solution**: Adopted **Remeda** library (`pickBy` function) to replace custom implementation.

**Before** (custom implementation):
```typescript
const options: { workflowId?: string; status?: string; ... } = {};
if (args.workflowId !== undefined) options.workflowId = args.workflowId;
if (args.status !== undefined) options.status = args.status;
// ... repeated for each property
```

**After** (Remeda):
```typescript
import { pickBy } from 'remeda';

const options = pickBy(
  { workflowId: args.workflowId, status: args.status, ... },
  (value) => value !== undefined
);
```

**Impact**:
- Removed 100+ lines of custom utility code
- Reduced maintenance burden
- Improved type inference with Remeda's TypeScript-first design

### 2. Design Pattern - Template Method

**Problem**: Duplicated raw/minimal response logic across 6 response builder methods.

**Solution**: Implemented **Template Method Pattern** with a generic `createResponse` method.

**Before** (duplicated pattern):
```typescript
createListExecutionsResponse(executions, raw) {
  if (raw) {
    return { success: true, message: "...", data: executions };
  }
  return { success: true, message: "...", data: minimalData };
}
// ... same pattern repeated in 5 other methods
```

**After** (template method):
```typescript
private createResponse<TRaw, TMinimal>(
  message: string,
  rawData: TRaw,
  minimalData: TMinimal,
  raw: boolean
): MCPToolResponse<TRaw | TMinimal> {
  return {
    success: true,
    message,
    data: raw ? rawData : minimalData,
  };
}

// Usage
createListExecutionsResponse(executions, raw) {
  const message = `${executions.length}件の実行履歴を取得しました`;
  const minimalData = { count: executions.length, executions: [...] };
  return this.createResponse(message, executions, minimalData, raw);
}
```

**Impact**:
- Reduced code by 50 lines (-39%)
- Eliminated 4 if-else branches
- Centralized response creation logic
- Improved type safety with generics

### 3. Performance Optimization

**Problem**: Redundant JSON.stringify() calls in ContextMinimizer (up to 4x serialization of same data).

**Solution**: Pass serialized string between methods to avoid re-serialization.

**Before**:
```typescript
minimizeContext(data) {
  const jsonString = JSON.stringify(data);  // 1st
  if (jsonString.length <= maxSize) return data;
  
  if (Array.isArray(data)) {
    return minimizeArray(data, maxSize);     // calls JSON.stringify again (2nd)
  } else {
    return minimizeObject(data, maxSize);    // calls JSON.stringify again (2nd & 3rd)
  }
}
```

**After**:
```typescript
minimizeContext(data) {
  const jsonString = JSON.stringify(data);  // 1st (only)
  if (jsonString.length <= maxSize) return data;
  
  if (Array.isArray(data)) {
    return minimizeArray(data, maxSize, jsonString);  // reuse
  } else {
    return minimizeObject(data, maxSize, jsonString); // reuse
  }
}
```

**Impact**:
- Reduced JSON serialization by 50-75% for large data
- Improved response time for context minimization
- Lower CPU usage

### 4. External Library Adoption - Remeda

**Rationale**: Replace custom utility functions with battle-tested library.

**Why Remeda over Lodash**:
- TypeScript-first design (better type inference)
- Tree-shakable (smaller bundle size)
- Modern API (supports data-first and data-last)
- Active development (2025+)

**Added Dependency**:
```json
{
  "dependencies": {
    "remeda": "^2.32.0"
  }
}
```

**Usage**:
- `pickBy()` - Filter object properties (src/tools/implementations/*)
- Future: Can leverage other Remeda utilities (map, filter, groupBy, etc.)

### Code Quality Metrics

**Before Phase 3**:
- Total test files: 9
- Total tests: 43
- Code duplication: Multiple patterns
- Custom utilities: object-utils.ts (100+ lines)

**After Phase 3**:
- Total test files: 8
- Total tests: 37  
- Code duplication: Eliminated via Remeda & Template Method
- Custom utilities: 0 (removed object-utils.ts)
- External dependencies: +1 (Remeda)

**Quality Gates** (all passing):
- ✅ ESLint: 0 errors
- ✅ Knip: 0 unused exports
- ✅ Tests: 37/37 passed
- ✅ Type check: No errors

### Benefits

1. **Maintainability**: Less code to maintain, well-tested external dependencies
2. **Readability**: Clear patterns (Template Method), familiar library (Remeda)
3. **Performance**: Reduced redundant operations (JSON serialization)
4. **Type Safety**: Better type inference with Remeda, generic template method
5. **Future-proof**: Can leverage more Remeda utilities as needed

### Migration Notes

If you need to add similar object filtering logic in the future:

```typescript
import { pickBy } from 'remeda';

// Filter out undefined values
const cleanObject = pickBy(sourceObject, (value) => value !== undefined);

// Filter out null and undefined
const nonNullish = pickBy(sourceObject, (value) => value != null);

// Custom predicate
const filtered = pickBy(sourceObject, (value, key) => someCondition(value, key));
```

For other common operations, check [Remeda documentation](https://remedajs.com/docs/).
