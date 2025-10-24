# Design Document

## Overview

n8n MCP Serverは、n8nワークフロー自動化プラットフォームのREST APIへの効率的なアクセスを提供するModel Context Protocol準拠のサーバーです。既存のソリューションの課題である冗長な出力を解決し、AIコンテキストに最適化された簡潔で構造化された応答を提供します。

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MCP Client    │◄──►│  n8n MCP Server │◄──►│    n8n API      │
│   (AI Model)    │    │                 │    │   (REST API)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

```
n8n MCP Server
├── MCP Protocol Layer
│   ├── Tool Registration
│   ├── Request Handling
│   └── Response Formatting
├── n8n API Client
│   ├── Authentication Manager
│   ├── HTTP Client
│   └── Rate Limiter
├── Data Processing Layer
│   ├── Response Optimizer
│   ├── Context Minimizer
│   └── Pagination Handler
└── Configuration & Logging
    ├── Config Manager
    ├── Error Handler
    └── Logger
```

## Components and Interfaces

### 1. MCP Protocol Layer

**MCPServer Class**
- Implements MCP protocol specification
- Registers available tools with n8n API
- Handles incoming tool requests
- Formats responses according to MCP standards

**Available Tools:**
- `list_workflows` - ワークフロー一覧取得
- `get_workflow` - 特定ワークフローの詳細取得
- `create_workflow` - 新規ワークフロー作成
- `update_workflow` - ワークフロー更新
- `delete_workflow` - ワークフロー削除
- `activate_workflow` - ワークフロー有効化
- `deactivate_workflow` - ワークフロー無効化

### 2. n8n API Client

**N8nApiClient Class**
```typescript
interface N8nApiClient {
  authenticate(credentials: AuthCredentials): Promise<boolean>
  getWorkflows(options?: ListOptions): Promise<WorkflowSummary[]>
  getWorkflow(id: string): Promise<WorkflowDetail>
  createWorkflow(workflow: WorkflowDefinition): Promise<WorkflowSummary>
  updateWorkflow(id: string, workflow: WorkflowDefinition): Promise<WorkflowSummary>
  deleteWorkflow(id: string): Promise<boolean>
  setWorkflowActive(id: string, active: boolean): Promise<boolean>
}
```

**AuthCredentials Interface**
```typescript
interface AuthCredentials {
  baseUrl: string
  apiKey?: string
  email?: string
  password?: string
}
```

### 3. Data Processing Layer

**ResponseOptimizer Class**
- 不要なフィールドを除去
- ネストした構造を平坦化
- 配列の長さを制限
- 可読性を向上させるフォーマット

**ContextMinimizer Class**
- 実行ログの除外
- メタデータの最小化
- 重複情報の削除
- サイズ制限の適用

### 4. Configuration Management

**Config Interface**
```typescript
interface ServerConfig {
  n8n: {
    baseUrl: string
    credentials: AuthCredentials
    timeout: number
    retryAttempts: number
  }
  mcp: {
    maxResponseSize: number
    defaultPageSize: number
    verboseMode: boolean
  }
  logging: {
    level: string
    enableApiStats: boolean
  }
}
```

## Data Models

### WorkflowSummary (Optimized)
```typescript
interface WorkflowSummary {
  id: string
  name: string
  active: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  nodeCount: number
}
```

### WorkflowDetail (Optimized)
```typescript
interface WorkflowDetail {
  id: string
  name: string
  active: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  nodes: NodeSummary[]
  connections: ConnectionSummary
  settings?: WorkflowSettings
}
```

### NodeSummary (Minimized)
```typescript
interface NodeSummary {
  id: string
  name: string
  type: string
  position: [number, number]
  disabled?: boolean
}
```

## Error Handling

### Error Categories
1. **Authentication Errors** - 認証失敗、無効なクレデンシャル
2. **API Errors** - n8n APIからのエラーレスポンス
3. **Network Errors** - 接続タイムアウト、ネットワーク障害
4. **Validation Errors** - 無効な入力パラメータ
5. **Rate Limiting** - API制限超過

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### Retry Strategy
- 指数バックオフによる再試行
- 最大3回の再試行
- ネットワークエラーのみ再試行対象
- 認証エラーは即座に失敗

## Testing Strategy

### Unit Testing
- 各コンポーネントの独立したテスト
- モックを使用したn8n API呼び出しのテスト
- エラーハンドリングのテスト

### Integration Testing
- 実際のn8n APIとの統合テスト
- MCP プロトコルの準拠性テスト
- レスポンス最適化の検証

### Performance Testing
- 大量のワークフローでのレスポンス時間測定
- メモリ使用量の監視
- コンテキストサイズの最適化検証

## Technology Stack

### Core Dependencies
- **@modelcontextprotocol/sdk** - 公式MCP SDK（stdio/http両対応）
- **axios** - HTTP クライアント（n8n API呼び出し用）
- **zod** - スキーマ検証とTypeScript型生成
- **commander** - CLI実装
- **winston** - 構造化ログ

### Development Environment
- **Node.js LTS 22.10.0** - ランタイム環境
- **pnpm** - パッケージマネージャ
- **TypeScript 5.x** - 型安全性とコンパイル
- **tsx** - TypeScript実行環境

## Implementation Considerations

### Security
- API キーの安全な保存
- HTTPS通信の強制
- 入力値の検証とサニタイゼーション

### Performance
- レスポンスキャッシュの実装
- 並列API呼び出しの最適化
- メモリ効率的なデータ処理

### Maintainability
- TypeScriptによる型安全性
- 明確なインターフェース定義
- 包括的なログ出力

### Extensibility
- プラグイン可能なレスポンス最適化
- 設定可能なフィールドフィルタリング
- カスタムツールの追加サポート