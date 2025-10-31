# 詳細仕様書

## 機能要件

### 機能1: サンプルワークフロー検索 (search_official_samples)
- **概要**: キーワード、ノードタイプ、タグでn8n公式サンプルを検索する
- **優先度**: High
- **実装Phase**: Phase 2
- **ユースケース**:
  - **アクター**: AIアシスタント（Claude Code）、またはMCPクライアント
  - **前提条件**: サンプルデータがキャッシュまたはソースから取得可能
  - **基本フロー**:
    1. ユーザーが検索クエリ（例: "slack notification"）を指定
    2. MCPサーバーがキャッシュを確認
    3. キャッシュがない場合、サンプルソースからデータ取得
    4. クエリに基づいてサンプルをフィルタリング
    5. 検索結果（サンプルサマリーのリスト）を返す
  - **代替フロー**:
    - サンプルソースへのアクセスに失敗した場合、キャッシュデータのみで検索
    - 検索結果が0件の場合、空の配列と適切なメッセージを返す
  - **事後条件**: 検索結果がユーザーに返される
- **入力**:
  - `query` (string, optional): 検索キーワード（タイトル、説明、ノード名を検索）
  - `nodeType` (string, optional): 特定のノードタイプでフィルタリング（例: "n8n-nodes-base.slack"）
  - `tags` (string[], optional): タグでフィルタリング
  - `limit` (number, optional): 結果の最大件数（デフォルト: 20、最大: 100）
  - `offset` (number, optional): ページネーション用オフセット（デフォルト: 0）
- **出力**:
  - `{ success, message, data: { count, samples: [{ id, title, description, tags, nodeCount }] } }`
  - 常に完全なサンプルサマリーを返す（rawオプションなし）
- **ビジネスルール**:
  - 検索は大文字小文字を区別しない
  - 複数のフィルター条件はAND条件で結合
  - Fuse.jsによるファジー検索を使用（typo対応、スコアリング機能）
- **バリデーション**:
  - `limit`: 1〜100の範囲
  - `offset`: 0以上
  - `nodeType`: 有効なn8nノードタイプ形式（n8n-nodes-base.xxx）を厳密に検証

### 機能2: サンプルワークフロー詳細取得 (get_official_sample)
- **概要**: 特定のサンプルIDを指定して、完全なワークフロー定義とメタデータを取得
- **優先度**: High
- **実装Phase**: Phase 2
- **ユースケース**:
  - **アクター**: AIアシスタント（Claude Code）
  - **前提条件**: サンプルIDが有効
  - **基本フロー**:
    1. ユーザーがサンプルID（例: "slack-notification-on-error"）を指定
    2. MCPサーバーがキャッシュを確認
    3. キャッシュにない場合、サンプルソースから詳細を取得
    4. ワークフローJSON（nodes, connections, settings）とメタデータを返す
  - **代替フロー**:
    - サンプルIDが存在しない場合、404エラーを返す
    - サンプルソースへのアクセスに失敗した場合、エラーを返す
  - **事後条件**: サンプルの完全な定義がユーザーに返される
- **入力**:
  - `id` (string, required): サンプルID
- **出力**:
  - `{ success, message, data: OfficialSample }` - 完全なワークフロー定義 + 全メタデータ
  - 常に完全なデータを返す（rawオプションなし）
- **ビジネスルール**:
  - サンプルIDは一意
  - ID形式はPhase 1の調査で決定（n8n.io APIの仕様に依存）
- **バリデーション**:
  - `id`: 必須、空文字列不可

### 機能3: サンプルワークフローインポート (import_official_sample)
- **概要**: 検索したサンプルを直接n8nインスタンスにワークフローとして作成
- **優先度**: High
- **実装Phase**: Phase 3
- **ユースケース**:
  - **アクター**: AIアシスタント（Claude Code）
  - **前提条件**:
    - サンプルIDが有効
    - n8n APIに接続可能
  - **基本フロー**:
    1. ユーザーがサンプルIDとオプションのワークフロー名を指定
    2. MCPサーバーが`get_official_sample`でサンプル詳細を取得
    3. `create_workflow` APIを使用してn8nにワークフローを作成
    4. 作成されたワークフローIDを返す
  - **代替フロー**:
    - サンプルIDが無効な場合、エラーを返す
    - ワークフロー作成に失敗した場合、エラーメッセージを返す
  - **事後条件**: n8nインスタンスに新しいワークフローが作成される
