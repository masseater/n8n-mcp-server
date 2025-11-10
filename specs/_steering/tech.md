# Technology Stack

## Architecture

**MCP Server Architecture (Model Context Protocol)**

このプロジェクトは、AI モデルと n8n API の間に位置する MCP サーバーとして機能します。

```
AI Model (Claude) ←→ MCP Client (Claude Desktop) ←→ n8n-mcp-server ←→ n8n API
```

**アーキテクチャパターン**:
- **Layered Architecture**: Server Layer → Tool Layer → Client Layer → Response Layer の 4 層構造
- **Template Method Pattern**: BaseTool/RawTool による共通処理の抽象化
- **Registry Pattern**: ToolRegistry による集中管理
- **Strategy Pattern**: stdio/HTTP の 2 つのトランスポート実装

## Core Technologies

### Primary Language(s)
- **Language**: TypeScript
- **Runtime**: Node.js 22.10.0+
- **Target**: ES2022
- **Module System**: ESNext (ESM)

### Key Dependencies/Libraries

**Core Framework**:
- `@modelcontextprotocol/sdk` (^1.20.1) - MCP プロトコル実装
- `express` (5.1.0) - HTTP トランスポート用 Web フレームワーク

**Validation & Schema**:
- `zod` (^3.23.8) - ランタイム型検証
- `zod-to-json-schema` (3.24.6) - Zod スキーマから JSON Schema への変換

**HTTP Client**:
- `@hey-api/openapi-ts` (0.86.8) - OpenAPI から TypeScript クライアント生成

**Utilities**:
- `remeda` (2.32.0) - TypeScript ファースト関数型ユーティリティ（Lodash の代替）
- `commander` (^14.0.1) - CLI オプション解析
- `winston` (^3.18.3) - 構造化ロギング
- `tslib` (2.8.1) - TypeScript ヘルパー関数

### Development Tools

**Build & Dev**:
- `tsx` (^4.20.6) - TypeScript 実行環境（開発用）
- `typescript` (^5.9.3) - TypeScript コンパイラ

**Code Quality**:
- `eslint` (9.38.0) - ESLint v9 Flat Config
- `typescript-eslint` (8.46.2) - TypeScript ESLint プラグイン
- `knip` (5.66.3) - 未使用コード検出

**Testing**:
- `vitest` (^4.0.2) - 高速テストランナー
- `@vitest/coverage-v8` (^4.0.2) - カバレッジ計測

## Development Standards

### Type Safety

**TypeScript Strict Mode（全て有効）**:
- `strict: true`
- `noImplicitAny: true` - `any` 型の暗黙的使用を禁止
- `strictNullChecks: true` - null/undefined の厳密チェック
- `noImplicitReturns: true` - 明示的な return 必須
- `noUncheckedIndexedAccess: true` - 配列・オブジェクトアクセスの厳密チェック
- `exactOptionalPropertyTypes: true` - オプショナルプロパティの厳密型付け

**コーディング規約**:
- `any` 型の使用は**絶対禁止**
- `interface` より `type` を優先（拡張時のみ `interface` を使用し、コメントで理由を明記）
- Barrel import/export は禁止

### Code Quality

**ESLint**:
- ESLint v9 Flat Config (`eslint.config.ts`)
- TypeScript ESLint 推奨ルール適用
- `.gitignore` ベースの除外設定

**Knip**:
- 未使用のファイル、依存関係、エクスポートを検出
- `knip --fix` による自動修正サポート

**関数型プログラミング**:
- 配列操作は `map`, `filter`, `reduce` を優先
- `push` などの破壊的操作を避ける
- Remeda ライブラリを活用

### Testing

**Vitest**:
- テストフレームワーク: Vitest（Jest 互換、高速）
- カバレッジツール: v8
- テストファイル命名: `*.test.ts` または `__tests__/*.ts`

**TDD 原則**:
- Red-Green-Refactor サイクル
- テストファースト（実装前にテストを書く）
- 型定義だけを先に作ることは禁止

## Development Environment

