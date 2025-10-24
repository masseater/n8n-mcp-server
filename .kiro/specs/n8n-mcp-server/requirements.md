# Requirements Document

## Introduction

n8nワークフロー自動化プラットフォームのAPIにアクセスするためのModel Context Protocol (MCP) サーバーを開発する。既存のソリューションと比較して、出力コンテキストを最適化し、最新のMCPベストプラクティスに準拠したクリーンで効率的な実装を提供する。

## Glossary

- **MCP Server**: Model Context Protocolに準拠したサーバー実装
- **n8n API**: n8nワークフロー自動化プラットフォームのREST API
- **Workflow**: n8nで作成された自動化ワークフロー
- **Execution**: ワークフローの実行インスタンス
- **Node**: ワークフロー内の個別のタスクまたはアクション
- **Credential**: n8nでの認証情報管理システム
- **STDIO Transport**: 標準入出力を使用したMCP通信方式
- **HTTP Transport**: HTTPプロトコルを使用したMCP通信方式

## Requirements

### Requirement 1

**User Story:** As a developer, I want to connect to n8n API through MCP, so that I can manage workflows programmatically with minimal context overhead

#### Acceptance Criteria

1. THE MCP_Server SHALL establish secure connection to n8n API using provided credentials
2. WHEN authentication fails, THE MCP_Server SHALL return clear error message with authentication status
3. THE MCP_Server SHALL support both API key and username/password authentication methods
4. THE MCP_Server SHALL validate connection parameters before attempting API calls
5. THE MCP_Server SHALL handle rate limiting according to n8n API specifications
6. THE MCP_Server SHALL support both STDIO and HTTP transport protocols
7. THE MCP_Server SHALL be built using Node.js LTS (22.10.0) and managed with pnpm

### Requirement 2

**User Story:** As a user, I want to list and retrieve workflow information, so that I can understand available automation options

#### Acceptance Criteria

1. THE MCP_Server SHALL provide tool to list all available workflows with essential metadata only
2. WHEN retrieving workflow details, THE MCP_Server SHALL return structured workflow information excluding verbose execution logs
3. THE MCP_Server SHALL support filtering workflows by status, tags, or creation date
4. THE MCP_Server SHALL return workflow schema in readable format for analysis
5. THE MCP_Server SHALL limit response size to prevent context overflow

### Requirement 3

**User Story:** As a user, I want to manage workflow lifecycle operations, so that I can control automation deployment

#### Acceptance Criteria

1. THE MCP_Server SHALL provide tool to activate and deactivate workflows
2. THE MCP_Server SHALL provide tool to create new workflows from JSON definition
3. THE MCP_Server SHALL provide tool to update existing workflow configurations
4. THE MCP_Server SHALL provide tool to delete workflows with confirmation
5. WHEN modifying workflows, THE MCP_Server SHALL validate workflow structure before applying changes

### Requirement 4

**User Story:** As a developer, I want optimized context output, so that I can work efficiently without information overload

#### Acceptance Criteria

1. THE MCP_Server SHALL return only essential information by default for all operations
2. THE MCP_Server SHALL provide optional verbose mode for detailed information when needed
3. THE MCP_Server SHALL exclude execution logs from standard workflow information responses
4. THE MCP_Server SHALL limit array responses to configurable maximum items with pagination support
5. THE MCP_Server SHALL format responses for optimal readability in AI context

### Requirement 5

**User Story:** As a system administrator, I want proper error handling and logging, so that I can troubleshoot issues effectively

#### Acceptance Criteria

1. THE MCP_Server SHALL provide clear error messages for all API failures
2. THE MCP_Server SHALL log connection attempts and API call statistics
3. WHEN n8n API is unavailable, THE MCP_Server SHALL return appropriate service status
4. THE MCP_Server SHALL handle network timeouts gracefully with retry logic
5. THE MCP_Server SHALL validate all input parameters before making API calls