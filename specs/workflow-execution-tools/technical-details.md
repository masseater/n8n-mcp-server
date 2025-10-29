# 技術詳細ドキュメント

## アーキテクチャ

### システム構成図
```
┌─────────────────┐
│   AI Agent      │
│  (Claude Code)  │
└────────┬────────┘
         │ MCP Protocol
┌────────▼────────┐
│   MCP Server    │
│  (TypeScript)   │
├─────────────────┤
│  Tool Registry  │
├─────────────────┤
│ Execution Tools │
│ ├─ list         │
│ └─ get          │
├─────────────────┤
│  n8n API Client │
└────────┬────────┘
         │ REST API v1
┌────────▼────────┐
│   n8n Server    │
│   (Instance)    │
└─────────────────┘
```

### 技術スタック
- **言語**: TypeScript 5.0+
- **ランタイム**: Node.js 18+
- **フレームワーク**:
  - MCP SDK (@modelcontextprotocol/sdk)
  - Express.js (HTTP transport)
- **ビルドツール**:
  - tsx (development)
  - tsc (production build)
- **テスト**:
  - Vitest
  - @vitest/coverage-v8
- **型検証**:
  - Zod (runtime validation)
  - TypeScript (compile-time)
- **HTTPクライアント**:
  - @hey-api/openapi-ts (generated SDK)

### インフラ構成
- **デプロイメント**: Docker対応
- **環境変数管理**: dotenv
- **ログ**: winston/pino (予定)
- **モニタリング**: 未定（将来実装）

## 技術選定

### 採用技術とその理由

| 技術 | 理由 | 代替案 |
|------|------|--------|
| TypeScript | 型安全性、IDEサポート、MCPとの互換性 | JavaScript（型安全性なし） |
| Zod | ランタイム型検証、スキーマ生成 | io-ts, yup（Zodが最もMCP互換） |
| @hey-api/openapi-ts | OpenAPI仕様からの自動生成 | 手動実装（保守性低下） |
| Vitest | 高速、TypeScript親和性 | Jest（設定複雑） |
| RawToolパターン | コンテキスト最適化、既存実装との一貫性 | 独自実装（保守性低下） |

## データ設計

### データモデル

#### ExecutionSummary型
```typescript
interface ExecutionSummary {
  id: string;                    // 実行ID
  workflowId: string;            // ワークフローID
  workflowName: string;          // ワークフロー名
  status: ExecutionStatus;       // 実行ステータス
  startedAt: string;             // 開始日時 (ISO 8601)
  stoppedAt?: string;            // 終了日時 (ISO 8601)
  executionTime?: number;        // 実行時間（ミリ秒）
  mode: ExecutionMode;           // 実行モード
  retryOf?: string;              // リトライ元の実行ID
  retrySuccessId?: string;       // リトライ成功時のID
}
```

#### ExecutionDetail型
```typescript
interface ExecutionDetail extends ExecutionSummary {
  error?: ExecutionError;        // エラー情報
  nodeExecutions: NodeExecution[]; // ノード実行情報
  data?: ExecutionData;          // 実行データ（raw=true時）
  settings?: WorkflowSettings;  // ワークフロー設定
}
```

#### NodeExecution型
```typescript
interface NodeExecution {
  nodeName: string;              // ノード名
  nodeId: string;                // ノードID
  nodeType: string;              // ノードタイプ
  status: NodeExecutionStatus;  // ノードステータス
  executionTime: number;         // 実行時間（ミリ秒）
  startTime: string;             // 開始時刻
  endTime?: string;              // 終了時刻
  error?: string;                // エラーメッセージ
  hasData?: boolean;             // データの有無
}
```

#### ExecutionStatus列挙型
```typescript
enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WAITING = 'waiting',
  RUNNING = 'running',
  CANCELED = 'canceled',
  UNKNOWN = 'unknown'
}
```

### データベーススキーマ
- 本プロジェクトではデータベースを直接使用せず、n8n APIを経由してデータ取得

### データフロー
```
1. AIからのリクエスト
   └─> MCP Server
       └─> ToolRegistry (ツール解決)
           └─> ListExecutionsTool/GetExecutionTool
               └─> executeCore() (ビジネスロジック)
                   └─> N8nApiClient
                       └─> n8n REST API
                       └─> レスポンス取得
                   └─> データ変換
               └─> formatResponse() (レスポンス整形)
                   └─> ToolResponseBuilder
                       └─> raw=true: 完全データ
                       └─> raw=false: 最小データ
           └─> MCPレスポンス
   └─> AIへ返却
```

## API設計

### n8n API エンドポイント

#### 実行履歴一覧取得
```http
GET /api/v1/executions
Headers:
  X-N8N-API-KEY: {api_key}
Query Parameters:
  workflowId?: string
  status?: success|error|waiting|running|canceled
  limit?: number (1-100)
  cursor?: string (pagination)
```

#### 実行詳細取得
```http
GET /api/v1/executions/{id}
Headers:
  X-N8N-API-KEY: {api_key}
Query Parameters:
  includeData?: boolean
```

### MCPツールインターフェース

#### list_executions
```typescript
{
  name: "list_executions",
  description: "ワークフロー実行履歴を取得",
  inputSchema: {
    workflowId?: string,
    status?: "success" | "error" | "waiting" | "running" | "canceled",
    startDate?: string,  // ISO 8601
    endDate?: string,    // ISO 8601
    limit?: number,      // 1-100
    offset?: number,
    raw?: boolean
  }
}
```

