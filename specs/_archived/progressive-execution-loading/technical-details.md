# 技術詳細ドキュメント

## ⚠️ 設計方針：AIエージェント最適化

**このツールはAIエージェントが段階的にデータを取得する設計**

- **ステートフル通信**: MCPプロトコルのステートフル特性を活用し、AIエージェントが複数回のツール呼び出しで段階的にデータを深掘り
- **ガイダンス駆動**: 各ツールのレスポンスに `_guidance` フィールドを含め、AIエージェントに次のアクションを提示
- **トークン効率**: 各ツールのレスポンスサイズを制限し、MCPレスポンス制限（25,000 tokens）内に収める

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Code (AI)                      │
└────────────────────┬────────────────────────────────────┘
                     │ MCP Protocol
                     │
┌────────────────────▼────────────────────────────────────┐
│              MCP Server (n8n-mcp-server)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Tool Layer (RawTool Pattern)            │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │  GetExecutionTool (Phase 1 - 拡張)       │   │   │
│  │  │  - ExecutionFormatter                     │   │   │
│  │  │  - formatSummary()                        │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │  GetExecutionByNodeTool (Phase 2 - 新規) │   │   │
│  │  │  - NodeExecutionFormatter                 │   │   │
│  │  │  - formatNodeExecution()                  │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Response Layer (ToolResponseBuilder)     │   │
│  │  - createExecutionSummaryResponse()              │   │
│  │  - createExecutionByNodeResponse()               │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │        Client Layer (N8nApiClientImpl)           │   │
│  │  - getExecution(id, includeData)                 │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS (REST API)
                     │
┌────────────────────▼────────────────────────────────────┐
│                    n8n Server                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  GET /api/v1/executions/:id                      │   │
│  │  - Returns ExecutionDetailInternal               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 技術スタック

- **言語**: TypeScript 5.x
- **ランタイム**: Node.js（`volta` でバージョン管理）
- **MCPライブラリ**: `@modelcontextprotocol/sdk` (既存)
- **HTTPクライアント**: `axios` (既存)
- **スキーマバリデーション**: `zod` (既存)
- **ユーティリティ**: `remeda` (既存)
- **テスト**: `vitest` (既存)

### インフラ構成

- **デプロイ形態**: Claude Code環境内でのローカル実行
- **通信プロトコル**:
  - MCP: stdio transport (デフォルト) または HTTP transport
  - n8n API: HTTPS (TLS 1.2以上)
- **認証**: n8n APIキー（環境変数 `N8N_API_KEY`）

---

## 技術選定

### 採用技術とその理由

#### 1. RawTool パターン（既存）
- **理由**:
  - 既存の実装パターンに準拠
  - `executeCore()` と `formatResponse()` の分離により、ビジネスロジックとレスポンス生成を明確に分離
  - `raw` フラグの自動抽出により、コードの重複を削減

#### 2. Zod スキーマバリデーション（既存）
- **理由**:
  - TypeScriptの型安全性を保ちつつ、ランタイムバリデーションを実行
  - MCPツールのinputSchemaとして直接利用可能
  - エラーメッセージが明確で、デバッグしやすい

#### 3. Remeda ユーティリティライブラリ（既存）
- **理由**:
  - TypeScript-first設計により型推論が強力
  - Tree-shakableで最小限のバンドルサイズ
  - `pickBy` などの関数型ユーティリティが利用可能

#### 4. Template Method パターン（既存）
- **理由**:
  - ToolResponseBuilderで `createResponse<TRaw, TMinimal>()` を使用
  - raw/minimal レスポンスのロジックを統一
  - コードの重複を削減

### 代替案との比較

#### キャッシング機構の有無
- **採用案**: キャッシングなし（将来的な拡張として検討）
- **理由**:
  - スコープを最小限に保つ（MVP優先）
  - キャッシュの有効期限、無効化戦略が複雑
  - n8n API負荷は許容範囲内と想定
- **代替案**: Redisやin-memoryキャッシュの導入
  - メリット: API呼び出し削減、レイテンシー改善
  - デメリット: 実装コスト増加、データ整合性の管理が必要

#### ページネーション方式
- **採用案**: オフセットベースページネーション（`itemOffset`, `itemLimit`）
- **理由**:
  - シンプルで実装が容易
  - n8n実行データは固定されており、カーソルベースは不要
