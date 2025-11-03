# Phase 6: get_execution_by_node統合（ツール登録とテスト） 計画書

## タスク目次

- 1. [ToolRegistryへのツール登録] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. [MCPサーバー起動確認] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 3. [統合テストの実装（get_execution_by_nodeツール単体）] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. [レスポンスサイズ検証] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 5. [レスポンスサイズ最適化（ContextMinimizer適用検討）] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 6. [エラーケースのテスト] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor

**番号付けルール:**
- 全て直列実行（タスク間に依存関係あり）

**並列実行の判断基準（明示的並列宣言方式）:**
- このPhaseでは並列実行可能なタスクなし

## Phase概要
- **Phase名**: get_execution_by_node統合（ツール登録とテスト）
- **状態**: 完了
- **開始日時**: 2025-11-03
- **完了日時**: 2025-11-03
- **目標**: GetExecutionByNodeToolをToolRegistryに登録し、MCPサーバー経由での動作を確認、レスポンスサイズ最適化を実施

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: ツール登録後の動作を検証するテストケース作成
2. **Green（最小実装）**: ToolRegistryへの登録と基本的な動作確認
3. **Refactor（リファクタリング）**: レスポンスサイズ最適化（ContextMinimizer適用）

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: ToolRegistryはツール管理のみを担当、各ツールの実装詳細には関与しない
- **開放/閉鎖の原則 (OCP)**: 既存のToolRegistryの構造を変更せず、新規ツールを追加
- **リスコフの置換原則 (LSP)**: GetExecutionByNodeToolはBaseTool<GetExecutionByNodeArgs>のシグネチャを保つ
- **最小限の公開**: ToolRegistryの公開インターフェースは変更せず、内部的にツールを追加
- **依存性逆転の原則 (DIP)**: ToolRegistryはToolContextを通じてN8nApiClientとToolResponseBuilderを注入

⚠️ **インターフェースや抽象クラスは使用しない**: 既存のToolRegistryの実装パターンに従う

## 依存関係
- **前提条件**: Phase 5（GetExecutionByNodeTool実装）の完了
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 7（2ツール連携統合テスト）で両ツールの連携を検証

## 実装する機能
- ToolRegistryへのGetExecutionByNodeTool登録
- MCPサーバー起動確認
- 統合テスト（ツール単体の動作確認）
- レスポンスサイズ検証と最適化
- エラーケースのテスト

## タスク詳細

### タスク1: ToolRegistryへのツール登録
- **説明**:
  - src/server/tool-registry.tsのinitialize()メソッドを更新
  - GetExecutionByNodeToolをtoolsリストに追加（既存ツールと同じパターン）
  - ToolContextの準備（n8nClient, responseBuilderの注入）
  - ツール登録の確認（server.registerTool()が呼ばれることを確認）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: ToolRegistry.initialize()でGetExecutionByNodeToolが登録されることを検証するテスト作成
  - [ ] Green: GetExecutionByNodeToolをtoolsリストに追加
  - [ ] Refactor: ツール登録ロジックの整理（既存パターンとの一貫性確認）
- **依存関係**: なし
- **状態**: 未着手

### タスク2: MCPサーバー起動確認
- **説明**:
  - `pnpm run dev:http`でMCPサーバーをHTTPモードで起動
  - `GET /health`エンドポイントで正常性確認
  - ツールリストにget_execution_by_nodeが含まれることを確認
  - ログ出力でツール登録状態を確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: サーバー起動時のツール登録ログを検証するテスト作成
  - [ ] Green: サーバー起動とログ確認
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: 統合テストの実装（get_execution_by_nodeツール単体）
- **説明**:
  - テストファイル: src/tools/implementations/__tests__/get-execution-by-node-tool.integration.test.ts
  - 実際のN8nApiClientを使用（モックではない）
  - テスト用のn8n実行データを準備（fixture）
  - get_execution_by_nodeツールを呼び出し、NodeExecutionDataが返ることを検証
  - nodeName, nodeType, status, input, output, errorの内容を確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 統合テストケース作成（NodeExecutionDataの全フィールド検証）
  - [ ] Green: テストfixtureの準備と基本的なテスト実装
  - [ ] Refactor: テストユーティリティ関数の作成（fixture生成など）
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: レスポンスサイズ検証
- **説明**:
  - NodeExecutionDataのJSONシリアライズ後のサイズを測定
  - 目標: 25,000 tokens以内（MCPレスポンス制限）
  - 大規模ノードデータ（100アイテム、パラメータ多数）でのテスト
  - サイズが超過する場合、タスク5でContextMinimizerの適用を検討
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: レスポンスサイズが25,000 tokens以内であることを検証するテスト作成
  - [ ] Green: JSON.stringify()でサイズ測定
  - [ ] Refactor: サイズ超過時の対策検討（タスク5へ）
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: レスポンスサイズ最適化（ContextMinimizer適用検討）
- **説明**:
  - タスク4でサイズ超過が確認された場合のみ実施
  - ContextMinimizerを適用してレスポンスサイズを削減
  - 削減対象: input.items, output.itemsの配列要素数
  - 削減後もエラー情報、パラメータは保持
  - 代替案: itemsの数を制限（例: 最初の50アイテムのみ）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: ContextMinimizer適用後のレスポンスサイズを検証するテスト作成
  - [ ] Green: ContextMinimizerの統合または独自の削減ロジック実装
  - [ ] Refactor: 削減ロジックの最適化
