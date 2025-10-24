# n8n-mcp-server 検証レポート

## 検証概要

- **検証日時**: 2025-10-24
- **検証者**: Claude Code
- **検証対象**: n8n-mcp-server の各MCP関数
- **検証目的**: 実装した各関数が実際の使用に耐えうるか検証する

## 検証環境

- n8nバージョン: (記入)
- n8n-mcp-serverバージョン: (記入)
- Node.jsバージョン: (記入)

## 検証対象関数

1. `list_workflows` - ワークフロー一覧の取得
2. `get_workflow` - 特定ワークフローの詳細取得
3. `create_workflow` - ワークフローの作成
4. `update_workflow` - ワークフローの更新
5. `activate_workflow` - ワークフローのアクティブ化
6. `deactivate_workflow` - ワークフローの非アクティブ化
7. `delete_workflow` - ワークフローの削除

---

## 検証結果

### 1. list_workflows

#### テストケース
- [x] 全ワークフローの取得
- [x] activeフィルタを使用した取得
- [x] limitパラメータを使用した取得

#### 実行コマンド/パラメータ

**テスト1: 全ワークフロー取得**
```json
{}
```

**テスト2: activeフィルタ使用**
```json
{
  "active": true
}
```

**テスト3: limit使用**
```json
{
  "limit": 3
}
```

#### 実行結果

**テスト1: 全ワークフロー取得**
- 10件のワークフローを取得
- 各ワークフローに id, name, active, tags, createdAt, updatedAt, nodeCount が含まれる
- データ構造は正常

**テスト2: activeフィルタ使用**
- アクティブなワークフローのみ3件取得
- フィルタリングが正しく動作

**テスト3: limit使用**
- 指定した3件のみ取得
- limit機能が正常に動作

#### 評価
- **ステータス**: ⭕️成功
- **所要時間**: 各リクエスト約1秒未満
- **備考**: 全てのパラメータが期待通りに動作。レスポンスのデータ構造も適切。

---

### 2. get_workflow

#### テストケース
- [x] 存在するワークフローIDでの取得
- [x] 存在しないワークフローIDでのエラーハンドリング

#### 実行コマンド/パラメータ

**テスト1: 存在するワークフローID**
```json
{
  "id": "B7BTHBkOQlYg1kvQ"
}
```

**テスト2: 存在しないワークフローID**
```json
{
  "id": "INVALID_ID_12345"
}
```

#### 実行結果

**テスト1: 存在するワークフローID**
- 成功: ワークフローの詳細情報を取得
- レスポンスに id, name, active, tags, createdAt, updatedAt, nodes, connections, settings が含まれる
- list_workflowsと異なり、nodesの詳細情報（各ノードのid, name, type, position, disabledなど）も取得可能
- connectionsとsettingsの内容も取得可能

**テスト2: 存在しないワークフローID**
- エラー: `HTTP 404: Not Found`
- 適切なエラーハンドリング

#### 評価
- **ステータス**: ⭕️成功
- **所要時間**: 約1秒未満
- **備考**: list_workflowsとget_workflowで取得できる情報の粒度が適切に分離されている。get_workflowはノードの詳細まで含む完全な情報を返す。

---

### 3. create_workflow

#### テストケース
- [x] 最小構成でのワークフロー作成
- [ ] 複数ノードを含むワークフロー作成
- [x] 不正なパラメータでのエラーハンドリング

#### 実行コマンド/パラメータ

**テスト1: connectionsなし（エラーケース）**
```json
{
  "name": "MCP Test Workflow",
  "nodes": [{"parameters": {}, "name": "Start", "type": "n8n-nodes-base.start", "typeVersion": 1, "position": [250, 300]}]
}
```

**テスト2: settingsなし（エラーケース）**
```json
{
  "name": "MCP Test Workflow",
  "nodes": [{"parameters": {}, "name": "Start", "type": "n8n-nodes-base.start", "typeVersion": 1, "position": [250, 300]}],
  "connections": {}
}
```

**テスト3: 最小構成（成功ケース）**
```json
{
  "name": "MCP Test Workflow",
  "nodes": [{"parameters": {}, "name": "Start", "type": "n8n-nodes-base.start", "typeVersion": 1, "position": [250, 300]}],
  "connections": {},
  "settings": {}
}
```

#### 実行結果

**テスト1: connectionsなし**
- エラー: `HTTP 400: request/body must have required property 'connections'`
- エラーハンドリング正常

**テスト2: settingsなし**
- エラー: `HTTP 400: request/body must have required property 'settings'`
- エラーハンドリング正常

**テスト3: 最小構成**
- 成功: ワークフローID `B7BTHBkOQlYg1kvQ` が作成された
- レスポンスに id, name, active, tags, createdAt, updatedAt, nodeCount が含まれる
- active: false（デフォルト）
- nodeCount: 1

