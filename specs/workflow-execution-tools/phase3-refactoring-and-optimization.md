# Phase 3: Refactoring and Optimization 計画書

## Phase概要
- **Phase名**: Refactoring and Optimization (Refactor Phase)
- **開始日時**: （未着手）
- **状態**: 未着手
- **目標**:
  - Green Phaseで作成したコードのリファクタリング
  - パフォーマンス最適化
  - コードの可読性と保守性向上
  - 追加テストによる品質保証

## TDDアプローチ
- **このPhaseの役割**: Refactor Phase - コード改善
- **原則**:
  - テストが通った状態を維持
  - 振る舞いを変えずに内部構造を改善
  - 継続的な品質向上
- **活動**:
  - コードの重複除去
  - 設計パターンの適用
  - パフォーマンス最適化

## 依存関係
- **前提条件**:
  - Phase 2のGreen Phase完了
  - すべてのテストがパス
  - 基本機能が動作確認済み

- **ブロッカー**:
  - Green Phaseが未完了の場合は着手不可

- **後続Phaseへの影響**:
  - 本番リリースへの準備完了

## 実装する機能
- コードリファクタリング（優先度: High）
- パフォーマンス最適化（優先度: High）
- 追加テスト作成（優先度: Medium）
- ドキュメント更新（優先度: High）
- ログ機能改善（優先度: Low）

## タスク詳細（Refactor Phase）

### タスク1: コード品質分析
- **説明**: 現在のコードの問題点を特定
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: Phase 2完了
- **完了条件**:
  - 重複コードの特定
  - 複雑度の高い箇所の特定
  - リファクタリング対象リスト作成
- **状態**: 未着手

```bash
# コード品質チェック
pnpm run lint
pnpm run knip
npx complexity-report src/

# 重複コード検出
npx jscpd src/
```

### タスク2: DRY原則の適用
- **説明**: 重複コードの除去
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: タスク1の分析結果
- **完了条件**:
  - 共通処理の抽出
  - ユーティリティ関数の作成
  - テストが継続的にパス
- **状態**: 未着手

```typescript
// Before: 重複したエラー処理
class ListExecutionsTool {
  async executeCore(args: Args) {
    try {
      const result = await this.client.getExecutions(args);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Failed to get executions: ${error.message}`);
    }
  }
}

