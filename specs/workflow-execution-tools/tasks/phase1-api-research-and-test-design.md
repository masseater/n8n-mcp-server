# Phase 1: API Research and Test Design 計画書

## Phase概要
- **Phase名**: API Research and Test Design
- **開始日時**: 2025-10-29
- **完了日時**: 2025-10-29
- **状態**: ✅ 完了
- **目標**:
  - n8n Executions APIの仕様調査
  - テストケースの設計（仕様ベース）
  - 失敗するテストコードの作成（Red Phase）
  - インターフェース（型定義）の設計

## TDDアプローチ
- **このPhaseの役割**: Red Phaseの準備と実行
- **成果物**: 失敗するテストコード（これが仕様書となる）
- **原則**: テストが仕様を定義する

## 依存関係
- **前提条件**:
  - n8nテスト環境へのアクセス
  - 既存のMCPサーバー構造の理解

- **ブロッカー**:
  - なし

- **後続Phaseへの影響**:
  - Phase 2はこのPhaseで作成したテストをパスさせることが目標
  - テストケースの品質が最終的な実装品質を決定

## 実装する機能
- n8n Executions API調査（優先度: High）
- テストケース設計（優先度: High）
- 失敗するテストコード作成（優先度: High）
- インターフェース定義（優先度: High）
- モックデータ準備（優先度: Medium）

## タスク詳細

### タスク1: n8n Executions API調査
- **説明**: 実際のAPIを呼び出してレスポンス構造を確認
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: なし
- **完了条件**:
  - GET /api/v1/executions のレスポンス構造文書化
  - GET /api/v1/executions/:id のレスポンス構造文書化
  - サンプルレスポンスの保存
  - エラーパターンの確認
- **状態**: ✅ 完了

```bash
# API調査用コマンド例
curl -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
  "${N8N_URL}/api/v1/executions" | jq '.' > sample-executions.json

curl -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
  "${N8N_URL}/api/v1/executions/12345" | jq '.' > sample-execution-detail.json
```

### タスク2: テストケース設計
- **説明**: 振る舞い駆動でテストケースを設計
- **担当**: 開発チーム
- **見積もり時間**: 4時間
- **依存関係**: タスク1の調査結果が必要
- **完了条件**:
  - list_executionsの全テストケース設計（15ケース以上）
  - get_executionの全テストケース設計（10ケース以上）
  - エッジケースの洗い出し
  - テストデータ要件の定義
- **状態**: ✅ 完了

#### テストケース例（list_executions）
```
1. デフォルトパラメータで実行履歴を取得できる
2. workflowIdでフィルタリングできる
3. statusでフィルタリングできる（success/error/waiting/running/canceled）
4. 日付範囲でフィルタリングできる
5. limitとoffsetでページネーションできる
6. raw=falseで最小限のデータを返す
7. raw=trueで完全なデータを返す
8. 存在しないworkflowIdの場合、空の配列を返す
9. 不正なstatusの場合、エラーを返す
10. limitが範囲外の場合、エラーを返す
...
```

### タスク3: インターフェース定義（型定義）
- **説明**: TypeScript型定義とZodスキーマを作成
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: タスク1の調査結果が必要
- **完了条件**:
  - ExecutionSummary型の定義
  - ExecutionDetail型の定義
  - 入力パラメータ型の定義
  - Zodスキーマの作成
- **状態**: ✅ 完了

```typescript
// src/types/execution-types.ts
export interface ExecutionSummary {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  startedAt: string;
  stoppedAt?: string;
  executionTime?: number;
  // ... 先にインターフェースを定義
}

// src/schemas/execution-schemas.ts
export const listExecutionsArgsSchema = z.object({
  workflowId: z.string().optional(),
  status: z.enum(['success', 'error', 'waiting', 'running', 'canceled']).optional(),
  // ... 先にスキーマを定義
});
```

### タスク4: 失敗するユニットテスト作成（list_executions）
- **説明**: list_executionsツールのRed Phaseテスト作成
- **担当**: 開発チーム
- **見積もり時間**: 4時間
- **依存関係**: タスク2,3の完了が必要
- **完了条件**:
  - すべてのテストケースをコード化
  - モックの準備
  - テストが失敗することの確認
  - テストが仕様を明確に表現していること
- **状態**: ✅ 完了

