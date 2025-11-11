# RawToolパターン適合化

## 結論

- **選択**: czlonkowskiのWorkflowValidatorをそのまま使用し、RawToolクラスでラップする
- **理由**: czlonkowskiの検証ロジックは完結しており、本プロジェクトのRawToolパターンと相性が良い。formatResponse()でAI最適化レスポンスを実装できる

## 詳細

### 1. czlonkowskiの検証コード構造

**WorkflowValidator.validateWorkflow()**:
```typescript
async validateWorkflow(
  workflow: WorkflowJson,
  options: {
    validateNodes?: boolean;
    validateConnections?: boolean;
    validateExpressions?: boolean;
    profile?: 'minimal' | 'runtime' | 'ai-friendly' | 'strict';
  } = {}
): Promise<WorkflowValidationResult>
```

**WorkflowValidationResult**:
```typescript
{
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  statistics: {
    totalNodes: number;
    enabledNodes: number;
    triggerNodes: number;
    validConnections: number;
    invalidConnections: number;
    expressionsValidated: number;
  };
  suggestions: string[];
}
```

**ValidationIssue**:
```typescript
{
  type: 'error' | 'warning';
  nodeId?: string;
  nodeName?: string;
  message: string;
  details?: any;
}
```

### 2. 本プロジェクトのRawToolパターン

**RawTool抽象クラス**:
```typescript
export abstract class RawTool<TArgs extends { raw?: boolean | undefined }> extends BaseTool<TArgs> {
  abstract executeCore(args: Omit<TArgs, "raw">): Promise<unknown>;
  abstract formatResponse(data: unknown, raw: boolean): unknown;

  async execute(args: TArgs): Promise<unknown> {
    const { raw, ...coreArgs } = args;
    const result = await this.executeCore(coreArgs);
    return this.formatResponse(result, raw ?? false);
  }
}
```

**既存ツール実装例（GetWorkflowTool）**:
```typescript
export class GetWorkflowTool extends RawTool<GetWorkflowArgs> {
  readonly name = "get_workflow";
  readonly description = "...";

  getInputSchema() {
    return z.object({
      id: z.string(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: GetWorkflowCoreArgs): Promise<WorkflowDetailInternal> {
    return await this.context.n8nClient.getWorkflow(args.id);
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const workflow = data as WorkflowDetailInternal;
    return this.context.responseBuilder.createGetWorkflowResponse(workflow, raw);
  }
}
```

### 3. 適合方法

**ValidateWorkflowTool実装案**:

```typescript
type ValidateWorkflowArgs = {
  workflow: WorkflowJson;
  options?: {
    validateNodes?: boolean;
    validateConnections?: boolean;
    validateExpressions?: boolean;
    profile?: 'minimal' | 'runtime' | 'ai-friendly' | 'strict';
  };
  raw?: boolean;
};

type ValidateWorkflowCoreArgs = Omit<ValidateWorkflowArgs, "raw">;

export class ValidateWorkflowTool extends RawTool<ValidateWorkflowArgs> {
  readonly name = "validate_workflow";
  readonly description = "Validate workflow structure, connections, expressions, and AI nodes. Returns errors, warnings, and suggestions.";

  getInputSchema() {
    return z.object({
      workflow: z.object({
        nodes: z.array(z.any()),
        connections: z.record(z.any()),
      }),
      options: z.object({
        validateNodes: z.boolean().optional(),
        validateConnections: z.boolean().optional(),
        validateExpressions: z.boolean().optional(),
        profile: z.enum(['minimal', 'runtime', 'ai-friendly', 'strict']).optional(),
      }).optional(),
      raw: z.boolean().optional(),
    });
  }

  async executeCore(args: ValidateWorkflowCoreArgs): Promise<WorkflowValidationResult> {
    // czlonkowskiのWorkflowValidatorをそのまま使用
    return await this.context.workflowValidator.validateWorkflow(
      args.workflow,
      args.options
    );
  }

  formatResponse(data: unknown, raw: boolean): unknown {
    const result = data as WorkflowValidationResult;
    // AI最適化レスポンスを実装
    return this.context.responseBuilder.createValidateWorkflowResponse(result, raw);
  }
}
```

**ToolContextの拡張**:
```typescript
type ToolContext = {
  n8nClient: N8nApiClient;
  responseBuilder: ToolResponseBuilder;
  workflowValidator: WorkflowValidator; // 追加
};
```