#### 評価
- **ステータス**: ⚠️要改善
- **所要時間**: 約1秒未満
- **備考**:
  - 機能自体は正常動作
  - connectionsとsettingsが必須パラメータであることが判明（ドキュメント化が必要）
  - エラーメッセージは適切だが、ツール定義でrequiredに含めるべき
- **作成されたワークフローID**: B7BTHBkOQlYg1kvQ

---

### 4. update_workflow

#### テストケース
- [x] ワークフロー名の更新
- [x] ノードの追加/変更
- [x] 不正なパラメータでのエラーハンドリング

#### 実行コマンド/パラメータ

**テスト1: 名前のみ更新（失敗）**
```json
{
  "id": "B7BTHBkOQlYg1kvQ",
  "name": "MCP Test Workflow - Updated"
}
```

**テスト2: 名前+ノード（失敗）**
```json
{
  "id": "B7BTHBkOQlYg1kvQ",
  "name": "MCP Test Workflow - Updated",
  "nodes": [{"parameters": {}, "name": "Start", "type": "n8n-nodes-base.start", "typeVersion": 1, "position": [250, 300]}]
}
```

**テスト3: 全パラメータ指定（失敗）**
```json
{
  "id": "B7BTHBkOQlYg1kvQ",
  "name": "MCP Test Workflow - Updated",
  "nodes": [{"parameters": {}, "name": "Start", "type": "n8n-nodes-base.start", "typeVersion": 1, "position": [250, 300]}, {"parameters": {}, "name": "Code", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [450, 300]}],
  "connections": {"Start": {"main": [[{"node": "Code", "type": "main", "index": 0}]]}},
  "settings": {}
}
```

#### 実行結果

**テスト1: 名前のみ更新**
- エラー: `HTTP 400: request/body must have required property 'nodes'`
- nodesが必須パラメータであることが判明

**テスト2: 名前+ノード**
- エラー: `HTTP 400: request/body must have required property 'connections'`
- connectionsが必須パラメータであることが判明

**テスト3: 全パラメータ指定**
- エラー: `HTTP 400: request/body/id is read-only`
- **重大な問題**: リクエストボディにidが含まれている

#### 評価
- **ステータス**: ❌失敗
- **所要時間**: 各リクエスト約1秒未満
- **備考**:
  - **重大なバグ発見**: MCP toolのスキーマ定義（src/server/mcp-server.ts:574）で `inputSchema: updateWorkflowSchema.shape` を使用しているため、zodのshapeがそのまま渡され、idパラメータがリクエストボディに含まれてしまう
  - サーバー側の実装（src/server/mcp-server.ts:577）では`const { id, ...workflowData } = args;`でidを除外しているが、MCPプロトコルレベルでidが送信されているため、n8n APIでエラーになる
  - update操作には nodes, connections, settings が全て必須
  - **修正が必要**: inputSchemaの定義方法を修正する必要がある

---

### 5. activate_workflow

#### テストケース
- [x] 非アクティブなワークフローのアクティブ化
- [ ] 既にアクティブなワークフローへの処理（前提条件のエラーにより未実施）

#### 実行コマンド/パラメータ

**テスト1: 非アクティブなワークフローのアクティブ化**
```json
{
  "id": "B7BTHBkOQlYg1kvQ"
}
```

#### 実行結果

**テスト1: 非アクティブなワークフローのアクティブ化**
- エラー: `HTTP 405: PATCH method not allowed`
- **重大な問題**: n8n APIはPATCHメソッドをサポートしていない

#### 評価
- **ステータス**: ❌失敗
- **所要時間**: 約1秒未満
- **備考**:
  - **重大なバグ発見**: src/clients/n8n-api-client.ts:416でPATCHメソッドを使用しているが、n8n APIはPATCHをサポートしていない
  - **修正が必要**: PUTメソッドに変更する必要がある
  - activate/deactivate機能が完全に動作していない状態

---

### 6. deactivate_workflow

#### テストケース
- [x] 非アクティブなワークフローへの非アクティブ化処理
- [ ] アクティブなワークフローの非アクティブ化（前提条件のエラーにより未実施）

#### 実行コマンド/パラメータ

**テスト1: 非アクティブなワークフローへの非アクティブ化処理**
```json
{
  "id": "B7BTHBkOQlYg1kvQ"
}
```

#### 実行結果

**テスト1: 非アクティブなワークフローへの非アクティブ化処理**
- エラー: `HTTP 405: PATCH method not allowed`
- activate_workflowと同じ根本原因

#### 評価
- **ステータス**: ❌失敗
- **所要時間**: 約1秒未満
- **備考**:
  - activate_workflowと同じsetWorkflowActive関数を使用しているため、同じエラーが発生
  - PATCHメソッドの問題は共通の実装に起因

---

### 7. delete_workflow

#### テストケース
- [x] 存在するワークフローの削除
- [x] 存在しないワークフローの削除時のエラーハンドリング

#### 実行コマンド/パラメータ

**テスト1: 存在するワークフローの削除**
```json
{
  "id": "B7BTHBkOQlYg1kvQ"
}
```