- **依存関係**: タスク4完了後（サイズ超過が確認された場合のみ）
- **状態**: 未着手

### タスク6: エラーケースのテスト
- **説明**:
  - 存在しないnodeNameを指定した場合のエラーハンドリング
  - NodeExecutionFormatter.formatNodeExecution()がnullを返すケース
  - 存在しない実行IDを指定した場合（N8nApiClientが404エラー）
  - 適切なエラーメッセージが返ることを確認
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 存在しないnodeName、404エラーケースのテスト作成
  - [ ] Green: エラーハンドリング実装確認（Phase 5で実装済み）
  - [ ] Refactor: エラーメッセージの明確化
- **依存関係**: タスク3完了後
- **状態**: 未着手

## テスト戦略

- **統合テスト**:
  - get_execution_by_nodeツール単体の動作確認（実際のN8nApiClientを使用）
  - レスポンスサイズの検証
  - エラーケースの検証
- **手動テスト**:
  - MCPサーバー起動確認（HTTPモード）
  - Claude Code等のMCPクライアントからツール呼び出し

## Phase完了条件
- [x] 全タスク完了
- [x] 全テスト通過（114/116テスト、E2E除く）
- [x] 品質チェックコマンドが成功（`pnpm run type-check`, `pnpm run lint`, `pnpm run test`）
- [x] MCPサーバーが正常に起動し、get_execution_by_nodeツールが登録されている
- [x] NodeExecutionDataのレスポンスサイズが25,000 tokens以内（~5,264 tokens、90%削減）

## 技術的課題と解決方針

**課題1: レスポンスサイズがMCPレスポンス制限を超過**
- 入出力アイテムが大量の場合、25,000 tokensを超過する可能性が高い
- 解決方針: ContextMinimizerを適用してitemの数を削減
- 代替案: itemsの数を固定制限（最初の50アイテムのみ）

**課題2: ContextMinimizerの適用範囲**
- 既存のContextMinimizerは汎用的な削減を行うため、エラー情報が失われる可能性
- 解決方針: NodeExecutionData専用の削減ロジックを実装（errorフィールドは保護）

**課題3: 統合テスト用のn8n実行データの準備**
- 実際のn8nサーバーへのアクセスが必要
- 解決方針: テスト用のfixture（JSON）を準備し、N8nApiClientをモック化

## リスク管理

**リスク1: レスポンスサイズが最適化後も制限を超過**
- 影響度: 高
- 対策: itemsの数を固定制限（最初の50アイテムのみ）
- 緩和策: AIエージェントに対して大量データの存在を警告メッセージで通知

**リスク2: ContextMinimizerによるエラー情報の損失**
- 影響度: 中
- 対策: NodeExecutionData専用の削減ロジックを実装し、errorフィールドを保護
- 緩和策: 削減前にerrorフィールドをチェックし、存在する場合は優先的に保持

## 次Phaseへの引き継ぎ事項

**Phase 7で利用可能になる機能**:
- 動作確認済みのget_execution_by_nodeツール
- レスポンスサイズ最適化済みのNodeExecutionData

**未解決の課題**:
- 2ツール連携のシナリオテスト（Phase 7で実施）

**技術的負債**:
- 統合テスト用のfixture管理（将来的にはfixture生成ツールを検討）
- itemsの固定制限（50アイテム）が適切かどうか要検証