```typescript
// src/tools/implementations/__tests__/list-executions-tool.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ListExecutionsTool', () => {
  let mockN8nClient: any;
  let mockResponseBuilder: any;
  let tool: ListExecutionsTool; // まだ存在しないクラス

  beforeEach(() => {
    mockN8nClient = {
      getExecutions: vi.fn(),
    };
    mockResponseBuilder = {
      createListExecutionsResponse: vi.fn(),
    };
    // tool = new ListExecutionsTool({ n8nClient: mockN8nClient, responseBuilder: mockResponseBuilder });
    // ↑ このコメントを外すとエラーになる（Red Phase）
  });

  describe('基本機能', () => {
    it('デフォルトパラメータで実行履歴を取得できる', async () => {
      // Arrange
      const expectedExecutions = [
        { id: '1', status: 'success', workflowId: 'w1' },
        { id: '2', status: 'error', workflowId: 'w1' },
      ];
      mockN8nClient.getExecutions.mockResolvedValue(expectedExecutions);

      // Act
      // const result = await tool.execute({ raw: false });

      // Assert
      // expect(mockN8nClient.getExecutions).toHaveBeenCalledWith({});
      // expect(result.success).toBe(true);
      // expect(result.data.executions).toEqual(expectedExecutions);

      // このテストは実装がないため失敗する
      expect(true).toBe(false); // 一時的なassertion
    });

    it('workflowIdでフィルタリングできる', async () => {
      // テストケースを記述（Red Phase）
    });

    // ... 他のテストケース
  });
});
```

### タスク5: 失敗するユニットテスト作成（get_execution）
- **説明**: get_executionツールのRed Phaseテスト作成
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: タスク2,3の完了が必要
- **完了条件**:
  - すべてのテストケースをコード化
  - モックの準備
  - テストが失敗することの確認
- **状態**: ✅ 完了

### タスク6: 失敗する統合テスト作成
- **説明**: E2EシナリオのRed Phaseテスト作成
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: タスク4,5の完了が必要
- **完了条件**:
  - MCPサーバーとの統合テスト
  - ツール登録のテスト
  - 実際のMCPプロトコルでの動作テスト
- **状態**: ✅ 完了

```typescript
// src/__tests__/integration/execution-tools.test.ts
describe('Execution Tools Integration', () => {
  it('MCPサーバーにlist_executionsツールが登録される', async () => {
    // Red Phase: ツールがまだ存在しない
    const server = new MCPServerImpl(config);
    await server.initialize();

    const tools = server.getRegisteredTools();
    expect(tools).toContain('list_executions'); // 失敗する
  });
});
```

### タスク7: テストヘルパーとモックデータ作成
- **説明**: テスト用のユーティリティとデータを準備
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: タスク1の調査結果が必要
- **完了条件**:
  - テストデータファクトリ
  - モッククライアント生成関数
  - アサーションヘルパー
- **状態**: ✅ 完了

```typescript
// src/__tests__/helpers/execution-helpers.ts
export function createMockExecution(overrides?: Partial<ExecutionSummary>): ExecutionSummary {
  return {
    id: faker.string.uuid(),
    workflowId: faker.string.uuid(),
    workflowName: faker.lorem.words(3),
    status: 'success',
    startedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}
```

### タスク8: テストランナー設定
- **説明**: Red Phaseテストの実行環境を整備
- **担当**: 開発チーム
- **見積もり時間**: 1時間
- **依存関係**: なし
- **完了条件**:
  - package.jsonにテストスクリプト追加
  - CI/CDでのテスト実行設定
  - テストレポート設定
- **状態**: ✅ 完了

```json
// package.json
{
  "scripts": {
    "test:red": "vitest run --reporter=verbose",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

### タスク9: Red Phaseレビュー
- **説明**: 作成したテストの品質確認
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: タスク4-6の完了が必要
- **完了条件**:
  - すべてのテストが失敗することを確認
  - テストが仕様を正確に表現していることを確認
  - テストケースの網羅性確認
  - Phase 2への引き継ぎ準備
- **状態**: ✅ 完了

## 技術的課題
- **API仕様の曖昧さ**: 文書化されていない挙動への対処
- **テストデータの複雑性**: リアリスティックなデータ生成
- **モックの精度**: 実際のAPIと同じ挙動を再現

### 解決方針
- 実APIでの検証を優先
- プロパティベーステストの活用
- 契約テスト（Contract Testing）の導入検討

## デリバリー
- **成果物**:
  - 失敗するテストコード一式（Red Phase完了）
  - 型定義ファイル（execution-types.ts）
  - Zodスキーマ（execution-schemas.ts）
  - テストヘルパー関数
  - API調査ドキュメント

- **Red Phase完了基準**:
  - すべてのテストが存在する
  - すべてのテストが失敗する
  - テストが仕様を明確に定義している

## リスク管理
| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| テストケース漏れ | 高 | 中 | チェックリストとレビュー |
| API仕様の誤解 | 高 | 中 | 実環境での早期検証 |
| 過度に詳細なテスト | 中 | 高 | 振る舞いに焦点を当てる |

## 次Phaseへの引き継ぎ事項
- **Phase 2で実装すべき内容**:
  - 失敗しているテストをすべてパスさせる
  - 最小限の実装で対応（YAGNI原則）
  - 不要な最適化は行わない

- **成功基準**:
  - Red → Green の移行
  - すべてのテストがパス

## チェックポイント
- [x] API調査完了
- [x] 型定義作成完了
- [x] list_executionsのテスト作成（15ケース以上）
- [x] get_executionのテスト作成（10ケース以上）
- [x] すべてのテストが失敗することを確認
- [x] テストが仕様を明確に表現していることを確認
