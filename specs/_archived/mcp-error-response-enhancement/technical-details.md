# 技術詳細ドキュメント

## アーキテクチャ
### システム構成図
```
┌─────────────────────────────────────────────────────────┐
│                    AIクライアント                         │
│                  (Claude Code)                          │
└───────────────────────┬─────────────────────────────────┘
                        │ MCP Protocol
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   MCPサーバー層                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              ToolRegistry                        │  │
│  │  - setupToolHandlers()                           │  │
│  │  - ツールの登録と管理                              │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    ツール層                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  BaseTool (抽象クラス)                            │  │
│  │  ┌─────────────────────────────────────────┐     │  │
│  │  │ handler(args): ToolResponse             │     │  │
│  │  │   try {                                 │     │  │
│  │  │     result = await execute(args)        │     │  │
│  │  │     return createToolResponse(result)   │     │  │
│  │  │   } catch (error) {                     │     │  │
│  │  │     logger.error(`[${name}] Error`, err)│     │  │
│  │  │     return {                            │     │  │
│  │  │       content: [{                       │     │  │
│  │  │         type: "text",                   │     │  │
│  │  │         text: error.message             │     │  │
│  │  │       }],                               │     │  │
│  │  │       isError: true                     │     │  │
│  │  │     }                                   │     │  │
│  │  │   }                                     │     │  │
│  │  └─────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  RawTool (extends BaseTool)                      │  │
│  │  - executeCore(args)                             │  │
│  │  - formatResponse(data, raw)                     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  個別ツール (10ツール)                            │  │
│  │  - UpdateWorkflowTool                            │  │
│  │  - ListWorkflowsTool                             │  │
│  │  - GetWorkflowTool                               │  │
│  │  - ... (他7ツール)                                │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                クライアント層                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  N8nApiClientImpl                                │  │
│  │  - updateWorkflow(id, data)                      │  │
│  │  - getWorkflow(id)                               │  │
│  │  - ... (他のメソッド)                              │  │
│  │                                                  │  │
│  │  エラーハンドリング（既存）:                        │  │
│  │  - handleResponse() → CustomError をthrow        │  │
│  │  - CustomError.message に適切なメッセージ         │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  n8n API                                │
└─────────────────────────────────────────────────────────┘
```

### 技術スタック
- **言語**: TypeScript 5.x
- **MCPフレームワーク**: @modelcontextprotocol/sdk
- **バリデーション**: Zod
- **テスト**: Vitest
- **ログ**: Winston（既存）
- **HTTP クライアント**: @hey-api/openapi-ts（生成されたSDK）

### インフラ構成
- **実行環境**: Node.js 20.x以上
- **トランスポート**: stdio（デフォルト）、HTTP（開発時）
- **ログ出力先**: `logs/` ディレクトリ（ファイルベース）

## 技術選定
### シンプルなエラーハンドリングの採用理由
- **採用理由**:
  - CustomErrorが既に適切なmessageプロパティを持っている
  - Zodがパラメータバリデーションを自動処理している
  - error.messageをそのまま返すだけでAIが理解可能

- **代替案との比較**:
  - **案A: ErrorMessageBuilderで複雑な分岐処理**
    - ❌ 過剰設計
    - ❌ CustomErrorのmessageを再加工する必要性がない
  - **案B: error.messageをそのまま返す（採用）**
    - ✅ シンプルで保守しやすい
    - ✅ CustomErrorの責任を尊重
    - ✅ 実装コストが低い

## データ設計
### BaseToolの更新
```typescript
// src/tools/base/base-tool.ts

export abstract class BaseTool<TArgs = Record<string, unknown>> {
  abstract readonly name: string;
  abstract readonly description: string;

  constructor(protected readonly context: ToolContext) {}

  abstract getInputSchema(): ZodSchema;
  abstract execute(args: TArgs): Promise<unknown>;

  /**
   * ツールハンドラー（エラーハンドリング追加版）
   */
  async handler(args: TArgs): Promise<ToolResponse> {
    try {
      const result = await this.execute(args);
      return createToolResponse(result);
    } catch (error) {
      // ログ出力
      logger.error(`[${this.name}] Error`, { error });

      // エラーレスポンス返却
      return {
        content: [{
          type: "text",
          text: error instanceof Error ? error.message : String(error),
        }],
        isError: true,
      };
    }
  }

  toDefinition(): ToolDefinition<TArgs> {
    return {
      name: this.name,
      description: this.description,
      inputSchema: convertToJsonSchema(this.getInputSchema()),
      handler: this.handler.bind(this),
    };
  }
}
```

### CustomErrorの型定義（更新版）
```typescript
// src/errors/custom-errors.ts

// Context型定義
export type ApiErrorContext = {
  operation: string;
  resourceType?: string;
  resourceId?: string;
  statusCode?: number;
  errorDetails?: string;
};

export type NotFoundErrorContext = {
  operation: string;
  resourceType: string;
  resourceId: string;
};

export type ValidationErrorContext = {
  field: string;
  expectedType?: string;
  receivedType?: string;
  constraint?: string;
};

// CustomErrorクラス
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly context?: ApiErrorContext,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public readonly context?: NotFoundErrorContext,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly context?: ValidationErrorContext,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'ValidationError';
  }
}
```