**ToolResponseBuilderの拡張**:
```typescript
class ToolResponseBuilder {
  // 既存メソッド...

  createValidateWorkflowResponse(
    result: WorkflowValidationResult,
    raw: boolean
  ): MCPToolResponse<WorkflowValidationResult | ValidationSummary> {
    if (raw) {
      // フル検証結果を返す
      return {
        success: result.valid,
        message: result.valid
          ? "ワークフローは有効です"
          : `${result.errors.length}件のエラーが見つかりました`,
        data: result,
      };
    }

    // AI最適化: ミニマルサマリーを返す
    const summary: ValidationSummary = {
      valid: result.valid,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      criticalErrors: result.errors
        .filter(e => e.type === 'error')
        .slice(0, 3) // 最初の3件のみ
        .map(e => ({
          nodeId: e.nodeId,
          nodeName: e.nodeName,
          message: e.message,
        })),
      suggestions: result.suggestions.slice(0, 2), // 最初の2件のみ
    };

    return {
      success: result.valid,
      message: result.valid
        ? "ワークフローは有効です"
        : `${result.errors.length}件のエラー、${result.warnings.length}件の警告が見つかりました`,
      data: summary,
    };
  }
}
```

### 4. 実装フロー

**データフロー**:
```
User Request → ValidateWorkflowTool.execute()
  ↓
executeCore(workflow, options)
  ↓
WorkflowValidator.validateWorkflow() (czlonkowskiのコードをそのまま使用)
  ├─ validateWorkflowStructure()
  ├─ validateAllNodes()
  ├─ validateConnections()
  ├─ validateExpressions()
  └─ checkWorkflowPatterns()
  ↓
WorkflowValidationResult
  ↓
formatResponse(result, raw)
  ↓
[if raw=false] ToolResponseBuilder.createValidateWorkflowResponse()
  → AI最適化されたミニマルレスポンス (60-80%削減)
[if raw=true] 完全な検証結果を返す
  ↓
MCPToolResponse
  ↓
User Response
```

### 5. AI最適化の具体例

**フルレスポンス（raw=true）**:
```json
{
  "success": false,
  "message": "3件のエラーが見つかりました",
  "data": {
    "valid": false,
    "errors": [
      {
        "type": "error",
        "nodeId": "node-123",
        "nodeName": "HTTP Request",
        "message": "必須パラメータ'url'が指定されていません",
        "details": { "field": "url", "expected": "string" }
      },
      // ... 全エラー
    ],
    "warnings": [ /* 全警告 */ ],
    "statistics": {
      "totalNodes": 5,
      "enabledNodes": 5,
      "triggerNodes": 1,
      "validConnections": 4,
      "invalidConnections": 0,
      "expressionsValidated": 2
    },
    "suggestions": [ /* 全提案 */ ]
  }
}
```

**ミニマルレスポンス（raw=false、デフォルト）**:
```json
{
  "success": false,
  "message": "3件のエラー、2件の警告が見つかりました",
  "data": {
    "valid": false,
    "errorCount": 3,
    "warningCount": 2,
    "criticalErrors": [
      {
        "nodeId": "node-123",
        "nodeName": "HTTP Request",
        "message": "必須パラメータ'url'が指定されていません"
      }
      // 最初の3件のみ
    ],
    "suggestions": [
      "トリガーノードを追加してください",
      "エラーハンドリングを設定してください"
      // 最初の2件のみ
    ]
  }
}
```

**コンテキスト削減率**: 約60-80%（統計情報、詳細エラー、全警告を削減）

### 6. CreateWorkflowTool / UpdateWorkflowToolへの統合

既存のツールに検証を統合する場合:

```typescript
export class CreateWorkflowTool extends RawTool<CreateWorkflowArgs> {
  // ... 既存実装

  async executeCore(args: CreateWorkflowCoreArgs): Promise<WorkflowDetailInternal> {
    // 検証を実行（czlonkowskiのWorkflowValidatorを使用）
    const validationResult = await this.context.workflowValidator.validateWorkflow(
      { nodes: args.nodes, connections: args.connections },
      { profile: 'runtime' } // 本番環境用プロファイル
    );

    if (!validationResult.valid) {
      // 検証エラーがある場合は例外をスロー
      throw new Error(
        `ワークフロー検証エラー: ${validationResult.errors.map(e => e.message).join(', ')}`
      );
    }

    // 検証OK → n8n APIにワークフロー作成
    return await this.context.n8nClient.createWorkflow({
      name: args.name,
      nodes: args.nodes,
      connections: args.connections,
      settings: args.settings,
    });
  }

  // formatResponse() は既存のまま
}
```

### 7. 検証プロファイルの使い分け

| プロファイル | 使用場面 | 特徴 |
|------------|---------|------|
| **minimal** | 開発中の頻繁な検証 | 必須エラーのみ、最速 |
| **runtime** | create/update ワークフロー前 | 実行時エラーを防ぐ |
| **ai-friendly** | validate_workflow ツール（デフォルト） | AIエージェント向け、誤検知削減 |
| **strict** | 本番デプロイ前 | 全チェック、セキュリティ重視 |

## 関連タスク

- specs/workflow-validation-system-from-czlonkowski-n8n-mcp/
