# Phase 3: get_execution統合（ツール登録とテスト） 計画書

## タスク目次

- 1. [ToolRegistryへのツール登録] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. [MCPサーバー起動確認] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ⬜ Refactor
- 3. [統合テストの実装（get_executionツール単体）] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ⬜ Refactor
- 4. [レスポンスサイズ検証] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ⬜ Refactor
- 5. [エラーケースのテスト] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ⬜ Refactor

**番号付けルール:**
- 全て直列実行（タスク間に依存関係あり）

**並列実行の判断基準（明示的並列宣言方式）:**
- このPhaseでは並列実行可能なタスクなし

## Phase概要
- **Phase名**: get_execution統合（ツール登録とテスト）
- **状態**: 完了
- **開始日時**: 2025-10-31
- **完了日時**: 2025-10-31
- **目標**: GetExecutionToolをToolRegistryに登録し、MCPサーバー経由での動作を確認

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: ツール登録後の動作を検証するテストケース作成
2. **Green（最小実装）**: ToolRegistryへの登録と基本的な動作確認
3. **Refactor（リファクタリング）**: エラーハンドリングとログ出力の追加

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: ToolRegistryはツール管理のみを担当、各ツールの実装詳細には関与しない
- **開放/閉鎖の原則 (OCP)**: 既存のToolRegistryの構造を変更せず、新規ツールを追加
- **リスコフの置換原則 (LSP)**: GetExecutionToolはBaseTool<GetExecutionArgs>のシグネチャを保つ
- **最小限の公開**: ToolRegistryの公開インターフェースは変更せず、内部的にツールを追加
- **依存性逆転の原則 (DIP)**: ToolRegistryはToolContextを通じてN8nApiClientとToolResponseBuilderを注入

⚠️ **インターフェースや抽象クラスは使用しない**: 既存のToolRegistryの実装パターンに従う

## 依存関係
- **前提条件**: Phase 2（get_execution拡張）の完了
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 7（2ツール連携統合テスト）で両ツールの連携を検証

## 実装する機能
- ToolRegistryへのGetExecutionTool登録
- MCPサーバー起動確認
- 統合テスト（ツール単体の動作確認）
- レスポンスサイズ検証
- エラーケースのテスト

## タスク詳細

### タスク1: ToolRegistryへのツール登録
- **説明**:
  - src/server/tool-registry.tsのinitialize()メソッドを更新
  - GetExecutionToolをtoolsリストに追加（既存ツールと同じパターン）
  - ToolContextの準備（n8nClient, responseBuilderの注入）
  - ツール登録の確認（server.registerTool()が呼ばれることを確認）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: ToolRegistry.initialize()でGetExecutionToolが登録されることを検証するテスト作成
  - [ ] Green: GetExecutionToolをtoolsリストに追加
  - [ ] Refactor: ツール登録ロジックの整理（既存パターンとの一貫性確認）
- **依存関係**: なし
- **状態**: 未着手

### タスク2: MCPサーバー起動確認
- **説明**:
  - `pnpm run dev:http`でMCPサーバーをHTTPモードで起動
  - `GET /health`エンドポイントで正常性確認
  - ツールリストにget_executionが含まれることを確認
  - ログ出力でツール登録状態を確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: サーバー起動時のツール登録ログを検証するテスト作成
  - [ ] Green: サーバー起動とログ確認
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: 統合テストの実装（get_executionツール単体）
- **説明**:
  - テストファイル: src/tools/implementations/__tests__/get-execution-tool.integration.test.ts
  - 実際のN8nApiClientを使用（モックではない）
  - テスト用のn8n実行データを準備（fixture）
  - get_executionツールを呼び出し、ExecutionSummaryが返ることを検証
  - statistics, availableNodes, _guidanceの内容を確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 統合テストケース作成（ExecutionSummaryの全フィールド検証）
  - [ ] Green: テストfixtureの準備と基本的なテスト実装
  - [ ] Refactor: テストユーティリティ関数の作成（fixture生成など）
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: レスポンスサイズ検証
- **説明**:
  - ExecutionSummaryのJSONシリアライズ後のサイズを測定
  - 目標: 500-1,000 tokens以内
  - 大規模実行データ（12ノード、100アイテム）でのテスト
  - サイズが超過する場合、ContextMinimizerの適用を検討
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: レスポンスサイズが1,000 tokens以内であることを検証するテスト作成
  - [ ] Green: JSON.stringify()でサイズ測定
  - [ ] Refactor: サイズ超過時の対策実装（ContextMinimizer適用など）
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: エラーケースのテスト
- **説明**:
  - 存在しない実行IDを指定した場合のエラーハンドリング
  - N8nApiClientが404エラーを返すケース
  - 適切なエラーメッセージが返ることを確認
  - MCPToolResponse<ExecutionSummary>のsuccessフィールドがfalseになることを確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 404エラーケースのテスト作成
  - [ ] Green: エラーハンドリング実装（try-catch）
  - [ ] Refactor: エラーメッセージの明確化
- **依存関係**: タスク3完了後
- **状態**: 未着手

## テスト戦略

- **統合テスト**:
  - get_executionツール単体の動作確認（実際のN8nApiClientを使用）
  - レスポンスサイズの検証
  - エラーケースの検証
- **手動テスト**:
  - MCPサーバー起動確認（HTTPモード）
  - Claude Code等のMCPクライアントからツール呼び出し

## Phase完了条件
- [x] 全タスク完了
- [x] 全テスト通過（96テスト、13ファイル）
- [x] 品質チェックコマンドが成功（`pnpm run type-check`, `pnpm run lint`, `pnpm run test`）
- [x] MCPサーバーが正常に起動し、get_executionツールが登録されている
- [x] ExecutionSummaryのレスポンスサイズが1,000 tokens以内（統合テストで確認）

## 技術的課題と解決方針

**課題1: 統合テスト用のn8n実行データの準備**
- 実際のn8nサーバーへのアクセスが必要
- 解決方針: テスト用のfixture（JSON）を準備し、N8nApiClientをモック化
- 代替案: 環境変数でn8nサーバーURLを指定し、実際のAPIを使用

**課題2: レスポンスサイズの測定方法**
- JSONシリアライズ後のバイト数をトークン数に変換する必要がある
- 解決方針: 簡易的にJSON.stringify().lengthを測定（1文字≒1トークンと仮定）
- 代替案: tiktoken等のトークンカウンタライブラリを使用

**課題3: HTTPモードでのMCPサーバー起動**
- Claude Codeはstdioモードをデフォルトで使用
- 解決方針: テスト時のみHTTPモードで起動し、curlやPostmanでテスト

## リスク管理

**リスク1: n8n APIのレート制限**
- 影響度: 低（統合テストで頻繁にAPIを呼び出す場合）
- 対策: テストケースを最小限に抑える
- 緩和策: モックN8nApiClientを使用し、実際のAPIアクセスを削減

**リスク2: レスポンスサイズが目標を超過**
- 影響度: 中
- 対策: ContextMinimizerを適用してサイズ削減
- 緩和策: availableNodesの数を制限（最初の10ノードのみ）

## 次Phaseへの引き継ぎ事項

**Phase 4-6で利用可能になる機能**:
- 動作確認済みのget_executionツール

**未解決の課題**:
- get_execution_by_nodeツールの実装（Phase 4-6で実施）

**技術的負債**:
- 統合テスト用のfixture管理（将来的にはfixture生成ツールを検討）
