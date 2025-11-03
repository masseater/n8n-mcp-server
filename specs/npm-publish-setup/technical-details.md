# 技術詳細ドキュメント

## アーキテクチャ

### システム構成図
```
[ユーザー]
    ↓ npx [パッケージ名]
[npmレジストリ]
    ↓ ダウンロード
[ローカルキャッシュ]
    ↓ 実行
[dist/index.js]
    ↓ 起動
[n8n-mcp-server]
    ↓ 接続
[n8n API]
```

### 技術スタック
- **ランタイム**: Node.js 22.10.0以上
- **パッケージマネージャー**: pnpm 10.19.0
- **言語**: TypeScript 5.9.3 → JavaScript (ES Module)
- **ビルドツール**: tsc (TypeScript Compiler)
- **配布**: npm registry

### インフラ構成
- **npm公開**:
  - 公開レジストリ（registry.npmjs.org）
  - パッケージ名: `@masseater/n8n-mcp-server`
  - GitHub Actionsでの自動化（手動トリガー、バージョン指定）
- **実行環境**: ユーザーのローカル環境
- **依存関係**: npm/npxによる自動解決

## 技術選定

### npm公開方式
- **採用技術**: npm publish コマンド
- **理由**:
  - 標準的なnpm公開フロー
  - npmエコシステムとの高い互換性
  - npxコマンドによる即座の実行サポート
- **代替案**:
  - **案A**: GitHub Packages Registry
    - 利点: GitHubとの統合、プライベートパッケージの無料ホスティング
    - 欠点: npmトークンとは別の認証が必要、ユーザー側で追加設定が必要
  - **案B**: 独自のnpmレジストリ（Verdaccio等）
    - 利点: 完全なコントロール、プライベート管理
    - 欠点: インフラ維持コスト、npx実行時の追加設定

### パッケージ名の方式
- **採用**: `@masseater/n8n-mcp-server`（スコープ付き）
- **理由**:
  - 名前の衝突回避
  - 組織管理が容易
  - スコープ（@masseater）の所有権確認が必要（Phase 1で実施）

### binフィールドの設定方式
- **採用技術**: package.jsonの`bin`フィールド
- **理由**:
  - npm標準の実行可能ファイル指定方法
  - npxコマンドとの完全な互換性
- **設定例**（単一コマンド）:
  ```json
  {
    "bin": {
      "n8n-mcp-server": "./dist/index.js"
    }
  }
  ```
- **採用**: 単一コマンド（n8n-mcp-server）
- **理由**: シンプル、現在の実装に最適、将来的な拡張も可能

## データ設計

### package.json 設計

#### 必須フィールド
```json
{
  "name": "@masseater/n8n-mcp-server",
  "version": "1.0.0",
  "description": "Model Context Protocol server for n8n workflow automation platform",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "n8n-mcp-server": "./dist/index.js"
  },
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ],
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  },
  "engines": {
    "node": "^22.10.0"
  },
  "keywords": [
    "n8n",
    "mcp",
    "model-context-protocol",
    "workflow",
    "automation"
  ],
  "author": "",
  "license": "MIT"
}
```

#### publishConfig
公開レジストリでスコープ付きパッケージを公開するため、publishConfigは必須フィールドに含まれています（上記参照）。

#### files フィールド
公開に含めるファイルを明示的に指定:
```json
{
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ]
}
```

除外されるファイル（デフォルトまたは.npmignore）:
- src/
- tests/
- specs/
- .github/
- node_modules/
- tsconfig.json
- vitest.config.ts
- eslint.config.js
- .env
- .env.*

### dist/index.js の要件
- **shebang**: 追加しない（npmの自動処理に任せる）
- **実行権限**: chmod +x不要（npmが自動で設定）
- **ES Module形式**: package.jsonに`"type": "module"`が設定済み

## API設計

### CLIインターフェース

#### コマンド形式
```bash
npx [パッケージ名] [options]
```

#### オプション（既存のComamnder.js設定を継承）
- `--n8n-url <url>`: n8n instance URL
- `--api-key <key>`: n8n API key
- `--log-level <level>`: Log level (error|warn|info|debug)
- `--transport <type>`: Transport type (stdio|http)
- `--port <number>`: Port number for HTTP transport

#### 環境変数（既存設定を継承）
- `N8N_URL`: n8n instance URL
- `N8N_API_KEY`: n8n API key
- `LOG_LEVEL`: Log level

### npm公開API

