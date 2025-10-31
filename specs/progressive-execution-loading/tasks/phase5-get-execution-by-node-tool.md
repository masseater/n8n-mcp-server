# Phase 5: GetExecutionByNodeTool実装 計画書

## タスク目次

- 1. [GetExecutionByNodeToolの骨組み作成] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 2. [execute()メソッドの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 3. [エラーハンドリングの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 4. [ToolResponseBuilderへのcreateExecutionByNodeResponse追加] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 5. [GetExecutionByNodeToolユニットテストの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て直列実行（タスク間に依存関係あり）

**並列実行の判断基準（明示的並列宣言方式）:**
- このPhaseでは並列実行可能なタスクなし

## Phase概要
- **Phase名**: GetExecutionByNodeTool実装
- **状態**: 未着手
- **目標**: 単一ノードの詳細データを取得するMCPツールを実装

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: GetExecutionByNodeToolがNodeExecutionDataを返すことを検証するテストケース作成
2. **Green（最小実装）**: NodeExecutionFormatterを呼び出してノードデータを返す最小実装
3. **Refactor（リファクタリング）**: エラーハンドリングとレスポンス生成の最適化

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: GetExecutionByNodeToolは実行データ取得とノードデータ抽出の調整役のみ。実際の抽出はNodeExecutionFormatterに委譲
- **開放/閉鎖の原則 (OCP)**: BaseToolパターンを継承し、既存のツール構造を変更せずに機能拡張
- **リスコフの置換原則 (LSP)**: BaseTool<GetExecutionByNodeArgs>のシグネチャを保つ
- **最小限の公開**: execute()メソッドのみをpublicとし、内部実装はprivateメソッドで隠蔽
- **依存性逆転の原則 (DIP)**: NodeExecutionFormatterを依存性注入ではなく、直接インスタンス化（Phase 4で実装済みの具体クラスを使用）

⚠️ **インターフェースや抽象クラスは使用しない**: NodeExecutionFormatterは具体クラスとして直接使用

## 依存関係
- **前提条件**: Phase 4（NodeExecutionFormatter実装）の完了
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 6（get_execution_by_node統合）でツール登録とテスト実施

## 実装する機能
- GetExecutionByNodeToolクラスの実装（BaseTool<GetExecutionByNodeArgs>を継承）
- execute()メソッド（N8nApiClient → NodeExecutionFormatter → ToolResponseBuilder）
- エラーハンドリング（存在しないnodeName、n8n APIエラー）
- ToolResponseBuilder.createExecutionByNodeResponse()

## タスク詳細

### タスク1: GetExecutionByNodeToolの骨組み作成
- **説明**:
  - src/tools/implementations/get-execution-by-node-tool.tsの作成
  - BaseTool<GetExecutionByNodeArgs>を継承
  - name: "get_execution_by_node"
  - description: "Get detailed execution data for a single node"
  - getInputSchema()メソッドの実装（Zodスキーマ: id, nodeName）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: ツールクラスの構造を検証するテスト作成
  - [ ] Green: クラスの骨組みとgetInputSchema()実装
  - [ ] Refactor: Zodスキーマの明確化（descriptionフィールド追加）
- **依存関係**: なし
- **状態**: 未着手

### タスク2: execute()メソッドの実装
- **説明**:
  - execute(args: GetExecutionByNodeArgs): Promise<unknown>の実装
  - N8nApiClient.getExecution(id, includeData=true)で実行データ全体を取得
  - NodeExecutionFormatter.formatNodeExecution(execution, nodeName)でノードデータ抽出
  - 存在しないnodeNameの場合はエラーをthrow
  - ToolResponseBuilder.createExecutionByNodeResponse()でレスポンス生成
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: execute()がNodeExecutionDataを返すテストケース作成
  - [ ] Green: NodeExecutionFormatterを統合した最小実装
  - [ ] Refactor: エラーハンドリングの追加
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: エラーハンドリングの実装
- **説明**:
  - 存在しないnodeNameが指定された場合のエラー処理
  - NodeExecutionFormatter.formatNodeExecution()がnullを返した場合、適切なエラーメッセージをthrow
  - エラーメッセージ例: `Node '{nodeName}' not found in execution '{executionId}'`
  - N8nApiClientが404エラーを返す場合の処理（既存のエラーハンドリングパターンを踏襲）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 存在しないnodeNameのエラーケーステスト作成
  - [ ] Green: nullチェックとエラーthrow実装
  - [ ] Refactor: エラーメッセージの明確化
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: ToolResponseBuilderへのcreateExecutionByNodeResponse追加
- **説明**:
  - src/formatters/tool-response-builder.tsにcreateExecutionByNodeResponse()メソッド追加
  - 既存のTemplate Methodパターン（createResponse<TRaw, TMinimal>）を使用
  - NodeExecutionDataは完全データのため、minimal=raw
  - メッセージ: "ノード '{nodeName}' の実行詳細を取得しました"
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: createExecutionByNodeResponse()のテストケース作成
  - [ ] Green: createResponse()を呼び出す実装
  - [ ] Refactor: メッセージの日本語化と明確化
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク5: GetExecutionByNodeToolユニットテストの実装
- **説明**:
  - get-execution-by-node-tool.test.tsの作成
  - execute()の正常ケーステスト（NodeExecutionDataが返ること）
  - 存在しないnodeNameのエラーケーステスト
  - N8nApiClientのモック化
  - NodeExecutionFormatterは実際のインスタンスを使用（Phase 4でテスト済み）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 新しいツールのテストケース追加
  - [ ] Green: モックを使用したテスト実装
  - [ ] Refactor: テストユーティリティ関数の作成（モックデータ生成など）
- **依存関係**: タスク4完了後
- **状態**: 未着手

## テスト戦略

- **単体テスト**:
  - GetExecutionByNodeTool.execute()のテスト（正常ケース、エラーケース）
  - ToolResponseBuilder.createExecutionByNodeResponse()のテスト
- **モック戦略**:
  - N8nApiClient.getExecution()をモック化
  - NodeExecutionFormatterは実際のインスタンスを使用

## Phase完了条件
- [ ] 全タスク完了
- [ ] 全テスト通過
- [ ] 品質チェックコマンドが成功（`pnpm run type-check`, `pnpm run lint`, `pnpm run test`）
- [ ] GetExecutionByNodeToolがNodeExecutionDataを返すことを確認

## 技術的課題と解決方針

**課題1: includeData=trueでの全データ取得の必要性**
- n8n APIは部分取得をサポートしないため、全データを取得する必要がある
- 解決方針: N8nApiClient.getExecution(id, includeData=true)を呼び出し、NodeExecutionFormatterでフィルタリング

**課題2: 存在しないnodeNameのエラー処理**
- NodeExecutionFormatter.formatNodeExecution()がnullを返す
- 解決方針: nullチェックを行い、エラーメッセージをthrow

**課題3: レスポンスサイズの懸念**
- 入出力アイテムが大量の場合、MCPレスポンス制限を超過する可能性
- 解決方針: Phase 6でContextMinimizerの適用を検討

## リスク管理

**リスク1: レスポンスサイズがMCPレスポンス制限を超過**
- 影響度: 高
- 対策: Phase 6でContextMinimizerを適用
- 緩和策: 入出力アイテムの数を制限（例: 最初の100アイテムのみ）

**リスク2: n8n APIのレート制限**
- 影響度: 低
- 対策: AIエージェントが必要最小限のノードのみを取得するように設計
- 緩和策: キャッシング機構の導入（将来的な拡張）

## 次Phaseへの引き継ぎ事項

**Phase 6で利用可能になる機能**:
- GetExecutionByNodeToolクラス
- ToolResponseBuilder.createExecutionByNodeResponse()

**未解決の課題**:
- ツール登録とMCPサーバーへの統合（Phase 6で実施）
- レスポンスサイズの最適化（Phase 6で検討）

**技術的負債**:
- なし