#### get_execution
```typescript
{
  name: "get_execution",
  description: "特定の実行の詳細を取得",
  inputSchema: {
    id: string,          // required
    includeData?: boolean,
    raw?: boolean
  }
}
```

### レスポンス仕様

#### 成功時レスポンス
```typescript
interface MCPToolResponse<T> {
  success: true;
  message: string;
  data: T;
}
```

#### エラーレスポンス
```typescript
interface MCPErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}
```

## セキュリティ

### セキュリティ要件
- **認証**: X-N8N-API-KEY ヘッダー必須
- **通信**: HTTPS強制（TLS 1.2以上）
- **APIキー管理**: 環境変数での管理、コードへのハードコード禁止
- **ログ**: APIキーのマスキング必須

### 実装方針
```typescript
// APIキーのマスキング例
function maskApiKey(key: string): string {
  if (key.length <= 8) return '***';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

// セキュアなエラーハンドリング
function sanitizeError(error: unknown): string {
  // APIキーや機密情報を除去
  const message = String(error);
  return message.replace(/X-N8N-API-KEY:\s*\S+/gi, 'X-N8N-API-KEY: [REDACTED]');
}
```

## パフォーマンス要件

### レスポンスタイム
- **list_executions**:
  - 目標: < 2秒（100件）
  - 最大: 5秒
  - キャッシュ: なし（リアルタイム性優先）

- **get_execution**:
  - 目標: < 1秒（データなし）
  - 目標: < 5秒（データあり）
  - 最大: 10秒

### スループット
- 同時リクエスト: 10
- リクエスト/秒: 10

### スケーラビリティ
- ページネーション実装（大量データ対応）
- ストリーミング対応（将来）

## 開発環境

### 必要なツール
```bash
# Node.js (v18以上)
node --version  # v18.0.0以上

# pnpm (パッケージマネージャー)
pnpm --version  # 8.0.0以上

# TypeScript
pnpm tsc --version  # 5.0.0以上

# n8n (ローカルテスト用)
docker pull n8nio/n8n
```

### セットアップ手順
```bash
# 1. リポジトリのクローン
git clone <repository>
cd n8n-mcp-server

# 2. 依存関係のインストール
pnpm install

# 3. 環境変数の設定
cp .env.example .env
# N8N_URL と N8N_API_KEY を設定

# 4. 型生成
pnpm run generate-types

# 5. 開発サーバー起動
pnpm run dev:http

# 6. テスト実行
pnpm test
```

### 開発用n8n環境
```bash
# Docker Composeでn8nを起動
docker-compose up -d

# n8n URL: http://localhost:5678
# APIキー: 管理画面から生成
```

## テスト戦略（TDDアプローチ）

### TDDによるテスト実装順序
1. **インターフェーステスト**: 型定義とAPIコントラクトのテスト
2. **ユニットテスト**: 個別機能の振る舞いテスト
3. **統合テスト**: コンポーネント間の連携テスト
4. **E2Eテスト**: 実環境でのエンドツーエンドテスト

### テストピラミッド（TDD版）
```
     /\        E2Eテスト（少数）
    /  \       統合テスト（中程度）
   /    \      ユニットテスト（多数）
  /______\     インターフェーステスト（基盤）
```

### テストの種類

#### ユニットテスト
- **対象**: 各ツールクラス、フォーマッター、ビルダー
- **カバレッジ目標**: 80%以上
- **ツール**: Vitest

```typescript
// TDD例: ListExecutionsToolのテスト（Red Phase）
describe('ListExecutionsTool', () => {
  // Step 1: Red - 失敗するテストを先に書く
  it('should return execution list with default parameters', async () => {
    // まだ実装が存在しないため、このテストは失敗する
    const mockClient = createMockN8nClient();
    const tool = new ListExecutionsTool({ n8nClient: mockClient });

    const result = await tool.execute({ raw: false });

    expect(result.success).toBe(true);
    expect(result.data.executions).toBeInstanceOf(Array);
  });

  // Step 2: Green - 最小限の実装でテストを通す
  // Step 3: Refactor - コードを改善
});
```

#### 統合テスト
- **対象**: n8n API連携、エンドツーエンドフロー
- **環境**: Docker上のn8nテスト環境
- **データ**: テスト用ワークフロー事前作成

```typescript
// 例: E2Eテスト
describe('E2E: Execution Tools', () => {
  it('should list and get execution details', async () => {
    // 1. ワークフロー実行
    const execution = await executeTestWorkflow();

    // 2. 実行一覧取得
    const list = await listExecutions({ workflowId: workflow.id });
    expect(list.executions).toContainEqual(
      expect.objectContaining({ id: execution.id })
    );

    // 3. 実行詳細取得
    const detail = await getExecution({ id: execution.id });
    expect(detail.status).toBe('success');
  });
});
```

#### パフォーマンステスト
- **対象**: 大量データ処理、レスポンスタイム
- **ツール**: Artillery / k6
- **指標**: p50, p95, p99レイテンシ

### カバレッジ目標
- ステートメントカバレッジ: 80%
- ブランチカバレッジ: 75%
- 関数カバレッジ: 85%
- ラインカバレッジ: 80%
