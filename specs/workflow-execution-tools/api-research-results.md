# n8n Executions API 調査結果

## 調査日: 2025-10-29

## 調査対象
- n8n インスタンス: https://n8n-forte-cloud-run-1000375894652.asia-northeast1.run.app
- API バージョン: v1
- 調査方法: 実際のAPIコールによる検証

## API エンドポイント仕様

### 1. GET /api/v1/executions - 実行履歴一覧取得

#### リクエストパラメータ
- `includeData` (boolean, optional): 実行データを含めるかどうか
- `status` (string, optional): ステータスでフィルタリング
  - 有効な値: `canceled`, `error`, `running`, `success`, `waiting`
- `workflowId` (string, optional): ワークフローIDでフィルタリング
- `limit` (number, optional): 取得件数制限（デフォルト100）
- `cursor` (string, optional): ページネーション用カーソル

#### レスポンス構造（includeData=false）
```json
{
  "data": [
    {
      "id": "15935",
      "finished": true,
      "mode": "webhook",
      "retryOf": null,
      "retrySuccessId": null,
      "status": "success",
      "startedAt": "2025-10-29T08:33:05.913Z",
      "stoppedAt": "2025-10-29T08:33:05.933Z",
      "workflowId": "6FB4pk3SAhf9riN4",
      "waitTill": null
    }
  ],
  "nextCursor": "eyJsYXN0SWQiOiIxNTgzNiIsImxpbWl0IjoxMDB9"
}
```

#### レスポンス構造（includeData=true）
```json
{
  "data": [
    {
      "id": "15935",
      "finished": true,
      "mode": "webhook",
      "retryOf": null,
      "retrySuccessId": null,
      "status": "success",
      "startedAt": "2025-10-29T08:33:05.913Z",
      "stoppedAt": "2025-10-29T08:33:05.933Z",
      "workflowId": "6FB4pk3SAhf9riN4",
      "waitTill": null,
      "customData": {},
      "data": {
        "startData": {},
        "resultData": {
          "runData": {},
          "lastNodeExecuted": "node_id"
        },
        "executionData": {
          "contextData": {},
          "nodeExecutionStack": []
        }
      },
      "workflowData": {
        "id": "workflow_id",
        "name": "Workflow Name",
        "active": true,
        "nodes": [],
        "connections": {}
      }
    }
  ],
  "nextCursor": "..."
}
```

### 2. GET /api/v1/executions/:id - 単一実行詳細取得

#### パスパラメータ
- `id` (string, required): 実行ID

#### クエリパラメータ
- `includeData` (boolean, optional): 実行データを含めるかどうか

#### レスポンス構造（includeData=false）
```json
{
  "id": "15935",
  "finished": true,
  "mode": "webhook",
  "retryOf": null,
  "retrySuccessId": null,
  "status": "success",
  "createdAt": "2025-10-29T08:33:05.805Z",
  "startedAt": "2025-10-29T08:33:05.913Z",
  "stoppedAt": "2025-10-29T08:33:05.933Z",
  "deletedAt": null,
  "workflowId": "6FB4pk3SAhf9riN4",
  "waitTill": null
}
```

## フィールド定義

### 基本フィールド
| フィールド | 型 | 説明 |
|-----------|---|------|
| id | string | 実行の一意識別子 |
| finished | boolean | 実行が完了したかどうか |
| mode | string | 実行モード（webhook, manual, trigger, etc.） |
| retryOf | string \| null | リトライ元の実行ID |
| retrySuccessId | string \| null | リトライ成功時の実行ID |
| status | string | 実行ステータス |
| startedAt | string (ISO 8601) | 実行開始時刻 |
| stoppedAt | string \| null | 実行終了時刻（実行中はnull） |
| workflowId | string | ワークフローID |
| waitTill | string \| null | 待機時刻 |

### 詳細取得時の追加フィールド
| フィールド | 型 | 説明 |
|-----------|---|------|
| createdAt | string (ISO 8601) | 作成時刻 |
| deletedAt | string \| null | 削除時刻 |

### includeData=true時の追加フィールド
| フィールド | 型 | 説明 |
|-----------|---|------|
| customData | object | カスタムデータ |
| data | object | 実行データ（詳細構造は下記参照） |
| workflowData | object | ワークフローデータ |

## data フィールドの構造

### data.startData
- 実行開始時のデータ

### data.resultData
- `runData`: 各ノードの実行結果データ（オブジェクト）
- `lastNodeExecuted`: 最後に実行されたノードID

### data.executionData
- `contextData`: コンテキストデータ
- `nodeExecutionStack`: ノード実行スタック（配列）
- `waitingExecution`: 待機中の実行情報
- `waitingExecutionSource`: 待機中の実行ソース

## 実行モード (mode)の値
- `webhook`
- `manual`
- `trigger`
- `cli`
- `error`
- `integrated`
- `internal`
- `retry`

## 実行ステータス (status)の値
- `success`: 成功
- `error`: エラー
- `running`: 実行中
- `waiting`: 待機中
- `canceled`: キャンセル済み
- `crashed`: クラッシュ
- `new`: 新規
- `unknown`: 不明

## ページネーション
- `nextCursor`フィールドが返される
- 次のリクエストで`cursor`パラメータとして使用
- Base64エンコードされたJSON形式
  - 例: `{"lastId":"15836","limit":100}`

## エラーレスポンス
- HTTPステータスコード: 4xx, 5xx
- レスポンス形式は要追加調査

## 既存の生成型との対応

既存のOpenAPI生成ファイル（`src/generated/types.gen.ts`）には以下の型が定義済み：

```typescript
export type Execution = {
  id?: number;
  data?: { [key: string]: unknown };
  finished?: boolean;
  mode?: 'cli' | 'error' | 'integrated' | 'internal' | 'manual' | 'retry' | 'trigger' | 'webhook';
  retryOf?: number | null;
  retrySuccessId?: number | null;
  startedAt?: string;
  stoppedAt?: string | null;
  workflowId?: number;
  waitTill?: string | null;
  customData?: { [key: string]: unknown };
  status?: 'canceled' | 'crashed' | 'error' | 'new' | 'running' | 'success' | 'unknown' | 'waiting';
};

export type ExecutionList = {
  data?: Array<Execution>;
  nextCursor?: string | null;
};
```

## 検証で確認された事実

1. **ID の型不一致**: APIレスポンスでIDは文字列 `"15935"` として返されたが、生成された型定義では`number`型として定義されている
2. **workflowNameフィールドの不在**: GET /executionsのレスポンスにworkflowNameフィールドは存在しない（検証済み）
3. **データサイズの実測値**:
   - `includeData=false`: 1実行あたり231-296 bytes（実測値）
   - `includeData=true`: 1実行あたり60,600-71,623 bytes（実測値）
   - 100件取得時: `includeData=false`で23,069 bytes (23KB)（実測値）
   - 10件取得時: `includeData=true`で716,230 bytes (699KB)（実測値）
4. **実行時間の計算**: `executionTime`フィールドは存在せず、`startedAt`と`stoppedAt`の差分から計算する必要がある

## Phase 1での活用

この調査結果を基に、Phase 1では以下を実施：
1. テストケースの設計（各フィールドの検証）
2. 失敗するテストコードの作成（Red Phase）
3. インターフェース定義（型定義ではなく、テスト内でのモックデータ構造として）