#### 認証
- npmトークン（NPM_TOKEN）を使用
- 2FAは無効（シンプルな認証フローを優先）
- GitHub Actionsでの手動トリガー実行
- NPM_TOKENはGitHub Secretsで管理

#### 公開コマンド
```bash
# ローカルビルド
pnpm run build

# パッケージ内容確認
npm pack

# 公開（ドライラン）
npm publish --dry-run

# 実際の公開
npm publish
```

#### バージョニング
- セマンティックバージョニングに従う（MAJOR.MINOR.PATCH）
- GitHub Actionsの手動トリガーで実行時にバージョンを指定
- 自動pushによる発火は不要

### GitHub Actions ワークフローAPI

#### ワークフロー構造
```yaml
name: Publish to npm

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to publish (e.g., 1.0.0)'
        required: true
        type: string

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.10.0'
          registry-url: 'https://registry.npmjs.org'
      - uses: pnpm/action-setup@v4
        with:
          version: '10.19.0'
      - run: pnpm install
      - run: pnpm run build
      - run: npm version ${{ inputs.version }} --no-git-tag-version
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### トリガー方式
- **手動トリガー（workflow_dispatch）**: GitHubのActionsタブから手動で実行
- **入力パラメータ**: バージョン番号（required）

#### 認証
- NPM_TOKENをGitHub Secretsに設定
- NODE_AUTH_TOKENとして環境変数に渡す
- 2FAは無効（シンプルな認証フローを優先）

#### ジョブフロー
1. リポジトリをチェックアウト
2. Node.js 22.10.0をセットアップ
3. pnpm 10.19.0をセットアップ
4. 依存関係をインストール（pnpm install）
5. ビルドを実行（pnpm run build）
6. package.jsonのバージョンを更新（npm version）
7. npmに公開（npm publish）

#### エラーハンドリング
- 各ステップが失敗した場合はワークフローを中断
- npm publish失敗時はエラーログを出力
- GitHub Actionsのログで詳細を確認可能

## セキュリティ

### npm公開時のセキュリティ
1. **機密情報の除外**:
   - `.env`ファイルを`files`フィールドまたは`.npmignore`で除外
   - APIキー、シークレット等を含まないことを確認

2. **パッケージ整合性**:
   - `npm pack`で内容を事前確認
   - tarball内に不要なファイルが含まれていないことを検証

3. **アクセス制御**:
   - npmアカウントの2FAは無効（シンプルな認証フローを優先）
   - 公開アクセス（public）でスコープ付きパッケージを公開
   - publishConfigで`"access": "public"`を明示

4. **依存関係のセキュリティ**:
   - 既存の依存パッケージのセキュリティ監査
   - `npm audit`による脆弱性チェック

### 実行時のセキュリティ
- ユーザーが環境変数でAPIキーを設定する方式（既存実装を継承）
- コマンドライン引数でのAPIキー渡しも可能（既存実装を継承）

## 開発環境

### 必要なツール
1. **Node.js**: 22.10.0以上
   - インストール: [https://nodejs.org/](https://nodejs.org/)
   - または Volta: `volta install node@22.10.0`

2. **pnpm**: 10.19.0
   - インストール: `npm install -g pnpm@10.19.0`
   - または Volta: `volta install pnpm@10.19.0`

3. **npmアカウント**:
   - npmアカウントの作成（https://www.npmjs.com/signup）
   - npmトークンの生成（Account Settings → Access Tokens → Generate New Token）
   - トークンをGitHub Secretsに`NPM_TOKEN`として登録

4. **TypeScript**: 5.9.3（devDependenciesに含まれる）

### セットアップ手順

#### 1. 依存関係のインストール
```bash
cd /path/to/n8n-mcp-server
pnpm install
```

#### 2. ビルド
```bash
pnpm run build
```

#### 3. パッケージ内容の確認
```bash
npm pack
tar -tzf n8n-mcp-server-1.0.0.tgz
```

#### 4. ローカルテスト
```bash
# 生成されたtarballからインストール
npm install -g ./n8n-mcp-server-1.0.0.tgz

# npxコマンドでテスト実行
npx n8n-mcp-server --help
```

#### 5. npm公開
```bash
# ドライラン（実際には公開しない）
npm publish --dry-run

