# Phase 1: ExecutionFormatter実装 計画書

## タスク目次

- 1. [ExecutionSummaryレスポンス構造の設計] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 2. [統計情報計算ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 3. [availableNodes抽出ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 4. [期間計算ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 5. [ガイダンス生成ロジックの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 6. [formatSummary()メソッドの統合] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 7. [ExecutionFormatterユニットテストの実装] - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て直列実行（タスク間に依存関係あり）

**並列実行の判断基準（明示的並列宣言方式）:**
- このPhaseでは並列実行可能なタスクなし

## Phase概要
- **Phase名**: ExecutionFormatter実装
- **状態**: 未着手
- **目標**: 実行データのサマリー形式への変換機能を実装し、MCPレスポンス制限（25,000 tokens）内に収めるExecutionSummaryを生成する

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: 各計算ロジック（統計情報、availableNodes、期間、ガイダンス）のテストケースを先に作成
2. **Green（最小実装）**: テストを通すための最小限の実装、過剰な設計を避ける
3. **Refactor（リファクタリング）**: Remeda等のユーティリティライブラリを活用したコード品質向上

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: ExecutionFormatterは実行データのサマリー変換のみを担当。各計算ロジック（統計情報、availableNodes、期間）は個別のprivateメソッドに分離
- **開放/閉鎖の原則 (OCP)**: formatSummary()の公開インターフェースは変更せず、内部の計算ロジックを拡張可能に設計
- **リスコフの置換原則 (LSP)**: ExecutionDetailInternalを受け取り、ExecutionSummaryを返すというシグネチャを一貫して保つ
- **最小限の公開**: formatSummary()のみをpublicとし、計算ロジックはprivateメソッドで隠蔽
- **依存性逆転の原則 (DIP)**: ExecutionDetailInternal（n8n APIの型）に直接依存するが、計算ロジックは純粋関数として実装

⚠️ **インターフェースや抽象クラスは使用しない**: ExecutionFormatterは具体的なクラスとして実装

## 依存関係
- **前提条件**: なし（このPhaseがプロジェクトの起点）
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 2（get_execution拡張）でExecutionFormatterを利用

## 実装する機能
- ExecutionSummaryを返すformatSummary()メソッド
- 統計情報計算（totalNodes, executedNodes, successfulNodes, failedNodes, totalItemsProcessed）
- availableNodes抽出（nodeName, nodeType, status）
- 期間計算（startedAt, stoppedAt → duration）
- ガイダンス生成（次のツール呼び出し例の提示）

## タスク詳細

### タスク1: ExecutionSummaryレスポンス構造の設計
- **説明**:
  - ExecutionSummaryの構造を設計し、TypeScript型として実装
  - フィールド: id, workflowId, workflowName, status, startedAt, stoppedAt, duration, statistics, availableNodes, _guidance
  - specification.mdとtechnical-details.mdの仕様に準拠
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: ExecutionSummaryの構造を検証するテストケース作成
  - [ ] Green: ExecutionSummaryの型実装
  - [ ] Refactor: 必要に応じて型を整理
- **依存関係**: なし
- **状態**: 未着手

### タスク2: 統計情報計算ロジックの実装
- **説明**:
  - calculateStatistics() privateメソッドの実装
  - ExecutionDetailInternalのrunDataから以下を計算:
    - totalNodes: Object.keys(runData).length
    - executedNodes: totalNodesと同じ（実行されたノードのみがrunDataに含まれる）
    - successfulNodes: errorプロパティがないノードの数
    - failedNodes: errorプロパティがあるノードの数
    - totalItemsProcessed: 全ノードの出力アイテム数の合計
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: calculateStatistics()のテストケース作成（正常ケース、エラーケース、0件ケース）
  - [ ] Green: 最小実装（forループまたはRemedaのsumBy等を使用）
  - [ ] Refactor: Remedaを活用した関数型スタイルへのリファクタリング
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: availableNodes抽出ロジックの実装
- **説明**:
  - extractAvailableNodes() privateメソッドの実装
  - runDataから各ノードの情報を抽出:
    - nodeName: runDataのキー（AIエージェントが人間に報告する際に使用）
    - nodeType: node.type（例: "n8n-nodes-base.httpRequest"）
    - status: errorがあれば"error"、なければ"success"
  - 返り値: Array<{ nodeName: string, nodeType: string, status: "success" | "error" }>
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: extractAvailableNodes()のテストケース作成（正常ノード、エラーノード、混在ケース）
  - [ ] Green: Object.keys()とmapを使用した実装
  - [ ] Refactor: Remedaのmapやfilterを活用した最適化
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク4: 期間計算ロジックの実装
- **説明**:
  - calculateDuration() privateメソッドの実装
  - startedAtとstoppedAtから期間（ミリ秒）を計算
  - どちらかが存在しない場合はundefinedを返す
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: calculateDuration()のテストケース作成（正常ケース、stoppedAtなし、startedAtなし）
  - [ ] Green: Date.getTime()を使用した実装
  - [ ] Refactor: エッジケースの処理を明確化
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク5: ガイダンス生成ロジックの実装
- **説明**:
  - generateGuidance() privateメソッドの実装
  - AIエージェントに次のツール呼び出し例を提示
  - メッセージ: "Use get_execution_by_node tool to fetch detailed data for a specific node"
  - 例: `get_execution_by_node(id: '${execution.id}', nodeName: 'HTTP Request')`
  - availableNodesの最初のnodeNameを使用
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: generateGuidance()のテストケース作成（availableNodesあり、なし）
  - [ ] Green: テンプレート文字列を使用した実装
  - [ ] Refactor: メッセージの明確化
- **依存関係**: タスク3完了後（availableNodesを使用）
- **状態**: 未着手

### タスク6: formatSummary()メソッドの統合
- **説明**:
  - formatSummary(execution: ExecutionDetailInternal): ExecutionSummaryの実装
  - タスク2-5で実装した各privateメソッドを呼び出し
  - ExecutionSummaryオブジェクトを組み立てて返す
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: formatSummary()の統合テストケース作成（全フィールドの検証）
  - [ ] Green: 各privateメソッドを呼び出してExecutionSummaryを組み立て
  - [ ] Refactor: オブジェクト生成ロジックの最適化
- **依存関係**: タスク2, 3, 4, 5完了後
- **状態**: 未着手

### タスク7: ExecutionFormatterユニットテストの実装
- **説明**:
  - execution-formatter.test.tsの作成
  - 各privateメソッドのテスト（タスク2-5で作成済みのものを整理）
  - formatSummary()の統合テスト（複数シナリオ: 正常実行、エラー含む実行、空データ）
  - レスポンスサイズ検証（目標: 500-1,000 tokens）
- **開始日時**: （未着手の場合は空欄）
- **TDDステップ**:
  - [ ] Red: 統合テストケースの追加（エッジケース、レスポンスサイズ検証）
  - [ ] Green: 既存テストの整理と追加実装
  - [ ] Refactor: テストコードの重複削減、テストユーティリティ関数の作成
- **依存関係**: タスク6完了後
- **状態**: 未着手

## テスト戦略

- **単体テスト**:
  - 各privateメソッド（calculateStatistics, extractAvailableNodes, calculateDuration, generateGuidance）の振る舞いを検証
  - formatSummary()の統合テスト
- **レスポンスサイズ検証**:
  - ExecutionSummaryのJSONシリアライズ後のサイズが500-1,000 tokens以内であることを確認
  - 大規模実行データ（12ノード、100アイテム）でのテスト

## Phase完了条件
- [ ] 全タスク完了
- [ ] 全テスト通過
- [ ] 品質チェックコマンドが成功（`pnpm run type-check`, `pnpm run lint`, `pnpm run test`）
- [ ] ExecutionSummaryのレスポンスサイズが1,000 tokens以内

## 技術的課題と解決方針

**課題1: runDataの構造が複雑**
- runDataはネストしたオブジェクト構造（runData[nodeName].data.main[0]等）
- 解決方針: 型ガードを使用してsafeにアクセス、存在しない場合はデフォルト値を返す

**課題2: totalItemsProcessedの計算**
- 各ノードの出力アイテム数を合計する必要がある
- 解決方針: Remedaのsumまたはreduceを使用して合計計算

**課題3: レスポンスサイズの見積もり**
- 実装前にサイズを正確に見積もるのは困難
- 解決方針: テスト段階でJSON.stringify()のlengthを測定し、必要に応じて調整

## リスク管理

**リスク1: runDataの構造が仕様書と異なる**
- 影響度: 中
- 対策: 実際のn8n APIレスポンスを確認し、構造を検証
- 緩和策: 型ガードとオプショナルチェーンを使用して柔軟に対応

**リスク2: レスポンスサイズが目標を超過**
- 影響度: 低
- 対策: availableNodesの数を制限（例: 最初の10ノードのみ）
- 緩和策: Phase 2でContextMinimizerを適用

## 次Phaseへの引き継ぎ事項

**Phase 2で利用可能になる機能**:
- ExecutionFormatter.formatSummary()メソッド
- ExecutionSummary型

**未解決の課題**:
- なし（このPhaseで完結）

**技術的負債**:
- なし