- **代替案**: カーソルベースページネーション
  - メリット: 大規模データに対して効率的
  - デメリット: 実装が複雑、n8n実行データには過剰

---

## データ設計

### データモデル

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
    nodeName: string; // ノード名（runDataのキー、AIエージェントが人間に報告する際に使用）
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


### データベーススキーマ
- MCPサーバー側ではデータを永続化しない（すべてn8n APIから取得）
- キャッシュを実装する場合（将来的な拡張）、in-memoryまたはRedisを検討

### データフロー

#### get_execution (Phase 1)
```
User → Tool.handler()
    → Tool.execute()
    → Tool.executeCore()
        → N8nApiClient.getExecution(id, includeData=true)
            → n8n API: GET /api/v1/executions/:id
            ← ExecutionDetailInternal (full data)
        ← ExecutionDetailInternal
    → Tool.formatResponse(data, raw=false)
        → ExecutionFormatter.formatSummary(execution)
            → calculateStatistics()
            → calculateDuration()
            → extractAvailableNodes()
            ← ExecutionSummary (500-1,000 tokens)
        → ToolResponseBuilder.createExecutionSummaryResponse(summary)
            ← MCPToolResponse<ExecutionSummary>
    ← MCPToolResponse
← ToolResponse (MCP Protocol)
```

**注意**:
- workflowNameは現状"Unknown Workflow"を返す
- 将来的にworkflow APIから取得することを検討（技術的負債）

#### get_execution_by_node (Phase 2)
```
User → Tool.execute()
    → N8nApiClient.getExecution(id, includeData=true)
        ← ExecutionDetailInternal
    → NodeExecutionFormatter.formatNodeExecution() (single node)
        → Extract node data from ExecutionDetailInternal
        ← NodeExecutionData (complete)
    → ToolResponseBuilder.createExecutionByNodeResponse()
        ← MCPToolResponse<NodeExecutionData>
← ToolResponse
```

---

## API設計

### エンドポイント一覧

MCPツールは従来のREST APIではなく、MCP Protocolに基づく。

#### get_execution
- **Tool Name**: `get_execution`
- **Description**: 実行データのサマリー情報を取得
- **Input Schema**:
  ```typescript
  z.object({
    id: z.string().describe("実行ID"),
  })
  ```
- **Response**: `MCPToolResponse<ExecutionSummary>`

#### get_execution_by_node
- **Tool Name**: `get_execution_by_node`
- **Description**: 単一ノードの実行詳細を取得
- **Input Schema**:
  ```typescript
  z.object({
    id: z.string().describe("実行ID"),
    nodeName: z.string().describe("ノード名（runDataのキー）"),
  })
  ```
- **Response**: `MCPToolResponse<NodeExecutionData>`

### リクエスト/レスポンス仕様

#### リクエストフォーマット（MCP Protocol）
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_execution_by_node",
    "arguments": {
      "id": "exec-123",
      "nodeName": "HTTP Request"
    }
  }
}
```

#### レスポンスフォーマット（MCP Protocol）
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\":true,\"message\":\"ノード実行詳細を取得しました\",\"data\":{...}}"
      }
    ]
  }
}
```

### 認証・認可

- **n8n API認証**: `X-N8N-API-KEY` ヘッダーを使用（既存の実装を利用）
- **MCP認証**: Claude Code環境内で実行されるため、追加の認証は不要

---

## セキュリティ

### セキュリティ要件

1. **APIキー管理**
   - 環境変数 `N8N_API_KEY` で管理
   - コードにハードコーディングしない
   - `.env` ファイルは `.gitignore` に含める

2. **通信の暗号化**
   - n8n API通信はHTTPS（TLS 1.2以上）を使用
   - 証明書検証を有効にする

3. **入力バリデーション**
   - Zodスキーマによる厳格なバリデーション
   - SQLインジェクション、XSS対策（n8n API側で実施）
   - パラメータ上限値の設定（`nodeIds` 最大10個など）

4. **エラーハンドリング**
   - エラーメッセージに機密情報を含めない
   - スタックトレースは開発環境のみ表示
   - n8n APIエラーは適切に変換して返す

### 実装方針

#### 入力バリデーション
```typescript
// get_execution_by_node の例
getInputSchema() {
  return z.object({
    id: z.string().min(1).describe("実行ID"),
    nodeName: z.string().describe("ノード名（runDataのキー）"),
  });
}
```

