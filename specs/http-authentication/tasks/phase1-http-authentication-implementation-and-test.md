# Phase 1: HTTP認証機能の実装とテスト 計画書

## タスク目次

- 1. ✅ POST /mcpハンドラーのリファクタリング（ヘッダー抽出ロジックの準備）
- 2. ✅ ヘッダー抽出とバリデーション機能の実装
- 3. ✅ リクエストスコープのN8nApiClientとToolRegistry生成機能の実装
- 4. ✅ 統合テスト（実際のn8n APIとの接続）
- 5. ✅ CLAUDE.mdのドキュメント更新

## Phase概要
- **Phase名**: HTTP認証機能の実装とテスト
- **状態**: 完了
- **目標**: POST /mcpエンドポイントでX-N8N-API-KEYヘッダーを受け取り、リクエストごとにN8nApiClientを動的に初期化する機能を実装し、動作を保証する

## 開発原則

このPhaseでは `specs/_steering/principles.md` に記載された開発原則を適用します。
各タスクでTDD（Red-Green-Refactor）サイクルを実施してください。

## 依存関係
- **前提条件**: なし
- **ブロッカー**: なし
- **後続Phaseへの影響**: なし（Phase 1のみで完結）

## 実装する機能
- 機能1: HTTPヘッダーからn8n認証情報を抽出（specification.md）
- 機能2: リクエストごとにN8nApiClientを動的に初期化（specification.md）

## タスク詳細

### タスク1: POST /mcpハンドラーのリファクタリング（ヘッダー抽出ロジックの準備）
- **説明**: 現在のPOST /mcpハンドラーを別メソッドに抽出し、ヘッダー抽出ロジックを追加しやすくする
- **状態**: 完了
- **開始日時**: 2025-11-10 19:30
- **TDDステップ**:
  - [x] Red: 既存のPOST /mcpハンドラーの動作を検証する単体テストを作成
  - [x] Green: テストが通ることを確認（リファクタリング前）
  - [x] Refactor: ハンドラーロジックを`handleMcpRequest()`メソッドに抽出
- **依存関係**: なし
- **変更ファイル**: src/server/mcp-server.ts

### タスク2: ヘッダー抽出とバリデーション機能の実装
- **説明**: X-N8N-API-KEYヘッダーを抽出し、存在チェックと型チェックを行う機能を実装
- **状態**: 完了
- **開始日時**: 2025-11-10 19:32
- **TDDステップ**:
  - [x] Red: ヘッダー抽出のテストケースを作成
    - ヘッダーが存在しない場合 → 400 Bad Request
    - ヘッダーが空文字の場合 → 400 Bad Request
    - ヘッダーが配列の場合 → 最初の値を使用
    - ヘッダーが正常な文字列の場合 → API Keyを返す
  - [x] Green: src/server/mcp-server.tsにヘッダー抽出ロジックを実装
  - [x] Refactor: エラーハンドリングを整理
- **依存関係**: タスク1
- **変更ファイル**: src/server/mcp-server.ts

### タスク3: リクエストスコープのN8nApiClientとToolRegistry生成機能の実装
- **説明**: 抽出したAPI Keyを使用して、リクエストごとに新しいN8nApiClientとToolRegistryインスタンスを生成
- **状態**: 完了
- **開始日時**: 2025-11-10 19:35
- **TDDステップ**:
  - [x] Red: リクエストスコープのクライアント生成テストを作成
    - 正しいAPI Keyでクライアントが生成される
    - 生成されたクライアントのgeneratedClient.setConfig()が呼ばれる
    - ToolRegistryが生成され、initialize()とsetupToolHandlers()が呼ばれる
  - [x] Green: src/server/mcp-server.tsに実装
  - [x] Refactor: コードの整理
- **依存関係**: タスク2
- **変更ファイル**: src/server/mcp-server.ts

### タスク4: 統合テスト（実際のn8n APIとの接続）
- **説明**: 実際のn8n APIに対してHTTP認証機能をテスト
- **状態**: 完了
- **開始日時**: 2025-11-10 19:36
- **TDDステップ**:
  - [x] Red: 統合テストを作成
    - 正しいAPI KeyでPOST /mcpを呼び出し → 成功
    - 無効なAPI KeyでPOST /mcpを呼び出し → n8nからの認証エラー
    - ヘッダーなしでPOST /mcpを呼び出し → 400 Bad Request
  - [x] Green: テストが通ることを確認
  - [x] Refactor: テストコードの整理
- **依存関係**: タスク3
- **変更ファイル**: src/server/__tests__/mcp-server-http-auth.test.ts（新規）

### タスク5: CLAUDE.mdのドキュメント更新
- **説明**: HTTP認証の使用方法と必要なヘッダー仕様をCLAUDE.mdに追加
- **状態**: 完了
- **開始日時**: 2025-11-10 19:47
- **TDDステップ**:
  - [x] ドキュメントセクション追加（HTTP Mode Authenticationセクション）
  - [x] curlコマンドの使用例を追加
  - [x] エラーケースの説明を追加
- **依存関係**: タスク4
- **変更ファイル**: CLAUDE.md

## テスト戦略

- **単体テスト**:
  - ヘッダー抽出ロジックの単体テスト
  - リクエストスコープのクライアント生成ロジックの単体テスト
- **統合テスト**:
  - 実際のn8n APIとの接続テスト（正常系・異常系）

## Phase完了条件
- [x] 全タスク完了
- [x] 全テスト通過
- [x] 品質チェックコマンドが成功（pnpm run lint、pnpm run type-check、pnpm run build）
- [x] コードレビュー承認（必要に応じて）

## 技術的課題と解決方針

なし。既存のアーキテクチャを拡張するのみ。

## 次Phaseへの引き継ぎ事項

なし（Phase 1のみで完結）。
