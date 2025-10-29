# プロジェクト全容ドキュメント

## プロジェクト概要
- **プロジェクト名**: n8n Workflow Execution Tools Implementation (TDD Approach)
- **開発手法**: Test-Driven Development (TDD)
- **目的と背景**:
  - 現在のn8n MCP Serverはワークフローの作成・更新・削除のみ対応
  - 実行履歴の取得機能がないため、デバッグが困難
  - AIがワークフローを実行・テストするための機能が不足
- **主要な目標**:
  - ワークフロー実行履歴の取得機能を実装
  - AIによる効率的なデバッグとトラブルシューティングを実現
  - 既存のMCPツールと統合された一貫性のあるインターフェースを提供
  - **TDDにより高品質で保守性の高いコードを実現**

## スコープ
- **対象範囲**:
  - `list_executions` ツール: 実行履歴の一覧取得
  - `get_execution` ツール: 特定の実行の詳細情報取得
  - 既存のRawToolパターンに従った実装
  - コンテキスト最適化（raw オプション）の実装

- **対象外の範囲**:
  - ワークフローの実行機能（execute_workflow）※将来的な実装予定
  - 実行のキャンセル・再実行機能
  - リアルタイムの実行監視機能
  - Webhook関連機能

## 主要機能
- **実行履歴一覧取得**: ワークフローID、ステータス、日時でフィルタリング可能
- **実行詳細取得**: 各ノードの実行結果、エラーメッセージ、実行時間を含む詳細情報
- **コンテキスト最適化**: rawオプションで情報量を制御（70-90%のコンテキスト削減）
- **エラー診断支援**: 失敗した実行の詳細エラー情報提供

## ステークホルダー
- **開発者**: n8n MCP Server開発チーム
- **エンドユーザー**: Claude CodeなどのAIアシスタント利用者
- **AI エージェント**: MCP経由でn8nワークフローを操作するAI
- **n8n管理者**: ワークフロー実行状況を監視する運用担当者

## スケジュール概要
- **全体期間**: 2-3週間
- **Phase 1**: 4-5日（API調査とテスト設計）
- **Phase 2**: 1週間（TDD実装: Red→Green）
- **Phase 3**: 4-5日（リファクタリングと最適化）

## TDD開発サイクル
```
1. Red Phase（失敗するテスト作成）
   ↓
2. Green Phase（テストを通す最小実装）
   ↓
3. Refactor Phase（コード改善）
   ↓
繰り返し
```

## Phase概要と依存関係

### Phase 1: API Research and Test Design
- **開始日時**: 2025-10-29
- **完了日時**: 2025-10-29
- **状態**: ✅ 完了
- **目標**: API仕様調査とテストケース設計
- **依存関係**: なし
- **成果物**:
  - ✅ API仕様ドキュメント (specs/workflow-execution-tools/api-samples/api-research-findings.md)
  - ✅ テストケース設計書 (specs/workflow-execution-tools/test-cases/)
  - ✅ 失敗するテストコード（Red Phase）(src/tools/implementations/__tests__/)
  - ✅ 型定義ファイル（インターフェース）(src/types/execution-types.ts, src/schemas/execution-schemas.ts)

### Phase 2: Test-First Implementation
- **開始日時**: （未着手）
- **状態**: 未着手
- **目標**: TDDによる機能実装（Green Phase）
- **依存関係**: Phase 1のテスト設計完了が必須
- **成果物**:
  - パスするテストコード
  - 最小限の実装コード
  - ListExecutionsTool実装
  - GetExecutionTool実装

### Phase 3: Refactoring and Optimization
- **開始日時**: （未着手）
- **状態**: 未着手
- **目標**: リファクタリングとパフォーマンス最適化
- **依存関係**: Phase 2のGreen Phase完了が必須
- **成果物**:
  - リファクタリングされたコード
  - パフォーマンステスト
  - 統合テスト
  - 最終ドキュメント

## Phase依存関係図
```
Phase 1 (API Research and Test Design)
    ├── n8n Executions API調査
    ├── テストケース設計
    ├── 失敗するテスト作成（Red）
    └── インターフェース定義
    ↓
Phase 2 (Test-First Implementation)
    ├── テストを通す最小実装（Green）
    ├── ListExecutionsTool
    ├── GetExecutionTool
    └── 全テストがパス
    ↓
Phase 3 (Refactoring and Optimization)
    ├── コードリファクタリング
    ├── パフォーマンス最適化
    ├── 統合テスト追加
    └── ドキュメント完成
```

## 成果物
- **ツール実装**:
  - `list_executions`: 実行履歴一覧取得ツール
  - `get_execution`: 実行詳細取得ツール
- **型定義**:
  - ExecutionSummary型
  - ExecutionDetail型
  - ExecutionStatus型
- **レスポンスビルダー**:
  - createListExecutionsResponse()
  - createGetExecutionResponse()
- **テスト**:
  - ユニットテスト（各ツール、フォーマッター）
  - 統合テスト（E2E）
- **ドキュメント**:
  - CLAUDE.md更新（ツール使用方法）
  - README.md更新（ツール一覧）

## リスクと制約
- **リスク**:
  - n8n API仕様の非公開部分や未文書化の挙動
  - 実行データのサイズが大きく、コンテキスト使用量が想定を超える可能性
  - n8n バージョン間でのAPI互換性の問題

- **制約**:
  - n8n API v1の制限（読み取り専用、実行キャンセル不可）
  - MCPプロトコルのレスポンスサイズ制限
  - 既存のRawToolパターンへの準拠必須
  - TypeScript/Zodスキーマの互換性維持
