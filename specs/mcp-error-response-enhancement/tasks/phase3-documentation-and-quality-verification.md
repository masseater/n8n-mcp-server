# Phase 3: ドキュメント更新と品質検証 計画書

## タスク目次

- 1. [CLAUDE.mdへのエラーレスポンス仕様追記] - 状態: 未着手 - TDD: なし
- 2. [全品質チェックツールの実行と修正] - 状態: 未着手 - TDD: なし
- 3. [Phase完了確認とリリース準備] - 状態: 未着手 - TDD: なし

**番号付けルール:**
- 全タスクは直列実行（依存関係あり）

## Phase概要
- **Phase名**: ドキュメント更新と品質検証
- **状態**: 未着手
- **目標**:
  - CLAUDE.mdへのエラーレスポンス仕様追記
  - 全品質チェックツール（lint、type-check、test）の実行と修正

## TDD & 設計原則の適用

このPhaseはドキュメント作業と品質検証のため、TDDサイクルは適用しません。

## 依存関係
- **前提条件**: Phase 2の個別ツール検証完了
- **ブロッカー**: なし
- **後続Phaseへの影響**: なし（最終Phase）

## 実装する機能
- CLAUDE.mdへのエラーレスポンス仕様セクション追加
- 全品質チェックの実行と合格

## タスク詳細

### タスク1: CLAUDE.mdへのエラーレスポンス仕様追記
- **説明**:
  - `CLAUDE.md` に新規セクション「Error Handling」を追加
  - 追記内容:
    - エラーレスポンスの形式説明
    - CustomErrorクラスの使用方法
    - エラーハンドリングのベストプラクティス
  - 追記セクションの構成案:
    ```markdown
    ## Error Handling

    ### Error Response Format

    When an MCP tool encounters an error, it returns a ToolResponse with `isError: true`:

    ```json
    {
      "content": [{
        "type": "text",
        "text": "Workflow 'abc123' not found"
      }],
      "isError": true
    }
    ```

    ### CustomError Classes

    This server uses custom error classes with strict type definitions:

    1. **NotFoundError**: Resource not found (404)
       - Context: `{ operation, resourceType, resourceId }`
       - Example: `new NotFoundError("Workflow 'abc123' not found", { operation: "update workflow", resourceType: "Workflow", resourceId: "abc123" })`

    2. **ApiError**: n8n API errors (4xx, 5xx)
       - Context: `{ operation, resourceType?, resourceId?, statusCode?, errorDetails? }`
       - Example: `new ApiError("Failed to update workflow", 400, { operation: "update workflow", errorDetails: "Field 'settings' is required" })`

    3. **ValidationError**: Validation errors
       - Context: `{ field, expectedType?, receivedType?, constraint? }`
       - Example: `new ValidationError("Workflow ID is required", { field: "id" })`

    ### Error Handling Best Practices

    - **BaseTool automatically catches errors**: All tools inherit error handling from BaseTool
    - **Use CustomError classes**: Always throw CustomError subclasses with appropriate context
    - **Error messages are returned to AI client**: Ensure error.message is clear and actionable
    - **Logs include full context**: logger.error() captures detailed error information
    - **No sensitive information in errors**: API keys, passwords, and internal paths are excluded
    ```
  - セクション配置: "Tool Implementations"セクションの後に追加
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**: なし（ドキュメント作業のため）
- **依存関係**: Phase 2完了後
- **状態**: 未着手

### タスク2: 全品質チェックツールの実行と修正
- **説明**:
  - 以下のコマンドを順次実行し、全て合格することを確認:
    1. `pnpm run type-check` - TypeScript型チェック
    2. `pnpm run lint` - ESLint
    3. `pnpm run test` - 全テスト実行
    4. `pnpm run test:coverage` - カバレッジ確認
    5. `pnpm run build` - ビルド
    6. `pnpm run knip` - 未使用ファイル・依存関係チェック
  - エラーが発生した場合は修正してから次のコマンドへ
  - 全てのチェックに合格するまで繰り返し
  - カバレッジ目標: 変更した箇所のカバレッジが90%以上
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**: なし（品質チェックのため）
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: Phase完了確認とリリース準備
- **説明**:
  - 全Phase完了確認:
    - Phase 1: BaseToolエラーハンドリング実装 ✅
    - Phase 2: 個別ツールのエラーケース検証 ✅
    - Phase 3: ドキュメント更新と品質検証 ✅
  - 成果物の確認:
    - `src/tools/base/base-tool.ts` の更新
    - `src/errors/custom-errors.ts` の型定義更新
    - `tests/tools/base/base-tool.test.ts` のテスト追加
    - `tests/tools/implementations/*.test.ts` のテスト追加
    - `CLAUDE.md` の更新
  - 全品質チェック合格レポート作成（console出力のスクリーンショットまたはログ保存）
  - リリースノート作成（オプション）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**: なし（確認作業のため）
- **依存関係**: タスク2完了後（全品質チェック合格）
- **状態**: 未着手

## テスト戦略

このPhaseはドキュメント作業と品質検証のため、新規テストは作成しません。
Phase 1, 2で作成したテストが全て通過することを確認します。

## Phase完了条件
- [ ] 全タスク完了
- [ ] CLAUDE.md更新完了
- [ ] 全品質チェック合格:
  - [ ] `pnpm run type-check` ✅
  - [ ] `pnpm run lint` ✅
  - [ ] `pnpm run test` ✅
  - [ ] `pnpm run test:coverage` ✅ (カバレッジ90%以上)
  - [ ] `pnpm run build` ✅
  - [ ] `pnpm run knip` ✅

## 技術的課題と解決方針

### 課題1: ドキュメントの網羅性
- **課題**: エラーレスポンス仕様の説明が不十分になる可能性
- **解決方針**: コード例を豊富に含めて、具体的に説明

### 課題2: 品質チェックエラーの修正
- **課題**: 予期しない品質チェックエラーが発生する可能性
- **解決方針**: エラーメッセージを確認し、適切に修正

## リスク管理

### リスク1: 品質チェックでエラーが多発
- **発生確率**: 低
- **影響度**: 中
- **対策**: Phase 1, 2で品質チェックを実施済み
- **回避策**: エラーが発生した場合は優先的に修正

### リスク2: ドキュメント更新の漏れ
- **発生確率**: 低
- **影響度**: 低
- **対策**: タスク1で必要なセクションを明確化
- **回避策**: レビュー時に確認

## 次Phaseへの引き継ぎ事項

なし（最終Phaseのため）

## プロジェクト完了後の状態

### 実装済み機能
- BaseToolでエラーをキャッチしてerror.messageをAIクライアントに返す
- CustomErrorの型定義が厳密化され、型安全性が向上
- 全ツールで一貫したエラーログフォーマット

### テストカバレッジ
- BaseToolのエラーハンドリング: 90%以上
- 個別ツールのエラーケース: 主要シナリオをカバー（20-30ケース）

### ドキュメント
- CLAUDE.mdにエラーレスポンス仕様を追記
- エラーハンドリングのベストプラクティスを記載

### 技術的負債
- なし

### 今後の改善案
- エラーメッセージの国際化（将来的に日本語サポートなど）
- エラーコードの標準化（エラー種別をコードで識別可能に）
