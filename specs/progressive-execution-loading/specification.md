# 詳細仕様書

## ⚠️ 最重要事項：AIエージェント専用ツール

**このツールはAIエージェント専用ツールである**

- **対象ユーザー**: AIエージェント（Claude Code等のMCPクライアント）のみ
- **想定利用フロー**:
  1. 人間ユーザーがAIエージェントに自然言語で指示（例: "実行123のエラー原因を調べて"）
  2. AIエージェントが適切なツール（`get_execution` → `get_execution_by_node`）を選択・実行
  3. AIエージェントが人間ユーザーに結果を自然言語で報告
- **設計思想**: MCPプロトコルのステートフル通信を活用し、AIエージェントが段階的にデータを深掘りできる設計

## 機能要件

### 機能1: get_execution（既存ツールの拡張）
- **概要**: 実行データのサマリー情報を取得し、AIエージェントが効率的にデータを取得できるようにする
- **優先度**: High
- **実装Phase**: Phase 1

- **ユースケース**:
  - **アクター**: AIエージェント（Claude Code等のMCPクライアント）
  - **前提条件**:
    - n8n実行IDが有効である
    - n8n APIへの認証が完了している
    - 人間ユーザーがAIエージェントに実行状態の確認を依頼している
  - **基本フロー**:
    1. 人間ユーザーが「実行123の状態を確認して」とAIエージェントに依頼
    2. AIエージェントが `get_execution(id: "exec-123")` を呼び出す（`raw=false` or 未指定）
    3. ツールはn8n APIから実行データ全体を取得
    4. ExecutionFormatterがサマリー形式に変換
    5. サマリーレスポンス（500-1,000 tokens）を返す
    6. AIエージェントが人間ユーザーに結果を報告（自然言語）
  - **事後条件**:
    - AIエージェントは実行の概要（ステータス、ノード数、統計情報）を把握
    - 次のアクション（`get_execution_by_node`）のガイダンス（`_guidance`フィールド）を受け取る
    - 人間ユーザーに実行状態が自然言語で報告される

- **入力**:
  - `id` (string, required): 実行ID

- **出力**:
  ```typescript
  {
    success: true,
    message: "実行サマリーを取得しました",
    data: {
      id: string,
      workflowId: string,
      workflowName: string,
      status: "success" | "error" | "waiting" | "running" | "canceled",
      startedAt: string,
      stoppedAt: string,
      duration: number, // milliseconds
      statistics: {
        totalNodes: number,
        executedNodes: number,
        successfulNodes: number,
        failedNodes: number,
        totalItemsProcessed: number
      },
      availableNodes: Array<{ nodeName: string, nodeType: string, status: "success" | "error" }>,
      _guidance: {
        message: string,
        example: string
      }
    }
  }
  ```

- **ビジネスルール**:
  - サマリー形式を返す
  - レスポンスサイズは1,000 tokens以内に抑える

- **バリデーション**:
  - `id` は必須

---

### 機能2: get_execution_by_node（新規）
- **概要**: 単一ノードの実行詳細を取得する（ページネーション付き）
- **優先度**: High
- **実装Phase**: Phase 2

- **ユースケース**:
  - **アクター**: AIエージェント（Claude Code等のMCPクライアント）
  - **前提条件**:
    - 実行IDが有効である
    - Phase 1（`get_execution`）が完了している
    - 人間ユーザーがAIエージェントに特定ノードの詳細確認を依頼している
  - **基本フロー**:
    1. 人間ユーザーが「HTTP Requestノードのエラーを調べて」とAIエージェントに依頼
    2. AIエージェントが `get_execution_by_node(id: "exec-123", nodeId: "node-uuid-1")` を呼び出す
    3. ツールはn8n APIから実行データ全体を取得
    4. NodeExecutionFormatterが指定されたノードのデータを抽出・整形
    5. ノードの完全情報（error、parameters、executionTime、input/output）を返す
    6. AIエージェントが人間ユーザーに結果を報告（自然言語）
    7. 複数ノードが必要な場合、AIエージェントは複数回このツールを呼び出す
  - **代替フロー**:
    - 指定されたノードIDが存在しない場合: エラーを返す
  - **事後条件**:
    - AIエージェントは指定ノードの詳細情報（エラー詳細含む）を取得
    - 人間ユーザーにノードの詳細情報が自然言語で報告される

- **入力**:
  - `id` (string, required): 実行ID
  - `nodeName` (string, required): 取得したいノード名（runDataのキー）

- **出力**:
  ```typescript
  {
    success: true,
    message: "ノード 'NodeName' の実行詳細を取得しました",
    data: {
      executionId: string,
      nodeName: string,
      nodeType: string,
      status: "success" | "error",
      executionTime: number, // milliseconds
      startTime: string,
      endTime: string,
      input: {
        items: unknown[]
      },
      output: {
        items: unknown[]
      },
      parameters: Record<string, unknown>,
      error: unknown | null
    }
  }
  ```

- **ビジネスルール**:
  - 全ての入出力データを返す
  - 存在しないノードIDが指定された場合、エラーを返す

- **バリデーション**:
  - `id` は必須
  - `nodeName` は必須
  - 存在しない `nodeName` が指定された場合はエラーを返す

---

## 非機能要件

### セキュリティ
- **認証・認可要件**:
  - n8n APIキーによる認証を使用（既存の認証機構を利用）
  - ツール実行時に認証状態を確認
  - 認証エラーの場合、適切なエラーメッセージを返す