#### エラーハンドリング
```typescript
try {
  const execution = await this.context.n8nClient.getExecution(args.id, true);
  // ...
} catch (error) {
  if (error instanceof AxiosError && error.response?.status === 404) {
    throw new Error(`Execution '${args.id}' not found`);
  }
  throw new Error(`Failed to fetch execution: ${error.message}`);
}
```

---

## 制約条件

### 技術的制約

1. **MCPレスポンス制限**
   - 各ツールのレスポンスは25,000 tokens以内に収める必要がある
   - 目標サイズ:
     - `get_execution`: 500-1,000 tokens
     - `get_execution_by_node`: ノード1つ分のデータ（可変、通常は数千tokens）

2. **n8n API制約**
   - **確定**: `GET /api/v1/executions/:id` は部分取得をサポートしない
   - 実装: 全データを取得（`includeData=true`）し、クライアント側でフィルタリング
   - **確定**: runDataのキーは`nodeName`（ユーザー定義名）を使用

3. **TypeScript型安全性**
   - `any` 型の使用は禁止
   - `unknown` 型を使用し、必要に応じて型ガードを実装

---

## 実装計画

### Phase 1: 既存ツールの改善

#### 1.1 ExecutionFormatter の実装
**ファイル**: `src/formatters/execution-formatter.ts`

```typescript
export class ExecutionFormatter {
  formatSummary(execution: ExecutionDetailInternal): ExecutionSummary {
    return {
      id: execution.id,
      workflowId: execution.workflowId,
      workflowName: "Unknown Workflow",  // 将来的にworkflow APIから取得
      status: execution.status,
      startedAt: execution.startedAt,
      stoppedAt: execution.stoppedAt,
      duration: this.calculateDuration(execution),
      statistics: this.calculateStatistics(execution),
      availableNodes: this.extractAvailableNodes(execution),
      _guidance: {
        message: "Use get_execution_by_node tool to fetch detailed data for a specific node",
        example: `get_execution_by_node(id: '${execution.id}', nodeName: 'HTTP Request')`,
      },
    };
  }

  private calculateStatistics(execution: ExecutionDetailInternal) {
    const nodeData = execution.data?.resultData?.runData ?? {};
    const nodeIds = Object.keys(nodeData);

    return {
      totalNodes: nodeIds.length,
      executedNodes: nodeIds.length,
      successfulNodes: nodeIds.filter((id) => !nodeData[id].error).length,
      failedNodes: nodeIds.filter((id) => nodeData[id].error).length,
      totalItemsProcessed: this.calculateTotalItems(nodeData),
    };
  }

  private extractAvailableNodes(execution: ExecutionDetailInternal): Array<{ nodeName: string, nodeType: string, status: "success" | "error" }> {
    const nodeData = execution.data?.resultData?.runData ?? {};
    return Object.keys(nodeData).map(nodeName => ({
      nodeName, // runDataのキーはnodeName（ユーザー定義名）
      nodeType: nodeData[nodeName].node?.type ?? "unknown",
      status: nodeData[nodeName].error ? "error" : "success",
    }));
  }

  private calculateDuration(execution: ExecutionDetailInternal): number | undefined {
    if (!execution.startedAt || !execution.stoppedAt) {
      return undefined;
    }
    return new Date(execution.stoppedAt).getTime() - new Date(execution.startedAt).getTime();
  }

  private calculateTotalItems(nodeData: Record<string, unknown>): number {
    return Object.values(nodeData).reduce((total, node) => {
      const items = (node as { data?: { main?: unknown[][] } }).data?.main?.[0] ?? [];
      return total + items.length;
    }, 0);
  }
}
```

#### 1.2 get-execution-tool.ts の拡張
**ファイル**: `src/tools/implementations/get-execution-tool.ts`

```typescript
export class GetExecutionTool extends BaseTool<GetExecutionArgs> {
  readonly name = "get_execution";
  readonly description = "Get execution summary";

  getInputSchema() {
    return z.object({
      id: z.string().describe("実行ID"),
    });
  }

  async execute(args: GetExecutionArgs): Promise<unknown> {
    const execution = await this.context.n8nClient.getExecution(args.id, true);

    const formatter = new ExecutionFormatter();
    const summary = formatter.formatSummary(execution);

    return this.context.responseBuilder.createExecutionSummaryResponse(summary);
  }
}
```