class GetExecutionTool {
  async executeCore(args: Args) {
    try {
      const result = await this.client.getExecution(args.id);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Failed to get execution: ${error.message}`);
    }
  }
}

// After: 共通エラー処理の抽出
abstract class BaseExecutionTool extends RawTool {
  protected async handleApiCall<T>(
    apiCall: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      this.logError(error);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }
}
```

### タスク3: 設計パターンの適用
- **説明**: 適切なデザインパターンを適用
- **担当**: 開発チーム
- **見積もり時間**: 4時間
- **依存関係**: なし
- **完了条件**:
  - Strategy パターンでフィルタリング処理
  - Builder パターンでレスポンス構築
  - Factory パターンでツール生成
- **状態**: 未着手

```typescript
// Builder パターンの適用例
class ExecutionResponseBuilder {
  private response: ExecutionResponse = {};

  withSummary(executions: ExecutionSummary[]): this {
    this.response.executions = executions;
    return this;
  }

  withCount(count: number): this {
    this.response.count = count;
    return this;
  }

  withPagination(limit: number, offset: number): this {
    this.response.pagination = { limit, offset };
    return this;
  }

  build(): ExecutionResponse {
    return this.response;
  }
}

// 使用例
const response = new ExecutionResponseBuilder()
  .withSummary(executions)
  .withCount(executions.length)
  .withPagination(20, 0)
  .build();
```

### タスク4: パフォーマンス最適化
- **説明**: レスポンス時間とメモリ使用量の改善
- **担当**: 開発チーム
- **見積もり時間**: 4時間
- **依存関係**: なし
- **完了条件**:
  - 遅延読み込みの実装
  - キャッシュの検討
  - データ構造の最適化
- **状態**: 未着手

```typescript
// パフォーマンス最適化例
class OptimizedExecutionFormatter {
  // 大量データの場合はストリーミング処理
  async *formatExecutionsStream(
    executions: AsyncIterable<ExecutionSummary>
  ): AsyncGenerator<FormattedExecution> {
    for await (const execution of executions) {
      yield this.formatSingle(execution);
    }
  }

  // メモ化でフォーマット結果をキャッシュ
  @memoize()
  formatSingle(execution: ExecutionSummary): FormattedExecution {
    // 重い処理のキャッシュ
    return this.complexFormatting(execution);
  }
}
```

### タスク5: 型安全性の強化
- **説明**: 型定義の改善と厳格化
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: なし
- **完了条件**:
  - unknown型の除去
  - 型ガードの追加
  - 型推論の改善
- **状態**: 未着手

```typescript
// 型ガードの追加
function isExecutionSummary(data: unknown): data is ExecutionSummary {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'status' in data &&
    'workflowId' in data
  );
}

// 型推論の改善
function formatResponse<T extends ExecutionSummary | ExecutionDetail>(
  data: T,
  raw: boolean
): FormattedResponse<T> {
  // TypeScriptが型を正しく推論
  if (raw) {
    return { data } as FormattedResponse<T>;
  }
  // ...
}
```

### タスク6: エラーハンドリングの改善
- **説明**: より詳細で有用なエラー情報の提供
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: なし
- **完了条件**:
  - カスタムエラークラス作成
  - エラーコンテキストの追加
  - エラーリカバリ戦略
- **状態**: 未着手

```typescript
// カスタムエラークラス
class ExecutionApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ExecutionApiError';
  }
}

// 使用例
throw new ExecutionApiError(
  'Failed to fetch executions',
  'FETCH_EXECUTIONS_ERROR',
  500,
  { workflowId: args.workflowId, attemptedAt: new Date() }
);
```

### タスク7: テストの追加と改善
- **説明**: 追加のテストケースとテスト品質向上
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: リファクタリング後
- **完了条件**:
  - プロパティベーステスト追加
  - スナップショットテスト追加
  - パフォーマンステスト追加
- **状態**: 未着手

```typescript
// プロパティベーステストの追加
import fc from 'fast-check';

describe('ExecutionFormatter property-based tests', () => {
  it('should always return valid formatted data', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          status: fc.constantFrom('success', 'error', 'waiting'),
          workflowId: fc.uuid(),
        }),
        (execution) => {
          const formatted = formatter.format(execution);
          expect(formatted).toHaveProperty('id');
          expect(formatted.status).toBeOneOf(['success', 'error', 'waiting']);
        }
      )
    );
  });
});
```

### タスク8: ドキュメントとコメントの改善
- **説明**: コードドキュメントの充実
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: すべてのリファクタリング完了後
- **完了条件**:
  - JSDocコメント完備
  - 複雑なロジックへのコメント追加
  - README更新
- **状態**: 未着手

```typescript
/**
 * ワークフロー実行履歴を取得するMCPツール
 *
 * @example
 * ```typescript
 * const tool = new ListExecutionsTool(context);
 * const result = await tool.execute({
 *   workflowId: 'workflow-123',
 *   status: 'error',
 *   limit: 50,
 *   raw: false
 * });
 * ```
 *
 * @since 1.0.0
 */
export class ListExecutionsTool extends RawTool<ListExecutionsArgs> {
  // ...
}
```

### タスク9: パフォーマンス測定とベンチマーク
- **説明**: 最適化の効果を定量的に測定
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: タスク4の最適化完了後
- **完了条件**:
  - ベンチマーク結果の文書化
  - 改善率の計算
  - ボトルネックの特定
- **状態**: 未着手

```typescript
// ベンチマークテスト
import { bench, describe } from 'vitest';

describe('Performance benchmarks', () => {
  bench('list_executions with 100 items', async () => {
    await tool.execute({ limit: 100, raw: false });
  });

  bench('list_executions with raw data', async () => {
    await tool.execute({ limit: 100, raw: true });
  });
});
```

### タスク10: 最終レビューとクリーンアップ
- **説明**: コードベース全体の最終確認
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: すべてのタスク完了後
- **完了条件**:
  - 未使用コードの削除
  - TODOコメントの解決
  - リント警告ゼロ
  - すべてのテストがパス
- **状態**: 未着手

## リファクタリング指標

### コード品質メトリクス
- **循環的複雑度**: 10以下を目標
- **コード重複率**: 5%以下を目標
- **テストカバレッジ**: 85%以上を維持
- **型カバレッジ**: 95%以上を目標

### パフォーマンス目標
- **list_executions**: < 1秒（100件取得時）
- **get_execution**: < 500ms（詳細取得時）
- **メモリ使用量**: 50MB以下
- **コンテキスト削減率**: 75%以上

## 技術的課題
- **過度なリファクタリング**: 必要以上の変更を避ける
- **パフォーマンスと可読性のバランス**: 最適化と理解しやすさの両立
- **後方互換性**: 既存のインターフェースを維持

### 解決方針
- 小さなステップでリファクタリング
- 常にテストを実行
- パフォーマンス測定に基づく最適化

## デリバリー
- **成果物**:
  - リファクタリングされた高品質なコード
  - パフォーマンス最適化されたツール
  - 完全なテストスイート
  - 充実したドキュメント
  - ベンチマーク結果

- **完了基準**:
  - すべてのテストがパス
  - コード品質メトリクス達成
  - パフォーマンス目標達成
  - ドキュメント完備

## リスク管理
| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| リファクタリングによるバグ | 高 | 中 | 継続的テスト実行 |
| パフォーマンス劣化 | 中 | 低 | ベンチマーク監視 |
| 過度な最適化 | 低 | 中 | プロファイリング基準 |

## 最終チェックリスト
- [ ] コード重複の除去完了
- [ ] 設計パターンの適用完了
- [ ] パフォーマンス最適化完了
- [ ] 型安全性の強化完了
- [ ] エラーハンドリング改善完了
- [ ] 追加テスト作成完了
- [ ] ドキュメント更新完了
- [ ] ベンチマーク測定完了
- [ ] すべてのテストがパス
- [ ] コード品質メトリクス達成
- [ ] パフォーマンス目標達成
- [ ] 最終レビュー完了
