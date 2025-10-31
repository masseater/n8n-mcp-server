# Phase 2: get_execution拡張とResponseBuilder 計画書

## タスク目次

- 1. [GetExecutionToolの既存実装確認] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 2. [GetExecutionToolの拡張（ExecutionFormatterの統合）] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 3. [ToolResponseBuilderへのcreateExecutionSummaryResponse追加] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 4. [GetExecutionToolユニットテストの更新] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て直列実行（タスク間に依存関係あり）

**並列実行の判断基準（明示的並列宣言方式）:**
- このPhaseでは並列実行可能なタスクなし

## Phase概要
- **Phase名**: get_execution拡張とResponseBuilder
- **状態**: 未着手
- **目標**: 既存のget_executionツールにExecutionFormatterを統合し、サマリーレスポンスを返す機能を実装

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: GetExecutionToolがExecutionSummaryを返すことを検証するテストケース作成
2. **Green（最小実装）**: ExecutionFormatterを呼び出してサマリーを返す最小実装
3. **Refactor（リファクタリング）**: エラーハンドリングとレスポンス生成の最適化

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: GetExecutionToolは実行データ取得とサマリー変換の調整役のみ。実際の変換はExecutionFormatterに委譲
- **開放/閉鎖の原則 (OCP)**: RawToolパターンを継承し、既存のツール構造を変更せずに機能拡張
- **リスコフの置換原則 (LSP)**: BaseTool<GetExecutionArgs>のシグネチャを保ちつつ、レスポンスをExecutionSummaryに変更
- **最小限の公開**: execute()メソッドのみをpublicとし、内部実装はprivateメソッドで隠蔽
- **依存性逆転の原則 (DIP)**: ExecutionFormatterを依存性注入（contextから取得）ではなく、直接インスタンス化（Phase 1で実装済みの具体クラスを使用）

⚠️ **インターフェースや抽象クラスは使用しない**: ExecutionFormatterは具体クラスとして直接使用

## 依存関係
- **前提条件**: Phase 1（ExecutionFormatter実装）の完了
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 3（get_execution統合）でツール登録とテスト実施

## 実装する機能
- GetExecutionToolのexecute()メソッドの拡張（ExecutionFormatterの統合）
- ToolResponseBuilderへのcreateExecutionSummaryResponse()メソッド追加
- サマリーレスポンスのレスポンス生成

## タスク詳細

### タスク1: GetExecutionToolの既存実装確認
- **説明**:
  - src/tools/implementations/get-execution-tool.tsの既存実装を確認
  - 現在のexecute()メソッドの構造を理解
  - N8nApiClient.getExecution()の呼び出し方法を確認
  - 既存のテストファイル（get-execution-tool.test.ts）の構造を確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 既存テストケースの確認（変更が必要な箇所を特定）
  - [ ] Green: 既存実装の理解（変更箇所のマーキング）
  - [ ] Refactor: 不要
- **依存関係**: なし
- **状態**: 未着手

### タスク2: GetExecutionToolの拡張（ExecutionFormatterの統合）
- **説明**:
  - GetExecutionTool.execute()メソッドを拡張
  - ExecutionFormatterをインポート
  - N8nApiClient.getExecution(id, includeData=true)で実行データ全体を取得
  - ExecutionFormatter.formatSummary()でサマリーに変換
  - ToolResponseBuilderを呼び出してMCPToolResponse<ExecutionSummary>を返す
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: execute()がExecutionSummaryを返すテストケース作成
  - [ ] Green: ExecutionFormatterを統合した最小実装
  - [ ] Refactor: エラーハンドリングの追加（実行IDが存在しない場合など）
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: ToolResponseBuilderへのcreateExecutionSummaryResponse追加
- **説明**:
  - src/formatters/tool-response-builder.tsにcreateExecutionSummaryResponse()メソッド追加
  - 既存のTemplate Methodパターン（createResponse<TRaw, TMinimal>）を使用
  - サマリーレスポンスはminimal=rawと同じ（サマリー自体が軽量なため）
  - メッセージ: "実行サマリーを取得しました"
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: createExecutionSummaryResponse()のテストケース作成
  - [ ] Green: createResponse()を呼び出す実装
  - [ ] Refactor: メッセージの日本語化と明確化
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: GetExecutionToolユニットテストの更新
- **説明**:
  - get-execution-tool.test.tsを更新
  - ExecutionSummaryを返すことを検証するテストケース追加
  - モックExecutionDetailInternalを準備
  - 統計情報、availableNodes、ガイダンスの内容を検証
  - エラーケース（存在しない実行ID）のテスト追加
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 新しいレスポンス構造のテストケース追加
  - [ ] Green: 既存テストの修正と新規テスト実装
  - [ ] Refactor: テストユーティリティ関数の作成（モックデータ生成など）
- **依存関係**: タスク3完了後
- **状態**: 未着手

## テスト戦略

- **単体テスト**:
  - GetExecutionTool.execute()のテスト（正常ケース、エラーケース）
  - ToolResponseBuilder.createExecutionSummaryResponse()のテスト
- **モック戦略**:
  - N8nApiClient.getExecution()をモック化
  - ExecutionFormatterは実際のインスタンスを使用（Phase 1でテスト済み）

## Phase完了条件
- [ ] 全タスク完了
- [ ] 全テスト通過
- [ ] 品質チェックコマンドが成功（`pnpm run type-check`, `pnpm run lint`, `pnpm run test`）
- [ ] GetExecutionToolがExecutionSummaryを返すことを確認

## 技術的課題と解決方針

**課題1: includeData=trueでの全データ取得の必要性**
- n8n APIは部分取得をサポートしないため、全データを取得する必要がある
- 解決方針: N8nApiClient.getExecution(id, includeData=true)を呼び出し、ExecutionFormatterでサマリー化

**課題2: 既存のget_executionツールとの互換性**
- 既存のget_executionツールがraw=trueで完全データを返す可能性がある
- 解決方針: rawフラグは削除し、常にサマリーを返す設計に変更（後方互換性を犠牲にする）

**課題3: エラーハンドリング**
- N8nApiClientが404エラーを返す場合の処理
- 解決方針: try-catchでエラーをキャッチし、適切なエラーメッセージを返す

## リスク管理

**リスク1: 既存のget_executionツールの利用者への影響**
- 影響度: 低（このプロジェクト自体が新機能追加のため、既存利用者は限定的）
- 対策: ドキュメントでレスポンス構造の変更を明記
- 緩和策: Phase 3で統合テストを実施し、動作を検証

**リスク2: レスポンスサイズの検証不足**
- 影響度: 中
- 対策: Phase 4でレスポンスサイズを測定し、MCPレスポンス制限内であることを確認
- 緩和策: Phase 1でExecutionFormatterのレスポンスサイズを検証済み

## 次Phaseへの引き継ぎ事項

**Phase 3で利用可能になる機能**:
- 拡張されたGetExecutionTool
- ToolResponseBuilder.createExecutionSummaryResponse()

**未解決の課題**:
- ツール登録とMCPサーバーへの統合（Phase 3で実施）

**技術的負債**:
- なし
