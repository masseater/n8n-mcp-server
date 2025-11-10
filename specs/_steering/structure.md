# Project Structure

## Directory Organization

```
n8n-mcp-server/
├── src/
│   ├── clients/        # n8n API クライアント
│   ├── config/         # 設定管理
│   ├── errors/         # カスタムエラー
│   ├── formatters/     # レスポンス最適化
│   ├── generated/      # OpenAPI 自動生成（編集禁止）
│   ├── schemas/        # Zod スキーマ
│   ├── server/         # MCP サーバー
│   ├── tools/          # MCP ツール実装
│   │   ├── base/       # BaseTool, RawTool
│   │   └── implementations/  # 11 tools
│   ├── types/          # 型定義
│   └── utils/          # 汎用ユーティリティ
├── specs/
│   ├── _steering/      # プロジェクト方針
│   └── [taskname]/     # タスク別仕様書（SDD）
├── CLAUDE.md           # 開発ガイド（詳細）
└── README.md           # ユーザーガイド
```

**アーキテクチャ**:
- **4層構造**: Server → Tool → Client → Response
- **Test Co-location**: `__tests__/` でテスト配置
- **Generated Code Isolation**: `generated/` は手動編集禁止

## Naming Conventions

- **ファイル**: kebab-case.ts（例: `mcp-server.ts`）
- **ディレクトリ**: kebab-case（例: `tool-registry`）
- **クラス/型**: PascalCase（例: `MCPServerImpl`）
- **関数/変数**: camelCase（例: `getWorkflows`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_CONTEXT_SIZE`）
- **Interface**: `I` プレフィックス（例: `INode`）※ `type` 優先、拡張時のみ使用

## Module Boundaries

**4層アーキテクチャ**（依存は上位→下位のみ）:
1. **Server Layer** (`src/server/`) - MCP プロトコル実装、ツール登録
2. **Tool Layer** (`src/tools/`) - ツール実装、入力検証
3. **Client Layer** (`src/clients/`) - n8n API 通信
4. **Response Layer** (`src/formatters/`) - レスポンス最適化

**原則**:
- 単一責任、循環参照禁止
- 共通処理は `base/` または `utils/` に配置
- 依存性注入（`ToolContext`）でテスタビリティ確保

## Import/Export Rules

- **Barrel Import/Export 禁止**: 直接インポートのみ
- **名前付きエクスポート優先**: デフォルトエクスポート禁止

## 重要ディレクトリ

- **`src/generated/`**: OpenAPI 自動生成（手動編集禁止）
- **`specs/_steering/`**: プロジェクト方針（`/sdd:*` コマンドが参照）
- **`CLAUDE.md`**: 開発ガイド（アーキテクチャ、実装詳細）