## API設計
### エラーレスポンスのJSON形式
MCPプロトコルでは以下のJSON-RPC形式でエラーが返される：
```json
{
  "jsonrpc": "2.0",
  "id": 123,
  "result": {
    "content": [{
      "type": "text",
      "text": "Workflow 'abc123' not found"
    }],
    "isError": true
  }
}
```

### エラーメッセージの例
```typescript
// NotFoundError
new NotFoundError(
  "Workflow 'abc123' not found",
  {
    operation: "update workflow",
    resourceType: "Workflow",
    resourceId: "abc123"
  }
);
// AIクライアントには: "Workflow 'abc123' not found"

// ApiError
new ApiError(
  "Failed to update workflow",
  400,
  {
    operation: "update workflow",
    resourceId: "abc123",
    errorDetails: "Field 'settings' is required"
  }
);
// AIクライアントには: "Failed to update workflow"

// ValidationError
new ValidationError(
  "Workflow ID is required",
  { field: "id" }
);
// AIクライアントには: "Workflow ID is required"
```

## セキュリティ
### 機密情報の除外
- **実装方法**:
  - エラーメッセージには機密情報を含めない（CustomErrorのmessageで保証）
  - ログ出力時にのみ適用（エラーメッセージには引数を含めない）

### エラーメッセージの制御
- **AI用MCPツールのため本番環境の概念は存在しない**:
  - 常に詳細なエラー情報をAIクライアントに返す
  - スタックトレースはログファイルのみに記録（AIクライアントには返さない）
  - エラーメッセージは明確で具体的に（AIが対処方法を判断できるように）

## 保守性
### CLAUDE.md への追記
エラーレスポンス仕様を以下のセクションに追加：
- **Error Handling** セクションを新規追加
- エラーレスポンス形式の例を記載
- CustomError使用時の注意点を記載

## テスト戦略
### テストの種類
1. **統合テスト** (BaseTool):
   - handler() のエラーハンドリング
   - エラーログ出力の検証

2. **E2Eテスト** (各ツール):
   - 実際のエラーシナリオ（モックされたn8nクライアント）
   - NotFoundError、ValidationError、ApiError の各ケース

### カバレッジ目標
- **統合テスト**: 90%以上（BaseTool、RawTool）
- **E2Eテスト**: 主要エラーケースをカバー（10ツール × 3エラー種別 = 30ケース）

### テストケース例
```typescript
// tests/tools/error-handling.test.ts

describe('BaseTool error handling', () => {
  it('should return error.message for NotFoundError', async () => {
    const mockClient = {
      updateWorkflow: vi.fn().mockRejectedValue(
        new NotFoundError("Workflow 'abc123' not found", {
          operation: "update workflow",
          resourceType: "Workflow",
          resourceId: "abc123"
        })
      ),
    };

    const tool = new UpdateWorkflowTool({
      n8nClient: mockClient,
      responseBuilder: new ToolResponseBuilder(/* ... */),
    });

    const response = await tool.handler({ id: "abc123", name: "Updated" });

    expect(response.isError).toBe(true);
    expect(response.content[0].text).toBe("Workflow 'abc123' not found");
  });

  it('should return error.message for ApiError', async () => {
    const mockClient = {
      updateWorkflow: vi.fn().mockRejectedValue(
        new ApiError("Failed to update workflow", 400)
      ),
    };

    const tool = new UpdateWorkflowTool({
      n8nClient: mockClient,
      responseBuilder: new ToolResponseBuilder(/* ... */),
    });

    const response = await tool.handler({ id: "123", nodes: [] });

    expect(response.isError).toBe(true);
    expect(response.content[0].text).toBe("Failed to update workflow");
  });
});
```

## 実装の優先順位
1. **Phase 1（高優先度）**:
   - BaseToolのhandler()更新（try-catch追加）
   - CustomErrorのcontext型定義厳密化
   - 統合テスト

2. **Phase 2（中優先度）**:
   - E2Eテスト追加
   - 既存テストの修正

3. **Phase 3（低優先度）**:
   - CLAUDE.md更新
   - 品質チェック

## 明確化された設計決定

### 1. エラーメッセージ制御
- **決定**: AI用MCPツールのため、本番環境の概念は存在しない
- **実装方針**: 常に詳細なエラー情報をAIクライアントに返す

### 2. ログローテーション設定
- **決定**: 現状維持（自動ローテーションなし）
- **理由**: ログファイルはユーザー自身で管理する想定

### 3. CustomError の context プロパティ型定義
- **決定**: エラー種別ごとに厳密な型定義を追加
- **実装内容**:
  ```typescript
  // ApiError
  type ApiErrorContext = {
    operation: string;
    resourceType?: string;
    resourceId?: string;
    statusCode?: number;
    errorDetails?: string;
  };

  // NotFoundError
  type NotFoundErrorContext = {
    operation: string;
    resourceType: string;
    resourceId: string;
  };

  // ValidationError
  type ValidationErrorContext = {
    field: string;
    expectedType?: string;
    receivedType?: string;
    constraint?: string;
  };
  ```