# 実際の公開
npm login  # 初回のみ
npm publish
```

### トラブルシューティング

#### エラー: "need auth"
- 原因: npm認証が未完了
- 解決策: `npm login`を実行

#### エラー: "package name already exists"
- 原因: 同名パッケージが既に存在
- 解決策: パッケージ名を変更（スコープ付きにする等）

#### エラー: "missing bin entry"
- 原因: binフィールドに指定されたファイルが存在しない
- 解決策: `pnpm run build`でdist/index.jsを生成

#### 警告: "no repository field"
- 原因: package.jsonにrepositoryフィールドがない
- 解決策（オプション）: repositoryフィールドを追加
  ```json
  {
    "repository": {
      "type": "git",
      "url": "https://github.com/[username]/n8n-mcp-server.git"
    }
  }
  ```

## テスト戦略

このプロジェクトはnpm公開設定のみを扱うため、コード変更を伴わず、自動テストの追加は不要です。

### テストの種類

#### 1. パッケージ内容の検証
- **目的**: 公開パッケージに正しいファイルのみが含まれていることを確認
- **方法**: `npm pack` でtarballを生成し、内容を手動で確認
- **検証項目**:
  - dist/ディレクトリが含まれている
  - README.md, LICENSEが含まれている
  - src/, tests/, specs/などの開発用ファイルが含まれていない
  - .envなどの機密情報が含まれていない

#### 2. ローカル実行テスト
- **目的**: npxコマンドでの実行が正常に動作することを確認
- **方法**: tarballをローカルにインストールして実行
- **テストコマンド**:
  ```bash
  npm install -g ./n8n-mcp-server-1.0.0.tgz
  npx n8n-mcp-server --help
  npx n8n-mcp-server --n8n-url http://localhost:5678 --api-key test
  ```

#### 3. npm公開のドライラン
- **目的**: 実際に公開する前に問題がないことを確認
- **方法**: `npm publish --dry-run` を実行
- **検証項目**:
  - 認証エラーがない
  - パッケージ名の衝突がない
  - 必須フィールドが全て揃っている

### カバレッジ目標
このプロジェクトではコード変更がないため、カバレッジ目標は設定しません。

### テスト実行タイミング
- Phase 2（ビルドとテスト）で上記の全テストを実施
- Phase 3（npm公開）前に再度確認

## npm公開後の確認

### 公開確認手順
1. **npmページの確認**:
   - URL: `https://www.npmjs.com/package/@masseater/n8n-mcp-server`
   - メタデータ、READMEが正しく表示されているか確認

2. **npx実行テスト**:
   ```bash
   # 別の環境で実行
   npx @masseater/n8n-mcp-server --help
   ```

3. **インストールテスト**:
   ```bash
   # グローバルインストール
   npm install -g @masseater/n8n-mcp-server

   # ローカルインストール
   npm install @masseater/n8n-mcp-server
   ```

4. **バージョン確認**:
   ```bash
   npm view @masseater/n8n-mcp-server version
   npm view @masseater/n8n-mcp-server versions
   ```

## 継続的な更新フロー

### バージョンアップ手順
1. コード変更を実施
2. `package.json`のバージョンを更新
   ```bash
   # パッチバージョンアップ (1.0.0 → 1.0.1)
   npm version patch

   # マイナーバージョンアップ (1.0.0 → 1.1.0)
   npm version minor

   # メジャーバージョンアップ (1.0.0 → 2.0.0)
   npm version major
   ```
3. ビルドとテスト
   ```bash
   pnpm run build
   npm pack
   ```
4. 公開
   ```bash
   npm publish
   ```
5. Gitタグのプッシュ
   ```bash
   git push --tags
   ```

### 非推奨化・削除
将来的に必要になった場合の参考コマンド:
```bash
# バージョンを非推奨にする
npm deprecate @masseater/n8n-mcp-server@[バージョン] "メッセージ"

# パッケージ全体を非推奨にする
npm deprecate @masseater/n8n-mcp-server "メッセージ"
```

## 技術的決定事項のまとめ

全ての不明箇所が明確化されました:

1. **パッケージ名**: `@masseater/n8n-mcp-server`（スコープ付き）
2. **npmレジストリ**: 公開レジストリ（registry.npmjs.org）
3. **shebang**: 追加しない（npmの自動処理に任せる）
4. **認証方式**: npmトークン（NPM_TOKEN）、2FAは無効
5. **バージョニング戦略**: GitHub Actionsの手動トリガーでバージョン指定
6. **CI/CD**: GitHub Actionsで自動化（手動トリガー、自動pushによる発火は不要）
7. **CHANGELOG**: 今回のスコープ外（将来的に作成する可能性あり）
8. **binコマンド**: 単一コマンド（n8n-mcp-server）

次のステップ: Phase 1（npm公開設定の準備）の実装を開始可能