#### 1.3 ToolResponseBuilder の拡張
**ファイル**: `src/formatters/tool-response-builder.ts`

```typescript
createExecutionSummaryResponse(summary: ExecutionSummary): MCPToolResponse<ExecutionSummary> {
  return this.createResponse(
    "実行サマリーを取得しました",
    summary,
    summary, // minimal = raw (サマリー自体が軽量)
    false
  );
}
```

---

### Phase 2: get_execution_by_node実装

#### 2.1 NodeExecutionFormatter の実装
**ファイル**: `src/formatters/node-execution-formatter.ts`

```typescript
export class NodeExecutionFormatter {
  formatNodeExecution(
    execution: ExecutionDetailInternal,
    nodeName: string
  ): NodeExecutionData | null {
    const nodeData = execution.data?.resultData?.runData?.[nodeName];
    if (!nodeData) {
      return null;
    }

    const inputItems = (nodeData as { data?: { main?: unknown[][] } }).data?.main?.[0] ?? [];
    const outputItems = (nodeData as { data?: { main?: unknown[][] } }).data?.main?.[0] ?? [];

    return {
      executionId: execution.id,
      nodeName, // runDataのキー
      nodeType: (nodeData as { node?: { type?: string } }).node?.type ?? "unknown",
      status: (nodeData as { error?: unknown }).error ? "error" : "success",
      executionTime: (nodeData as { executionTime?: number }).executionTime ?? 0,
      startTime: (nodeData as { startTime?: string }).startTime ?? "",
      endTime: (nodeData as { endTime?: string }).endTime ?? "",
      input: {
        items: inputItems,
      },
      output: {
        items: outputItems,
      },
      parameters: (nodeData as { node?: { parameters?: Record<string, unknown> } }).node?.parameters ?? {},
      error: (nodeData as { error?: unknown }).error ?? null,
    };
  }
}
```

#### 2.2 GetExecutionByNodeTool の実装
**ファイル**: `src/tools/implementations/get-execution-by-node-tool.ts`

```typescript
export class GetExecutionByNodeTool extends BaseTool<GetExecutionByNodeArgs> {
  readonly name = "get_execution_by_node";
  readonly description = "Get detailed execution data for a single node";

  getInputSchema() {
    return z.object({
      id: z.string().describe("実行ID"),
      nodeName: z.string().describe("ノード名（runDataのキー）"),
    });
  }

  async execute(args: GetExecutionByNodeArgs): Promise<unknown> {
    // 1. 実行データ全体を取得
    const execution = await this.context.n8nClient.getExecution(args.id, true);

    // 2. 指定ノードのデータを抽出
    const nodeFormatter = new NodeExecutionFormatter();
    const nodeData = nodeFormatter.formatNodeExecution(execution, args.nodeName);

    if (!nodeData) {
      throw new Error(`Node '${args.nodeName}' not found in execution '${args.id}'`);
    }

    return this.context.responseBuilder.createExecutionByNodeResponse(nodeData);
  }
}
```

---

### Phase 3: ツール登録と統合テスト

#### 3.1 ToolRegistry の更新
**ファイル**: `src/server/tool-registry.ts`

```typescript
// ToolRegistry.initialize()に追加
const tools: Tool[] = [
  // ... 既存ツール
  new GetExecutionTool(context), // 既存（改善版）
  new GetExecutionByNodeTool(context), // 新規
];
```

#### 3.2 統合テストの実装
**ファイル**: `src/tools/implementations/__tests__/execution-tools.integration.test.ts`

```typescript
describe("Execution Tools Integration", () => {
  it("should retrieve execution summary, then node details (AI agent workflow)", async () => {
    // AIエージェントが段階的にデータを取得するシナリオ

    // 1. AIエージェントがサマリー取得
    const summary = await getExecutionTool.execute({ id: "exec-123" });
    const firstNode = summary.data.availableNodes[0]; // { nodeName: "HTTP Request", nodeType: "n8n-nodes-base.httpRequest", status: "success" }
    expect(firstNode.nodeName).toBe("HTTP Request");

    // 2. AIエージェントがノード詳細取得
    const nodeDetail = await getExecutionByNodeTool.execute({
      id: "exec-123",
      nodeName: firstNode.nodeName,
    });
    expect(nodeDetail.data.error).toBeNull();
    expect(nodeDetail.data.output.items.length).toBe(100);

    // 3. エラーノードの詳細取得
    const errorNode = summary.data.availableNodes.find(n => n.status === 'error');
    if (errorNode) {
      const errorDetail = await getExecutionByNodeTool.execute({
        id: "exec-123",
        nodeName: errorNode.nodeName,
      });
      expect(errorDetail.data.error).not.toBeNull();
      expect(errorDetail.data.error.message).toContain("ETIMEDOUT");
    }
  });
});
```