- **データ暗号化**:
  - n8n API通信はHTTPS（TLS 1.2以上）を使用
  - APIキーは環境変数で管理（コードにハードコーディングしない）

- **監査ログ**:
  - 実行データ取得のログを記録（n8nサーバー側の機能を利用）
  - MCPサーバー側での追加ログは不要（既存のログ機構を利用）

### 制約条件

#### 技術的制約
1. **MCPレスポンス制限**
   - Claude CodeのデフォルトMCPレスポンス制限: 25,000 tokens
   - 各ツールのレスポンスはこの制限内に収まる必要がある
   - 目標サイズ:
     - `get_execution`: 500-1,000 tokens
     - `get_execution_by_node`: 5,000-20,000 tokens（パラメータにより変動）

2. **n8n API制約**
   - 実行データ取得APIは全データを返す（部分取得は不可の可能性が高い）
   - クライアント側でのフィルタリングが必要
   - APIレート制限: n8nサーバーの設定に依存

3. **TypeScript型安全性**
   - `any` 型の使用は禁止
   - 実行データの型は `ExecutionDetailInternal` を使用
   - ノードデータの型は新たに定義する必要がある

#### ビジネス的制約
- このプロジェクトはMCPサーバーの改善であり、n8n本体の変更は含まない
- n8n APIの仕様変更は期待できない
- 既存の実行履歴ツール（`list_executions`, `get_execution`）との整合性を保つ

#### 法的・規制上の制約
- 特になし（n8n APIの利用規約に準拠）

## データ要件

### データモデル概要

#### ExecutionSummary（新規型）
```typescript
type ExecutionSummary = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error" | "waiting" | "running" | "canceled";
  startedAt: string;
  stoppedAt: string | undefined;
  duration: number | undefined; // milliseconds
  statistics: {
    totalNodes: number;
    executedNodes: number;
    successfulNodes: number;
    failedNodes: number;
    totalItemsProcessed: number;
  };
  availableNodes: Array<{
    nodeName: string; // ノード名（runDataのキー、ユーザー定義名）
    nodeType: string; // ノードタイプ（例: n8n-nodes-base.httpRequest）
    status: "success" | "error"; // ノードの実行ステータス
  }>;
  _guidance: {
    message: string;
    example: string; // 次のツール呼び出し例（nodeNameを含む）
  };
};
```

#### NodeExecutionData（新規型）
```typescript
type NodeExecutionData = {
  executionId: string;
  nodeName: string; // ノード名（runDataのキー）
  nodeType: string;
  status: "success" | "error";
  executionTime: number; // milliseconds
  startTime: string;
  endTime: string;
  input: {
    items: unknown[]; // JSONデータ（型はワークフローに依存）
  };
  output: {
    items: unknown[]; // JSONデータ（型はワークフローに依存）
  };
  parameters: Record<string, unknown>;
  error: unknown | null;
};
```

### データ保持期間
- 実行データの保持期間はn8nサーバーの設定に依存
- MCPサーバー側ではデータを保持しない（キャッシュは将来的な拡張として検討）

### データ移行要件
- 既存データの移行は不要（既存の実行データをそのまま利用）

## インターフェース要件

### 外部システム連携
- **n8n REST API**:
  - エンドポイント: `GET /api/v1/executions/:id`
  - 認証: `X-N8N-API-KEY` ヘッダー
  - レスポンス: `ExecutionDetailInternal` 型のJSONデータ

### API仕様概要

#### get_execution
- **Method**: MCP Tool Call
- **Parameters**: `{ id: string }`
- **Response**: `MCPToolResponse<ExecutionSummary>`

#### get_execution_by_node
- **Method**: MCP Tool Call
- **Parameters**: `{ id: string, nodeName: string }`
- **Response**: `MCPToolResponse<NodeExecutionData>`

### データフォーマット
- すべてのレスポンスはJSON形式
- 日付はISO 8601形式（例: `2025-10-31T10:00:00Z`）
- 数値（duration, executionTime）はミリ秒単位

---

## 明確化された仕様

### 1. n8n API仕様

#### 1-1. 部分取得APIの有無
- **確定**: n8n APIに特定ノードのみを取得するエンドポイントは**存在しない**
- **実装方針**: `GET /api/v1/executions/:id?includeData=true` で全データを取得し、クライアント側でフィルタリング
  - これはn8n APIの仕様による制約
  - 参考: n8nソースコード `packages/cli/src/executions/` および公式ドキュメント

#### 1-2. ノード識別方法
- **確定**: n8n実行データの`runData`キーは`nodeName`（ユーザー定義名）を使用する
  - n8nのAPIおよびソースコード全体で `runData[nodeName]` パターンを使用
  - `get_execution` のレスポンスに `availableNodes` リスト（nodeName, nodeType, status を含む）を含める
  - AIエージェントは`nodeName`をツール呼び出しパラメータとして使用する
  - 存在しない `nodeName` が指定された場合はエラーを返す（厳格）
  - **制約**: 同じ名前のノードが複数存在する場合、最初のノードが取得される

### 2. キャッシング戦略
- **結論**: キャッシュしない
- **理由**: 常に最新データを取得し、データ整合性を優先
- **将来的な拡張**: Phase 4以降でキャッシング機構の検討

### 3. エラーハンドリング
- **結論**: 存在しない `nodeId` が指定された場合はエラーを返す（厳格）
- **実装方針**:
  - `get_execution_by_node`: 指定されたnodeIdが存在しない場合、エラーを返す
  - エラーメッセージ例: `Error: Node 'node-uuid-1' not found in execution 'exec-123'`

