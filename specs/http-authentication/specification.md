# 詳細仕様書

## 機能要件

### 機能1: HTTPヘッダーからn8n認証情報を抽出
- **概要**: POST /mcpエンドポイントで`X-N8N-API-KEY`ヘッダーを抽出
- **優先度**: High
- **実装Phase**: 未定（plan-phasesで決定後に追加）
- **入出力定義**:
  - **入力**: HTTPリクエストヘッダー（`X-N8N-API-KEY`）
  - **出力**: API Key文字列、またはエラー
- **制約・注意事項**:
  - ヘッダーが複数存在する場合: **不明**（案A: 最初の値、案B: エラー）

### 機能2: リクエストごとにN8nApiClientを動的に初期化
- **概要**: 抽出したAPI Keyで新しいN8nApiClientインスタンスを生成
- **優先度**: High
- **実装Phase**: 未定（plan-phasesで決定後に追加）
- **入出力定義**:
  - **入力**: `apiKey`（string）、`n8nUrl`（環境変数から取得）
  - **出力**: N8nApiClientインスタンス
- **制約・注意事項**:
  - インスタンスのライフサイクル: **不明**（案A: リクエストスコープ、案B: キャッシュ）

## 非機能要件

### セキュリティ
n8n APIへの認証は抽出されたAPI Keyを使用。

## データ要件

既存実装の拡張。新規データモデルなし。

## インターフェース要件

### API仕様

#### POST /mcp
- **リクエストヘッダー**: `X-N8N-API-KEY`（必須）
- **リクエストボディ**: MCP protocol request
- **レスポンス**: MCP protocol response

#### GET /health
変更なし。

## 制約条件

stdio transportは変更しない。