- **入力**:
  - `sampleId` (string, required): インポートするサンプルのID
  - `workflowName` (string, optional): 作成するワークフローの名前（未指定の場合、サンプルタイトルを使用）
  - `active` (boolean, optional): ワークフローをアクティブにするか（デフォルト: false）
- **出力**:
  - `{ success, message, data: { workflowId, name, active } }`
- **ビジネスルール**:
  - サンプルのワークフロー定義をそのまま使用
  - ワークフロー名の重複は許可（n8nが自動的に番号を付ける）
- **バリデーション**:
  - `sampleId`: 必須、有効なサンプルID
  - `workflowName`: Phase 1でn8n API仕様を調査して文字数制限を決定

## 非機能要件

### セキュリティ
- **データ検証**:
  - 外部ソースから取得したサンプルデータの基本的な型チェック（INode[], IConnections形式の確認）
  - 悪意のあるワークフロー定義の検出は不要（n8n公式ソースを信頼）
- **認証・認可**:
  - n8n APIへのアクセスは既存の認証機構を使用
  - n8n.io APIに認証が必要かはPhase 1で調査（必要な場合は環境変数OFFICIAL_SAMPLE_API_KEYで管理）
- **監査ログ**:
  - サンプルインポート機能の実行ログを記録

## データ要件

### サンプルデータモデル
```typescript
interface OfficialSample {
  id: string;                    // 一意のサンプルID
  title: string;                 // サンプルタイトル
  description: string;           // サンプルの説明
  workflow: {                    // ワークフロー定義
    nodes: INode[];
    connections: IConnections;
    settings?: IWorkflowSettings;
  };
  metadata: {
    author?: string;             // 作成者（通常は"n8n team"など）
    tags: string[];              // タグ（例: ["slack", "notification", "error-handling"]）
    createdAt?: string;          // 作成日時
    updatedAt?: string;          // 更新日時
    difficulty?: string;         // 難易度（Phase 1でn8n.io APIのレスポンス形式を確認）
    usedNodes: string[];         // 使用されているノードタイプのリスト
  };
  sourceUrl?: string;            // サンプルの元URL
}
```

**注記**:
- `difficulty`、`author`、その他のメタデータフィールドはPhase 1の調査でn8n.io APIのレスポンス形式を確認して決定

### データ保持期間
- **キャッシュTTL**: 24時間
- **キャッシュストレージ**: メモリ内（node-cache使用、プロセス再起動で消失）

### データ移行要件
- 既存データへの影響なし（新規機能のため）

## インターフェース要件

### 外部システム連携

#### n8n公式サンプルソース
- **データソース**: n8n.io公式API
  - Phase 1で存在確認とエンドポイント仕様を調査
  - 認証要件の調査（API Keyが必要か）
  - レスポンス形式の確認
  - 代替案（APIが存在しない場合）: スクレイピングまたはGitHub API

#### n8n API（インポート機能実装時）
- 既存の`N8nApiClientImpl`を使用
- `createWorkflow()`メソッドを呼び出し

### API仕様概要

#### search_official_samples
```json
{
  "name": "search_official_samples",
  "description": "n8n公式サンプルワークフローを検索します",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "検索キーワード" },
      "nodeType": { "type": "string", "description": "ノードタイプでフィルタリング" },
      "tags": { "type": "array", "items": { "type": "string" } },
      "limit": { "type": "number", "minimum": 1, "maximum": 100, "default": 20 },
      "offset": { "type": "number", "minimum": 0, "default": 0 }
    }
  }
}
```

#### get_official_sample
```json
{
  "name": "get_official_sample",
  "description": "特定の公式サンプルワークフローの詳細を取得します",
  "inputSchema": {
    "type": "object",
    "properties": {
      "id": { "type": "string", "description": "サンプルID" }
    },
    "required": ["id"]
  }
}
```

#### import_official_sample
```json
{
  "name": "import_official_sample",
  "description": "公式サンプルをn8nインスタンスにインポートします",
  "inputSchema": {
    "type": "object",
    "properties": {
      "sampleId": { "type": "string", "description": "サンプルID" },
      "workflowName": { "type": "string", "description": "ワークフロー名" },
      "active": { "type": "boolean", "default": false }
    },
    "required": ["sampleId"]
  }
}
```

### データフォーマット
- 入力: JSON
- 出力: MCPToolResponse形式（既存のツールと同じ）
- ワークフロー定義: n8n標準のJSON形式