**テスト2: 存在しないワークフローの削除**
```json
{
  "id": "INVALID_ID_12345"
}
```

#### 実行結果

**テスト1: 存在するワークフローの削除**
- 成功: `{"success": true, "message": "Workflow B7BTHBkOQlYg1kvQ deleted successfully."}`
- ワークフローが正常に削除された
- レスポンス形式が適切

**テスト2: 存在しないワークフローの削除**
- エラー: `HTTP 404: Not Found`
- 適切なエラーハンドリング

#### 評価
- **ステータス**: ⭕️成功
- **所要時間**: 約1秒未満
- **備考**: 削除機能は正常に動作。エラーハンドリングも適切。

---

## 総合評価

### 成功した機能
- ✅ **list_workflows**: 全パラメータ（フィルタ、limit）が正常動作
- ✅ **get_workflow**: 詳細情報の取得、エラーハンドリングが正常動作
- ✅ **delete_workflow**: 削除処理、エラーハンドリングが正常動作

### 失敗した機能
- ❌ **update_workflow**: 完全に動作不可（inputSchemaの実装問題）
- ❌ **activate_workflow**: 完全に動作不可（HTTPメソッドの問題）
- ❌ **deactivate_workflow**: 完全に動作不可（HTTPメソッドの問題）

### 改善が必要な機能
- ⚠️ **create_workflow**: 動作するが、connections と settings が必須パラメータであることがドキュメント化されていない

### 発見された問題点

#### 1. update_workflow の致命的なバグ（src/server/mcp-server.ts:574）
- **問題**: `inputSchema: updateWorkflowSchema.shape` の使用により、zodスキーマのshapeプロパティがそのまま渡される
- **影響**: MCPツール呼び出し時にidパラメータがリクエストボディに含まれ、n8n APIが`HTTP 400: request/body/id is read-only`エラーを返す
- **根本原因**: MCP SDKが期待するスキーマ形式とzodのshapeプロパティの不整合
- **修正方法**: inputSchemaを適切なJSON Schemaまたはzodスキーマの正しい形式に変更する必要がある

#### 2. activate/deactivate_workflow の致命的なバグ（src/clients/n8n-api-client.ts:416）
- **問題**: HTTPメソッドとしてPATCHを使用しているが、n8n APIはPATCHをサポートしていない
- **影響**: `HTTP 405: PATCH method not allowed` エラーが発生し、ワークフローのアクティブ化/非アクティブ化が完全に動作しない
- **根本原因**: n8n API仕様の理解不足
- **修正方法**: PATCHメソッドをPUTメソッドに変更する

#### 3. create_workflow/update_workflow の必須パラメータ問題
- **問題**: connections と settings が必須パラメータだが、ツール定義でoptionalになっている
- **影響**: ユーザーが省略してエラーになる可能性が高い
- **修正方法**: ツール定義のrequired配列にconnectionsとsettingsを追加する

### 推奨される改善事項

#### 優先度: 高（本番使用に必須）
1. **update_workflowのinputSchema修正** (src/server/mcp-server.ts:574)
   - `inputSchema: updateWorkflowSchema.shape` を適切な形式に変更
   - idパラメータをスキーマから除外するか、別の方法で処理

2. **activate/deactivate_workflowのHTTPメソッド修正** (src/clients/n8n-api-client.ts:416)
   - `this.httpClient.patch` を `this.httpClient.put` に変更

3. **create_workflow/update_workflowの必須パラメータ定義** (src/server/mcp-server.ts:470-487)
   - connectionsとsettingsをrequiredに変更
   - またはデフォルト値`{}`を設定

#### 優先度: 中（ユーザビリティ向上）
4. **ドキュメント整備**
   - 各ツールの使用例を含むREADMEの作成
   - 必須パラメータの明確化
   - エラーメッセージの改善

5. **統合テストの追加**
   - 今回発見されたバグを検出できる自動テストの実装
   - CI/CDパイプラインへの組み込み

### 総合スコア
- **全体的な評価**: ❌不合格
- **本番使用可否**: ❌不可
  - 7機能中3機能が完全に動作しない状態
  - CRUD操作の中核であるUpdate（更新）が動作しないのは致命的
  - ワークフローの有効化/無効化が不可能

**本番使用可能になるための条件:**
1. 上記「優先度: 高」の3つの問題を全て修正
2. 修正後の再検証を実施
3. 全機能が正常動作することを確認

---

## 備考・その他

### 良かった点
- list_workflows、get_workflow、delete_workflowは非常に安定して動作
- エラーハンドリングは概ね適切
- レスポンス形式は一貫性がある
- n8n APIとの基本的な連携は確立されている

### 検証環境の情報不足
以下の情報は検証中に取得できませんでした：
- n8nバージョン
- n8n-mcp-serverバージョン
- Node.jsバージョン

これらは後ほど追記が必要です。

### 次のステップ
1. 発見されたバグの修正作業
2. 修正後の再検証
3. 統合テストの実装
4. ドキュメント整備
5. 本番リリースの判断
