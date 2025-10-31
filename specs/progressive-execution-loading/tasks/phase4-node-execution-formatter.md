# Phase 4: NodeExecutionFormatter実装 計画書

## タスク目次

- 1. [NodeExecutionDataレスポンス構造の設計] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 2. [ノードデータ抽出ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 3. [入出力アイテム抽出ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 4. [エラー情報抽出ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 5. [formatNodeExecution()メソッドの統合] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 6. [NodeExecutionFormatterユニットテストの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て直列実行（タスク間に依存関係あり）

**並列実行の判断基準（明示的並列宣言方式）:**
- このPhaseはPhase 1-3と並行実行可能（get_execution系と独立）

## Phase概要
- **Phase名**: NodeExecutionFormatter実装
- **状態**: 未着手
- **目標**: 単一ノードの実行データを抽出・整形する機能を実装し、NodeExecutionDataを生成する

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: 各抽出ロジック（ノードデータ、入出力、エラー）のテストケースを先に作成
2. **Green（最小実装）**: テストを通すための最小限の実装、型ガードを使用してsafeにアクセス
3. **Refactor（リファクタリング）**: Remeda等のユーティリティライブラリを活用したコード品質向上

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: NodeExecutionFormatterは単一ノードのデータ抽出のみを担当。各抽出ロジック（入出力、エラー）は個別のprivateメソッドに分離
- **開放/閉鎖の原則 (OCP)**: formatNodeExecution()の公開インターフェースは変更せず、内部の抽出ロジックを拡張可能に設計
- **リスコフの置換原則 (LSP)**: ExecutionDetailInternalとnodeNameを受け取り、NodeExecutionDataまたはnullを返すというシグネチャを一貫して保つ
- **最小限の公開**: formatNodeExecution()のみをpublicとし、抽出ロジックはprivateメソッドで隠蔽
- **依存性逆転の原則 (DIP)**: ExecutionDetailInternalに直接依存するが、抽出ロジックは純粋関数として実装

⚠️ **インターフェースや抽象クラスは使用しない**: NodeExecutionFormatterは具体的なクラスとして実装

## 依存関係
- **前提条件**: なし（Phase 1-3と並行実行可能）
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 5（GetExecutionByNodeTool実装）でNodeExecutionFormatterを利用

## 実装する機能
- NodeExecutionDataを返すformatNodeExecution()メソッド
- ノードデータ抽出（nodeName, nodeType, status, executionTime, startTime, endTime）
- 入出力アイテム抽出（input.items, output.items）
- パラメータ抽出（parameters）
- エラー情報抽出（error）

## タスク詳細

### タスク1: NodeExecutionDataレスポンス構造の設計
- **説明**:
  - NodeExecutionDataの構造を設計し、TypeScript型として実装
  - フィールド: executionId, nodeName, nodeType, status, executionTime, startTime, endTime, input, output, parameters, error
  - specification.mdとtechnical-details.mdの仕様に準拠
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: NodeExecutionDataの構造を検証するテストケース作成
  - [ ] Green: NodeExecutionDataの型実装
  - [ ] Refactor: 必要に応じて型を整理
- **依存関係**: なし
- **状態**: 未着手

### タスク2: ノードデータ抽出ロジックの実装
- **説明**:
  - extractNodeBasicInfo() privateメソッドの実装
  - ExecutionDetailInternal.data.resultData.runData[nodeName]からノードデータを取得
  - nodeName, nodeType, status（errorがあれば"error"、なければ"success"）を抽出
  - executionTime, startTime, endTimeを抽出
  - 存在しないnodeNameが指定された場合はnullを返す
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: extractNodeBasicInfo()のテストケース作成（正常ケース、存在しないノード、エラーノード）
  - [ ] Green: 型ガードを使用した安全な抽出実装
  - [ ] Refactor: オプショナルチェーンとnullish coalescingを活用
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: 入出力アイテム抽出ロジックの実装
- **説明**:
  - extractInputOutputItems() privateメソッドの実装
  - nodeData.data.main[0]から入出力アイテムを抽出
  - input.items: 入力アイテムの配列（存在しない場合は空配列）
  - output.items: 出力アイテムの配列（存在しない場合は空配列）
  - 型は`unknown[]`として扱う（ワークフローに依存するため）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: extractInputOutputItems()のテストケース作成（入出力あり、入出力なし、nullケース）
  - [ ] Green: 型ガードを使用した安全な抽出実装
  - [ ] Refactor: デフォルト値の明確化
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: エラー情報抽出ロジックの実装
- **説明**:
  - extractError() privateメソッドの実装
  - nodeData.errorからエラー情報を抽出
  - エラーがない場合はnullを返す
  - エラーの型は`unknown`として扱う（n8nのエラー構造が複雑なため）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: extractError()のテストケース作成（エラーあり、エラーなし）
  - [ ] Green: nullチェックを使用した実装
  - [ ] Refactor: エラー情報の整形（必要に応じて）
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク5: formatNodeExecution()メソッドの統合
- **説明**:
  - formatNodeExecution(execution: ExecutionDetailInternal, nodeName: string): NodeExecutionData | nullの実装
  - タスク2-4で実装した各privateメソッドを呼び出し
  - NodeExecutionDataオブジェクトを組み立てて返す
  - 存在しないnodeNameが指定された場合はnullを返す
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: formatNodeExecution()の統合テストケース作成（全フィールドの検証）
  - [ ] Green: 各privateメソッドを呼び出してNodeExecutionDataを組み立て
  - [ ] Refactor: オブジェクト生成ロジックの最適化
- **依存関係**: タスク2, 3, 4完了後
- **状態**: 未着手

### タスク6: NodeExecutionFormatterユニットテストの実装
- **説明**:
  - node-execution-formatter.test.tsの作成
  - 各privateメソッドのテスト（タスク2-4で作成済みのものを整理）
  - formatNodeExecution()の統合テスト（複数シナリオ: 正常実行、エラー含む実行、存在しないノード）
  - 入出力アイテムのサイズが大きい場合のテスト
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 統合テストケースの追加（エッジケース、大量データ）
  - [ ] Green: 既存テストの整理と追加実装
  - [ ] Refactor: テストユーティリティ関数の作成（モックデータ生成など）
- **依存関係**: タスク5完了後
- **状態**: 未着手

## テスト戦略

- **単体テスト**:
  - 各privateメソッド（extractNodeBasicInfo, extractInputOutputItems, extractError）の振る舞いを検証
  - formatNodeExecution()の統合テスト
- **エッジケーステスト**:
  - 存在しないnodeNameが指定された場合（nullを返す）
  - runDataが空の場合
  - 入出力アイテムが大量の場合（レスポンスサイズの懸念）

## Phase完了条件
- [ ] 全タスク完了
- [ ] 全テスト通過
- [ ] 品質チェックコマンドが成功（`pnpm run type-check`, `pnpm run lint`, `pnpm run test`）
- [ ] NodeExecutionFormatterが正常にNodeExecutionDataを返す

## 技術的課題と解決方針

**課題1: runData構造の複雑さ**
- runData[nodeName]のネスト構造が深い（runData[nodeName].data.main[0]等）
- 解決方針: 型ガードとオプショナルチェーンを使用してsafeにアクセス

**課題2: 入出力アイテムの型が不明**
- ワークフローに依存するため、型を特定できない
- 解決方針: `unknown[]`として扱い、型ガードは使用しない

**課題3: エラー情報の構造が複雑**
- n8nのエラー構造が複雑で、型定義が困難
- 解決方針: `unknown`として扱い、必要に応じて型ガードで整形

**課題4: レスポンスサイズの懸念**
- 入出力アイテムが大量の場合、MCPレスポンス制限を超過する可能性
- 解決方針: Phase 6でページネーションまたはContextMinimizerを検討

## リスク管理

**リスク1: runDataの構造が仕様書と異なる**
- 影響度: 中
- 対策: 実際のn8n APIレスポンスを確認し、構造を検証
- 緩和策: 型ガードとオプショナルチェーンを使用して柔軟に対応

**リスク2: 入出力アイテムが巨大でレスポンスサイズが超過**
- 影響度: 高
- 対策: Phase 6でContextMinimizerを適用
- 緩和策: itemsの数を制限（例: 最初の100アイテムのみ）

## 次Phaseへの引き継ぎ事項

**Phase 5で利用可能になる機能**:
- NodeExecutionFormatter.formatNodeExecution()メソッド
- NodeExecutionData型

**未解決の課題**:
- レスポンスサイズの最適化（Phase 6で対応）

**技術的負債**:
- 入出力アイテムの型が`unknown[]`のまま（将来的に型推論を検討）