### Required Tools
- **Node.js**: 22.10.0+ (package.json `engines` フィールドで指定)
- **pnpm**: 10.19.0 (package.json `packageManager` フィールドで指定)
- **Volta**: Node.js/pnpm バージョン管理（推奨）

### Package Manager
- **pnpm**: 高速、効率的なディスク使用、厳密な依存関係管理
- **pnpm workspace**: モノレポ対応（将来的な拡張に備える）

### Common Commands
```bash
# Development
pnpm run dev          # stdio transport で開発サーバー起動
pnpm run dev:http     # HTTP transport で開発サーバー起動（HMR 有効）

# Build
pnpm run build        # TypeScript コンパイル (tsc)
pnpm run clean        # dist/ ディレクトリ削除

# Quality Checks
pnpm run type-check   # 型チェック（emit なし）
pnpm run lint         # ESLint 実行
pnpm run lint:fix     # ESLint 自動修正
pnpm run knip         # 未使用コード検出
pnpm run knip:fix     # 未使用コード自動削除

# Testing
pnpm run test         # テスト実行
pnpm run test:watch   # ウォッチモードでテスト
pnpm run test:coverage # カバレッジ付きテスト

# Production
pnpm start:stdio      # stdio transport で本番起動
pnpm start:http       # HTTP transport で本番起動

# Code Generation
pnpm run generate:client  # OpenAPI から TypeScript クライアント生成
```

## Key Technical Decisions

### 1. **MCP SDK の採用**
- **理由**: Model Context Protocol の標準実装を使用することで、相互運用性を確保
- **代替案**: 独自プロトコル実装
- **トレードオフ**: SDK のバージョンアップ依存があるが、標準準拠のメリットが大きい

### 2. **Remeda 採用（Lodash からの移行）**
- **理由**: TypeScript ファースト設計、Tree-shakable、型推論が優れている
- **代替案**: Lodash, Ramda
- **トレードオフ**: エコシステムは Lodash より小さいが、型安全性とバンドルサイズの改善が顕著

### 3. **Vitest 採用（Jest ではなく）**
- **理由**: ESM ネイティブサポート、高速、Vite エコシステムとの統合
- **代替案**: Jest
- **トレードオフ**: Jest よりエコシステムは小さいが、パフォーマンスと開発体験が優れている

### 4. **@hey-api/openapi-ts の採用**
- **理由**: OpenAPI スキーマから TypeScript クライアントを自動生成、型安全性の確保
- **代替案**: 手動で HTTP クライアント実装
- **トレードオフ**: 生成コードの制御が難しいが、n8n API の変更に自動追従できる

### 5. **2 つのトランスポート実装（stdio + HTTP）**
- **理由**: stdio は MCP クライアント用、HTTP は開発・デバッグ用
- **代替案**: stdio のみ
- **トレードオフ**: 実装複雑度は上がるが、開発体験が大幅に向上（HMR 対応）

### 6. **Zod によるランタイム検証**
- **理由**: TypeScript の型チェックに加えて、実行時の入力検証を行う
- **代替案**: TypeScript 型のみ
- **トレードオフ**: スキーマ定義の重複があるが、ランタイムエラーを防止できる

### 7. **Progressive Execution Loading パターン**
- **理由**: MCP レスポンスサイズ制限（25,000 トークン）を回避し、段階的にデータをロード
- **代替案**: 全データを一度に返す
- **トレードオフ**: AI エージェントが 2 回のツール呼び出しを行う必要があるが、レスポンスサイズを 98% 削減できる

## API Client Generation

### OpenAPI Client Auto-Generation

n8n API クライアントは OpenAPI スキーマから自動生成：

```bash
pnpm run generate:client
```

**生成フロー**:
1. `openapi-ts` が n8n OpenAPI スキーマから TypeScript クライアントを生成
2. `scripts/add-ts-nocheck.sh` が生成ファイルに `@ts-nocheck` を追加（厳密な型チェック回避）
3. 生成コードは `src/generated/` に配置

**注意**: 生成コードは編集しない（再生成時に上書きされる）
