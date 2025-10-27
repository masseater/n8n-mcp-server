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
   - High-level n8n API wrapper
   - Methods: `authenticate()`, `getWorkflows()`, `getWorkflow()`, `createWorkflow()`, `updateWorkflow()`, `deleteWorkflow()`
   - Returns `WorkflowSummary[]` for list operations
   - Returns `WorkflowDetailInternal` for detail operations (contains full INode[] and IConnections)
   - Uses `N8nHttpClient` for all HTTP operations
   - Uses `AuthManager` for authentication

2. **N8nHttpClient** (src/clients/http-client.ts)
   - Axios-based HTTP client with retry logic
   - Exponential backoff: 2^n * 1000ms delays
   - Retries on 5xx errors and network failures (not 4xx)
   - Request/response interceptors for logging
   - Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`

3. **AuthManager** (src/clients/auth-manager.ts)
   - Manages API key authentication
   - Updates HTTP client headers with `X-N8N-API-KEY`

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
   - `active` field is **read-only** - must be excluded from request body
   - Implementation: `const { active, ...workflowPayload } = workflow;`

2. **Update Workflow** (PUT /api/v1/workflows/:id):
   - `active` and `id` fields are **read-only** - must be excluded from request body
   - Returns "read-only" error if included
   - Implementation: `sanitizeWorkflowForUpdate()` removes both fields
   - Can update partial fields (name, nodes, connections, settings, tags)

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

### 3. create_workflow

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

### 4. update_workflow

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

### 5. delete_workflow

Delete a workflow by ID.

**Parameters**:
- `id` (string, required): Workflow ID

**Response**:
- `{ success, message, data: { id } }`

**Note**: activate_workflow and deactivate_workflow were removed due to n8n API limitations.

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
