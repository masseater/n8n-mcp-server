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

# Type checking
pnpm run type-check   # Run TypeScript compiler without emitting

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

### MCP Server Implementation

This is a Model Context Protocol (MCP) server that bridges AI models with n8n workflow automation platform.

**Transport Layer (src/server/mcp-server.ts)**:
- Supports both stdio and HTTP transports
- HTTP transport uses Express with POST /mcp endpoint
- Tools are registered via `this.server.registerTool()` and tracked in `this.registeredTools[]`
- Tool registration happens in `MCPServerImpl.initialize()` method

**Tool Registration Pattern**:
```typescript
this.server.registerTool("tool_name", { description, inputSchema }, async (args) => {
  // handler
});
this.registeredTools.push("tool_name");  // Track for logging
```

### n8n API Client (src/clients/n8n-api-client.ts)

**Important Implementation Details**:
- `updateWorkflow()`: Must exclude `active` and `id` fields from request body (they are read-only in n8n API)
- `connections` and `settings` are **required** fields for both create and update operations
- All API calls use the HTTP client wrapper (src/clients/http-client.ts) which handles retries and error transformation

### Response Optimization (src/optimizers/response-optimizer.ts)

**Two-tier optimization strategy**:
1. `optimizeWorkflowSummary()`: For list operations - removes nodes/connections, keeps metadata
2. `optimizeWorkflowDetail()`: For get operations - converts full nodes to NodeSummary (removes parameters, typeVersion)
3. `minimizeContext()`: Final pass to reduce token usage

### Configuration (src/config/config-loader.ts)

**Environment Variables**:
- `N8N_URL`: n8n instance URL (required)
- `N8N_API_KEY`: API key for authentication (required)
- `LOG_LEVEL`: Log level (optional, default: info)

**CLI Options** override environment variables via Commander.js.

## Critical Implementation Notes

### n8n API Constraints

1. **Update Workflow**:
   - `active` field is read-only - cannot be changed via PUT /api/v1/workflows/:id
   - `id` field must not be in request body
   - Requires full workflow data: name, nodes, connections, settings

2. **Create Workflow**:
   - `connections` and `settings` are required fields (even if empty objects)
   - `active` defaults to false if not provided

3. **Workflow Activation**:
   - No dedicated activate/deactivate endpoint exists
   - `active` field cannot be toggled via PUT (returns "read-only" error)
   - This functionality was removed from the codebase

### Zod Schema Usage

**Do NOT use `.shape` property of Zod schemas in MCP tool definitions**:
```typescript
// ❌ Bad - causes issues with MCP protocol
inputSchema: createWorkflowSchema.shape

// ✅ Good - explicit object definition
inputSchema: {
  name: z.string(),
  nodes: z.array(nodeSchema),
  // ...
}
```

## Type System

- **WorkflowSummary**: Minimal workflow info (no nodes/connections)
- **WorkflowDetail**: Full workflow with NodeSummary[] and ConnectionSummary
- **WorkflowDefinition**: Input type for create/update (uses full INode[] from n8n-types)

The optimizer converts between these types to manage context size for AI models.

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
