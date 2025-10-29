# Phase 2: Test-First Implementation 計画書

## Phase概要
- **Phase名**: Test-First Implementation (Green Phase)
- **開始日時**: （未着手）
- **状態**: 未着手
- **目標**:
  - Phase 1で作成した失敗するテストをパスさせる
  - 最小限の実装でGreen Phaseを達成
  - YAGNIとKISS原則の遵守
  - 早期の動作確認とフィードバック

## TDDアプローチ
- **このPhaseの役割**: Green Phase - テストをパスさせる
- **実装方針**:
  - テストを通すための最小限のコード
  - 過度な最適化を避ける
  - シンプルで明確な実装
- **禁止事項**:
  - テストなしの機能追加
  - 既存テストの変更（バグ修正を除く）

## 依存関係
- **前提条件**:
  - Phase 1のRed Phaseテストが完成
  - 型定義とインターフェースが確定
  - テスト環境が整備済み

- **ブロッカー**:
  - Phase 1のテストが未完成の場合は着手不可

- **後続Phaseへの影響**:
  - Phase 3のリファクタリングの基盤となる
  - すべてのテストがパスしていることが前提

## 実装する機能
すべてテストドリブンで実装（テストがパスすることが完了条件）

1. N8nApiClient拡張（優先度: High）
2. ListExecutionsTool実装（優先度: High）
3. GetExecutionTool実装（優先度: High）
4. ExecutionFormatter実装（優先度: High）
5. ToolResponseBuilder拡張（優先度: High）
6. ToolRegistry更新（優先度: High）

## タスク詳細（Red → Green）

### タスク1: 最初のテストをパスさせる準備
- **説明**: 開発環境の確認とテスト実行
- **担当**: 開発チーム
- **見積もり時間**: 1時間
- **依存関係**: Phase 1完了
- **完了条件**:
  - すべてのテストが失敗することを確認
  - テスト実行環境の動作確認
  - 実装開始の準備完了
- **状態**: 未着手

```bash
# Red Phaseの確認
pnpm test:red
# → すべてのテストが失敗することを確認
```

### タスク2: N8nApiClient - 最小実装
- **説明**: getExecutions()とgetExecution()メソッドの最小実装
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: なし
- **テストターゲット**:
  - `n8n-api-client.test.ts`の基本テストケース
- **完了条件**:
  - 関連するテストがパス
  - エラーケースも考慮
- **状態**: 未着手

```typescript
// Green Phase: 最小実装例
class N8nApiClientImpl {
  async getExecutions(params?: ListExecutionsParams): Promise<ExecutionSummary[]> {
    // テストをパスするための最小限の実装
    const response = await this.httpClient.get('/api/v1/executions', { params });
    return response.data.data;
  }

  async getExecution(id: string, includeData?: boolean): Promise<ExecutionDetail> {
    // テストをパスするための最小限の実装
    const response = await this.httpClient.get(`/api/v1/executions/${id}`, {
      params: { includeData }
    });
    return response.data.data;
  }
}
```

### タスク3: ListExecutionsTool - 基本機能実装
- **説明**: RawToolを継承した最小実装
- **担当**: 開発チーム
- **見積もり時間**: 4時間
- **依存関係**: タスク2のAPIクライアント実装
- **テストターゲット**:
  - `list-executions-tool.test.ts`の全テストケース
- **完了条件**:
  - 15個以上のテストケースがパス
  - raw オプションの動作
- **状態**: 未着手

```typescript
// Green Phase: 段階的な実装
export class ListExecutionsTool extends RawTool<ListExecutionsArgs> {
  readonly name = "list_executions";
  readonly description = "ワークフロー実行履歴を取得";

  getInputSchema() {
    return listExecutionsArgsSchema; // Phase 1で定義済み
  }

  async executeCore(args: Omit<ListExecutionsArgs, "raw">) {
    // Step 1: 最初のテストをパスさせる
    return await this.context.n8nClient.getExecutions(args);
  }

  formatResponse(data: unknown, raw: boolean) {
    // Step 2: フォーマットテストをパスさせる
    if (raw) {
      return { success: true, message: "実行履歴を取得しました", data };
    }
    // 最小限のレスポンス
    const executions = data as ExecutionSummary[];
    return {
      success: true,
      message: "実行履歴を取得しました",
      data: {
        count: executions.length,
        executions: executions.map(e => ({ id: e.id, workflowId: e.workflowId, status: e.status }))
      }
    };
  }
}
```

#### 実装の進め方（テストケースごと）
1. "デフォルトパラメータで実行履歴を取得できる" → 基本的なexecuteCore実装
2. "workflowIdでフィルタリングできる" → パラメータ渡し実装
3. "statusでフィルタリングできる" → enumバリデーション追加
4. "日付範囲でフィルタリングできる" → 日付処理追加
5. ... 各テストを順番にパスさせる

