# n8n MCP Server

Model Context Protocol (MCP) server for n8n workflow automation platform. This server provides AI models with comprehensive access to n8n workflows through a standardized MCP interface.

## Quick Start

### Prerequisites

- n8n instance running (local or remote)
- n8n API key ([how to get API key](https://docs.n8n.io/api/authentication/))
- Node.js 22.10.0 or higher

### Installation

Install and run directly using npx (no local clone required):

```bash
npx @r_masseater/n8n-mcp-server --n8n-url "http://localhost:5678" --api-key "your-api-key"
```

### Using with Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["@r_masseater/n8n-mcp-server"],
      "env": {
        "N8N_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

After saving, restart Claude Desktop. You can now ask Claude to manage your n8n workflows!

**Example prompts**:
- "List all my n8n workflows"
- "Create a new workflow called 'Email Automation'"
- "Show me the details of workflow ID abc123"
- "Update workflow xyz456 to add a new node"

## Features

- **Complete Workflow Management**: Create, read, update, and delete n8n workflows
- **Optimized Responses**: Context-efficient data structures for AI model consumption
- **Flexible Authentication**: API key-based authentication
- **Dual Transport Support**: stdio and HTTP transports
- **Comprehensive Error Handling**: Structured error responses with meaningful messages

## Configuration

### CLI Options

```bash
# Basic usage (uses environment variables)
npx @r_masseater/n8n-mcp-server

# With CLI options
npx @r_masseater/n8n-mcp-server --n8n-url http://localhost:5678 --api-key your-key --log-level debug

# HTTP transport (for development/testing)
npx @r_masseater/n8n-mcp-server --transport http --port 3000
```

### Environment Variables

Alternatively, you can use environment variables:

```bash
# Required
export N8N_URL="http://localhost:5678"          # n8n instance URL
export N8N_API_KEY="your-api-key"              # n8n API key

# Optional
export LOG_LEVEL="info"                         # Log level (error|warn|info|debug)
```

## Development

If you want to develop or contribute to this project:

```bash
# Clone the repository
git clone https://github.com/masseater/n8n-mcp-server.git
cd n8n-mcp-server

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run in development mode with auto-reload
pnpm run dev

# Run tests
pnpm test
```

## Available MCP Tools

### 1. `list_workflows`

List n8n workflows with optional filtering.

**Parameters:**
- `active` (boolean, optional): Filter by active status
- `tags` (array of strings, optional): Filter by tags
- `limit` (number, optional): Maximum number of workflows to return (1-100)
- `offset` (number, optional): Number of workflows to skip

**Example:**
```json
{
  "name": "list_workflows",
  "arguments": {
    "active": true,
    "tags": ["automation", "production"],
    "limit": 10
  }
}
```

### 2. `get_workflow`

Get detailed information about a specific workflow.

**Parameters:**
- `id` (string, required): Workflow ID

**Example:**
```json
{
  "name": "get_workflow",
  "arguments": {
    "id": "workflow-123"
  }
}
```

### 3. `create_workflow`

Create a new workflow.

**Parameters:**
- `name` (string, required): Workflow name
- `nodes` (array, optional): Workflow nodes
- `connections` (object, optional): Node connections
- `active` (boolean, optional): Whether workflow is active
- `tags` (array of strings, optional): Workflow tags

**Example:**
```json
{
  "name": "create_workflow",
  "arguments": {
    "name": "My New Workflow",
    "nodes": [
      {
        "id": "node1",
        "type": "n8n-nodes-base.start",
        "position": [100, 100]
      }
    ],
    "connections": {},
    "active": false,
    "tags": ["automation"]
  }
}
```

### 4. `update_workflow`

Update an existing workflow.

**Parameters:**
- `id` (string, required): Workflow ID
- `name` (string, optional): New workflow name
- `nodes` (array, optional): Updated workflow nodes
- `connections` (object, optional): Updated node connections
- `active` (boolean, optional): Updated active status
- `tags` (array of strings, optional): Updated workflow tags

**Example:**
```json
{
  "name": "update_workflow",
  "arguments": {
    "id": "workflow-123",
    "name": "Updated Workflow Name",
    "active": true,
    "tags": ["updated", "production"]
  }
}
```

### 5. `delete_workflow`

Delete a workflow.

**Parameters:**
- `id` (string, required): Workflow ID

**Example:**
```json
{
  "name": "delete_workflow",
  "arguments": {
    "id": "workflow-123"
  }
}
```


## Usage Examples

### Using with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/n8n-mcp-server/dist/index.js"],
      "env": {
        "N8N_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Using with other MCP clients

The server supports both stdio and HTTP transports:

```bash
# stdio transport (default)
pnpm start

# HTTP transport
pnpm start --transport http --port 3000
```

## Development

### Project Structure

```
src/
├── clients/           # n8n API client implementations
├── config/           # Configuration management
├── interfaces/       # TypeScript interfaces
├── optimizers/      # Response optimization
├── server/          # MCP server implementation
├── types/           # Type definitions
└── index.ts         # Main entry point
```

### Scripts

```bash
# Development
pnpm run dev          # Start in development mode
pnpm run build        # Build the project
pnpm run type-check   # TypeScript type checking

# Production
pnpm start            # Start the server
pnpm start:stdio      # Start with stdio transport
pnpm start:http      # Start with HTTP transport
```

### Testing

```bash
# Run type checking
pnpm run type-check

# Build and test
pnpm run build
```

## Error Handling

The server provides structured error responses:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Failed to authenticate with n8n API"
    }
  ],
  "isError": true
}
```

Common error scenarios:
- **Authentication failures**: Invalid API key or n8n instance unreachable
- **Workflow not found**: Invalid workflow ID
- **Validation errors**: Invalid parameters or workflow structure
- **Network errors**: Connection timeouts or API unavailability

## Response Optimization

The server optimizes responses for AI model consumption:

- **Minimized context**: Removes unnecessary fields and metadata
- **Essential information**: Preserves critical workflow data
- **Pagination support**: Handles large datasets efficiently
- **Structured format**: Consistent JSON responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking and build
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