---

## テスト戦略

### ユニットテスト

1. **ExecutionFormatter**
   - `formatSummary()` のテスト
   - 統計情報計算のテスト
   - 期間計算のテスト

2. **NodeExecutionFormatter**
   - `formatNodeExecution()` のテスト
   - 全データ取得のテスト
   - エラーノードの処理テスト

3. **GetExecutionByNodeTool**
   - 正常系: 単一ノード取得
   - 異常系: 存在しないノード、バリデーションエラー

### 統合テスト

1. **2ツール連携シナリオ**
   - get_execution → get_execution_by_node（エラー調査）
   - エラーハンドリングの確認

2. **レスポンスサイズ検証**
   - 各ツールのレスポンスが制限内に収まることを確認

### E2Eテスト

1. **実際のn8nサーバーとの通信テスト**
   - 環境変数 `N8N_URL`, `N8N_API_KEY` を設定
   - 実行データ取得の動作確認

---

## パフォーマンス考慮事項

### レスポンスサイズ最適化

1. **get_execution**:
   - サマリー形式で約500-1,000 tokens（90%削減）
   - 必要最小限の情報のみ返す

2. **get_execution_by_node**:
   - 単一ノードの完全データを返す
   - ノード単位で分割取得することでトークン数を制御

### n8n API負荷削減

- **現状**: キャッシングなし（毎回API呼び出し）
- **将来的な拡張**:
  - 案A: In-memoryキャッシュ（有効期限: 5分）
  - 案B: Redisキャッシュ（分散環境対応）
  - 案C: オプションで制御可能にする

### レイテンシー最適化

- **現状**: 段階的取得により複数回のツール呼び出しが必要
- **トレードオフ**: MCPレスポンス制限を遵守するための必要なコスト
- **緩和策**: キャッシング機構の導入（将来的な拡張）

---

## 明確化された仕様（技術詳細）

### 1. n8n API仕様

#### 1-1. 部分取得APIの有無
- **確定**: n8n APIに特定ノードのみを取得するエンドポイントは**存在しない**
- **実装**: `GET /api/v1/executions/:id?includeData=true` で全データを取得し、クライアント側でフィルタリング
- **根拠**: n8nソースコード（`packages/cli/src/executions/`）およびコミュニティフォーラムの調査結果

#### 1-2. ノード識別方法
- **確定**: n8n実行データの`runData`キーは`nodeName`（ユーザー定義名）を使用する
- **根拠**: n8nソースコード全体で`runData[nodeName]`パターンを使用（`packages/core/src/execution-engine/workflow-execute.ts`など）
- **実装方針**:
  - `availableNodes`に nodeName, nodeType, status を含める
  - AIエージェントは`nodeName`をツール呼び出しパラメータとして使用
  - **制約**: 同じ名前のノードが複数存在する場合、最初のノードが取得される

### 2. キャッシング戦略
- **結論**: キャッシュしない
- **理由**: 常に最新データを取得し、データ整合性を優先
- **将来的な拡張**: Phase 4以降でキャッシング機構の検討

### 3. エラーハンドリング
- **結論**: 存在しない `nodeName` が指定された場合はエラーを返す（厳格）
- **実装**:
  - `get_execution` のレスポンスに `availableNodes` リスト（nodeName, nodeType, status）を含める
  - 存在しない `nodeName` が指定された場合、エラーを返す
  - エラーメッセージ例: `Error: Node 'HTTP Request' not found in execution 'exec-123'`

### 4. パラメータ上限値
- **maxItems**: 上限なし
- **itemLimit**: 上限なし
- **理由**: AIエージェントがMCPレスポンス制限（25,000 tokens）内に収める責任を持つ
- **AIエージェントの責務**: 自身の判断で適切な値を設定
