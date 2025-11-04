# エラーハンドリングの改善

## 問題

以前は、MCPツールがエラーを返す際に、基本的なエラーメッセージのみが含まれていました。例えば：

```
Failed to update workflow
```

ターミナルには詳細なエラー情報がログとして出力されていましたが、MCPレスポンスには含まれていませんでした。これにより、AIクライアントやユーザーはエラーの原因を理解できず、デバッグが困難でした。

## 解決策

**ターミナルログとMCPレスポンスで同じエラー情報を返すように統一しました。**

`BaseTool`のエラーハンドリングを改善し、ターミナルに出力されるのと同じJSON形式のエラー情報をMCPレスポンスにも含めるようにしました。

### 改善内容

1. **ターミナルとMCPレスポンスで同じ情報**
   - ログとレスポンスの不一致を解消
   - JSON形式で構造化されたエラー情報
   - プログラムで解析しやすい形式

2. **詳細なコンテキスト情報**
   - エラー名（NotFoundError、ApiError等）
   - エラーメッセージ
   - HTTPステータスコード（ApiError）
   - コンテキスト情報（operation、resourceType、resourceId、errorDetails等）

3. **安全な情報フィルタリング**
   - 機密情報（APIキー、パスワード、トークン等）を自動除外
   - 型安全な実装

4. **開発モードでのスタックトレース**
   - `NODE_ENV=development`時にスタックトレースを追加
   - 本番環境では含まれない

## エラーレスポンスの例

### NotFoundError

**以前:**
```
Workflow 'abc123' not found
```

**改善後（JSON形式、ターミナルログと同じ）:**
```json
{
  "name": "NotFoundError",
  "message": "Workflow 'abc123' not found",
  "context": {
    "operation": "get workflow",
    "resourceType": "Workflow",
    "resourceId": "abc123"
  }
}
```

### ApiError

**以前:**
```
Failed to update workflow
```

**改善後（JSON形式、ターミナルログと同じ）:**
```json
{
  "name": "ApiError",
  "message": "Failed to update workflow for Workflow 'abc123' (HTTP 400)",
  "statusCode": 400,
  "context": {
    "operation": "update workflow",
    "resourceType": "Workflow",
    "resourceId": "abc123",
    "errorDetails": "Field 'settings' is required"
  }
}
```

### ValidationError

**以前:**
```
Workflow ID is required
```

**改善後（JSON形式、ターミナルログと同じ）:**
```json
{
  "name": "ValidationError",
  "message": "Workflow ID is required",
  "context": {
    "field": "id"
  }
}
```

## 実装の詳細

### BaseTool.serializeError()

エラーオブジェクトをJSON形式にシリアライズ（ターミナルログと同じ形式）：

```typescript
private serializeError(error: unknown): string {
  if (!(error instanceof Error)) {
    return JSON.stringify({ error: String(error) }, null, 2);
  }

  const errorObj: Record<string, unknown> = {
    name: error.name,
    message: error.message,
  };

  // CustomErrorのプロパティを追加
  if (errorWithContext.statusCode !== undefined) {
    errorObj.statusCode = errorWithContext.statusCode;
  }

  if (errorWithContext.context) {
    // 機密情報をフィルタリング
    const filteredContext: Record<string, unknown> = {};
    const sensitiveKeys = new Set(['apiKey', 'password', 'token', 'secret', 'auth']);

    for (const [key, value] of Object.entries(errorWithContext.context)) {
      if (!sensitiveKeys.has(key)) {
        filteredContext[key] = value;
      }
    }

    errorObj.context = filteredContext;
  }

  // 開発モードでスタックトレースを追加
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorObj.stack = error.stack;
  }

  return JSON.stringify(errorObj, null, 2);
}
```

### api-error-handler.ts

エラー作成時により詳細なメッセージを生成：

```typescript
// リソース情報を含む
let message = `Failed to ${context.operation}`;
if (context.resourceType) {
  message += ` for ${context.resourceType}`;
  if (context.resourceId) {
    message += ` '${context.resourceId}'`;
  }
}

// HTTPステータスコードを含む
if (status !== undefined) {
  message += ` (HTTP ${String(status)})`;
}
```

## テスト

すべてのテストケースが新しいJSON形式の動作を検証するように更新されました：

- `TC-ERROR-001`: NotFoundError発生時にJSON形式でエラー情報を返す
- `TC-ERROR-002`: ApiError発生時にJSON形式でエラー情報を返す
- `TC-ERROR-003`: ValidationError発生時にJSON形式でエラー情報を返す
- `TC-ERROR-004`: Unknown Error発生時にJSON形式でエラー情報を返す
- `TC-ERROR-005`: 非Errorオブジェクトの場合にJSON形式で返す

**テスト結果**: 125個のテストケースがすべて通過

## 利点

1. **完全な情報一致**: ターミナルログとMCPレスポンスで同じエラー情報
2. **デバッグの容易性**: エラーの原因を即座に特定できる
3. **プログラム解析可能**: JSON形式で構造化されているため、プログラムで処理しやすい
4. **AIクライアントの対応**: より適切なエラーハンドリングが可能
5. **ユーザーエクスペリエンス**: 明確なエラーメッセージで問題解決が迅速に
6. **セキュリティ**: 機密情報は自動的に除外
7. **一貫性**: すべてのMCPツールで統一されたエラーフォーマット

## 後方互換性

- エラーレスポンスの基本構造（`isError: true`）は変更なし
- エラーメッセージは拡張されましたが、既存の情報はすべて保持
- MCPクライアントに影響なし