### タスク4: GetExecutionTool - 基本機能実装
- **説明**: 実行詳細取得ツールの最小実装
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: タスク2のAPIクライアント実装
- **テストターゲット**:
  - `get-execution-tool.test.ts`の全テストケース
- **完了条件**:
  - 10個以上のテストケースがパス
  - includeDataオプションの動作
- **状態**: 未着手

### タスク5: ExecutionFormatter - 最小実装
- **説明**: データ整形の最小実装
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: なし
- **テストターゲット**:
  - `execution-formatter.test.ts`のテストケース
- **完了条件**:
  - フォーマッターテストがパス
- **状態**: 未着手

```typescript
// Green Phase: 最小実装
export class ExecutionFormatter {
  formatExecutionSummary(execution: ExecutionSummary): any {
    // テストが要求する最小限の整形
    return {
      id: execution.id,
      status: execution.status,
      // 必要なフィールドのみ
    };
  }
}
```

### タスク6: ToolResponseBuilder拡張
- **説明**: 実行関連のレスポンスビルダー追加
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: タスク5のフォーマッター実装
- **テストターゲット**:
  - `tool-response-builder.test.ts`の実行関連テスト
- **完了条件**:
  - レスポンスビルダーテストがパス
- **状態**: 未着手

### タスク7: ToolRegistry更新
- **説明**: 新しいツールをレジストリに登録
- **担当**: 開発チーム
- **見積もり時間**: 1時間
- **依存関係**: タスク3,4の実装完了
- **テストターゲット**:
  - 統合テストのツール登録テスト
- **完了条件**:
  - ツール登録テストがパス
- **状態**: 未着手

### タスク8: 統合テストをパスさせる
- **説明**: E2Eシナリオのテストをパス
- **担当**: 開発チーム
- **見積もり時間**: 3時間
- **依存関係**: タスク1-7の完了
- **テストターゲット**:
  - `integration/execution-tools.test.ts`
- **完了条件**:
  - MCPサーバー統合テストがパス
  - ツール呼び出しのE2Eテストがパス
- **状態**: 未着手

### タスク9: 全テストのGreen確認
- **説明**: すべてのテストがパスすることを確認
- **担当**: 開発チーム
- **見積もり時間**: 2時間
- **依存関係**: すべてのタスク完了
- **完了条件**:
  - `pnpm test`ですべてパス
  - カバレッジレポート生成
  - CIでのテスト成功
- **状態**: 未着手

```bash
# Green Phase完了確認
pnpm test
# → All tests passed!

pnpm test:coverage
# → Coverage: 80%以上
```

## 実装の原則

### KISS (Keep It Simple, Stupid)
- 複雑な抽象化を避ける
- 直接的でわかりやすいコード
- 早すぎる最適化をしない

### YAGNI (You Aren't Gonna Need It)
- テストが要求しない機能は実装しない
- 将来の拡張を考慮しすぎない
- 現在のテストをパスすることに集中

### 実装例
```typescript
// ❌ 過度に複雑
class ExecutionService {
  private cache: Map<string, ExecutionSummary>;
  private strategy: FilterStrategy;
  // ... 不要な抽象化
}

// ✅ シンプル
class ListExecutionsTool {
  async executeCore(args: Args) {
    return await this.client.getExecutions(args);
  }
}
```

## 技術的課題
- **テストとの整合性**: テストの意図を正確に理解
- **最小実装の判断**: どこまでがMinimumか
- **モックとの差異**: 実APIとモックの挙動の違い

### 解決方針
- テストコードをドキュメントとして扱う
- ペアプログラミングでの実装
- 実環境での早期動作確認

## デリバリー
- **成果物**:
  - すべてのテストがパスする実装コード
  - ListExecutionsTool（動作する最小実装）
  - GetExecutionTool（動作する最小実装）
  - 拡張されたN8nApiClient
  - 拡張されたToolResponseBuilder

- **Green Phase完了基準**:
  - すべてのRed Phaseテストがパス
  - コードカバレッジ80%以上
  - 実環境での動作確認

## リスク管理
| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| テストの誤解釈 | 高 | 中 | テストコードレビュー |
| 過度な実装 | 中 | 高 | YAGNI原則の徹底 |
| APIモックとの不一致 | 高 | 中 | 早期の実環境テスト |

## 次Phaseへの引き継ぎ事項
- **Phase 3でのリファクタリング対象**:
  - 重複コードの除去
  - パフォーマンス最適化
  - コードの可読性向上
  - 設計パターンの適用

- **リファクタリング候補**:
  - （実装後に特定）

## チェックポイント
- [ ] Red Phaseのテストがすべて存在することを確認
- [ ] N8nApiClientのテストがパス
- [ ] ListExecutionsToolのテストがパス（15ケース以上）
- [ ] GetExecutionToolのテストがパス（10ケース以上）
- [ ] 統合テストがパス
- [ ] すべてのテストがパス（Green達成）
- [ ] カバレッジ80%以上
- [ ] 実環境での動作確認
