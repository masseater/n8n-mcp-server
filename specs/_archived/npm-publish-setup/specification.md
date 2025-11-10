# 詳細仕様書

## 機能要件

### 機能1: npm公開設定の追加
- **概要**: package.jsonにnpm公開に必要なフィールドを追加し、npmレジストリへの公開を可能にする
- **優先度**: High
- **実装Phase**: Phase 1
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: package.jsonが存在し、TypeScriptビルドが成功する
  - **基本フロー**:
    1. package.jsonに`bin`フィールドを追加
    2. package.jsonに`files`フィールドを追加（公開ファイルを指定）
    3. `publishConfig`フィールドを追加（公開レジストリとアクセス設定）
    4. `.npmignore`の作成または`files`フィールドでの制御
  - **代替フロー**: なし
  - **事後条件**: npm公開可能な状態のpackage.json
- **入力**:
  - 既存のpackage.json
  - 公開対象ファイルリスト（dist/, README.md, LICENSE等）
- **出力**:
  - 更新されたpackage.json
  - .npmignore（必要に応じて）
- **ビジネスルール**:
  - パッケージ名は`@masseater/n8n-mcp-server`（スコープ付き）
  - `bin`フィールドのコマンド名は`n8n-mcp-server`
  - `files`フィールドには最低限`dist/`、`README.md`、`LICENSE`を含める
  - 開発用ファイル（src/, tests/, specs/など）は公開から除外する
- **バリデーション**:
  - `bin`フィールドのパスが実際に存在するファイルを指していること
  - `files`フィールドに指定されたパスが存在すること
  - package.jsonが有効なJSON形式であること

### 機能2: CLI実行可能ファイルの設定
- **概要**: npxコマンドで実行可能なCLIエントリーポイントを設定する
- **優先度**: High
- **実装Phase**: Phase 1
- **ユースケース**:
  - **アクター**: エンドユーザー
  - **前提条件**: パッケージがnpmに公開されている
  - **基本フロー**:
    1. ユーザーが`npx @masseater/n8n-mcp-server`を実行
    2. npmが最新バージョンをダウンロード
    3. `bin`フィールドに指定されたファイルが実行される
    4. MCPサーバーがstdio transportで起動する（デフォルト）
  - **代替フロー**:
    - `npx @masseater/n8n-mcp-server --transport http --port 3000`でHTTP transportで起動
    - `npx @masseater/n8n-mcp-server --n8n-url <URL> --api-key <KEY>`で環境変数なしで起動
  - **事後条件**: MCPサーバーが実行中の状態
- **入力**:
  - コマンドライン引数（--n8n-url, --api-key, --transport, --port等）
  - 環境変数（N8N_URL, N8N_API_KEY等）
- **出力**:
  - 起動したMCPサーバープロセス
  - ログ出力（stdoutまたはファイル）
- **ビジネスルール**:
  - `dist/index.js`をエントリーポイントとする
  - shebang (`#!/usr/bin/env node`) は既にsrc/index.tsに含まれており、そのまま維持する
  - デフォルトtransportはstdio
  - `--transport stdio`でstdio transport、`--transport http`でHTTP transportを選択可能
- **バリデーション**:
  - dist/index.jsが存在すること
  - dist/index.jsが実行可能であること
  - transportオプションは"stdio"または"http"のみ受け付ける

### 機能3: パッケージ内容の最適化
- **概要**: npm公開時に不要なファイルを除外し、パッケージサイズを最小化する
- **優先度**: Medium
- **実装Phase**: Phase 1
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: package.jsonの`files`フィールドまたは`.npmignore`が設定されている
  - **基本フロー**:
    1. `npm pack`を実行してtarballを生成
    2. tarball内容を確認
    3. 不要なファイルが含まれていないことを検証
  - **代替フロー**: なし
  - **事後条件**: 最適化されたパッケージ
- **入力**:
  - ビルド成果物（dist/）
  - 必須ファイル（README.md, LICENSE, package.json）
- **出力**:
  - 最適化されたtarballファイル
- **ビジネスルール**:
  - 除外すべきファイル: src/, tests/, specs/, .github/, node_modules/, tsconfig.json, vitest.config.ts等
  - 必須ファイル: dist/, README.md, LICENSE, package.json
- **バリデーション**:
  - tarballサイズが妥当であること（目安: < 1MB）
  - 必須ファイルが全て含まれていること

### 機能4: README更新
- **概要**: npm公開後のインストール・使用方法をREADMEに追加する
- **優先度**: Medium
- **実装Phase**: Phase 3
- **ユースケース**:
  - **アクター**: エンドユーザー
  - **前提条件**: パッケージがnpmに公開されている
  - **基本フロー**:
    1. ユーザーがREADME.mdを閲覧
    2. `npx @masseater/n8n-mcp-server`での実行手順を確認
    3. 環境変数の設定方法を確認
    4. stdio/http transportの切り替え方法を確認
    5. 使用例を参照
  - **代替フロー**: なし
  - **事後条件**: ユーザーがnpxコマンドで即座に利用可能
- **入力**:
  - 公開されたパッケージ名（`@masseater/n8n-mcp-server`）
  - npmページURL: `https://www.npmjs.com/package/@masseater/n8n-mcp-server`
- **出力**:
  - 更新されたREADME.md
- **ビジネスルール**:
  - 既存のローカルインストール手順は残す
  - npx実行手順をQuick Startセクションの最初に追加
  - stdio transport（デフォルト）とHTTP transportの両方の例を記載
  - 環境変数とコマンドライン引数の両方の使用方法を記載
  - バージョン指定（`npx @masseater/n8n-mcp-server@latest`）も記載する
- **バリデーション**:
  - マークダウン形式が正しいこと
  - コードブロックが正しくフォーマットされていること
  - 実行例が実際に動作すること

## 非機能要件

### セキュリティ
- npm公開時にAPIキーなどの機密情報が含まれないこと
- .npmignoreまたはfilesフィールドで.envファイルを除外すること
- 2FAは無効（シンプルな認証フローを優先）
- GitHub ActionsでのNPM_TOKENはシークレットとして管理

### パフォーマンス要件
このプロジェクトではnpm公開設定のみを扱うため、パフォーマンス要件は該当しません。

### 可用性要件
このプロジェクトではnpm公開設定のみを扱うため、可用性要件は該当しません。

### 保守性要件
- package.jsonの設定は標準的なnpm仕様に準拠すること
- 将来のバージョンアップ時にも再利用可能な設定であること

### ユーザビリティ要件
- npxコマンドでの実行が直感的であること
- README.mdのインストール手順が明確であること
- エラーメッセージが理解しやすいこと（既存実装を継承）

### 制約条件

#### 技術的制約
- Node.js 22.10.0以上が必要（engines: `>=22.10.0`）
- pnpmパッケージマネージャーの使用
- TypeScriptからJavaScriptへのトランスパイルが必須
- npmアカウントとアクセストークン（NPM_TOKEN）の事前取得が必要
- GitHub Actionsでの手動トリガー実行

#### ビジネス的制約
- パッケージ名は`@masseater/n8n-mcp-server`（スコープ付き）
- 公開npmレジストリ（registry.npmjs.org）で公開
- MITライセンスで公開
- バージョン更新はGitHub Actionsの手動トリガーで実行

#### 法的・規制上の制約
- オープンソースライセンス（MIT）の遵守
- 依存パッケージのライセンス確認
- スコープ（@masseater）の所有権・使用許可の事前確認が必要

## データ要件
- npm公開に必要なメタデータ（name, version, description, keywords等）
- ビルド成果物（dist/）のバージョン管理
- npm公開履歴は今回のスコープ外（将来的にCHANGELOG.mdを作成する可能性あり）

## インターフェース要件
- **npmレジストリとの連携**:
  - npm publish APIの使用
  - 認証方式: npmトークン（NPM_TOKEN）、2FAは無効
  - GitHub ActionsからのNPM_TOKENはシークレットとして安全に管理
- **npxコマンドとの連携**:
  - package.jsonの`bin`フィールドによる実行可能ファイル指定
  - shebangは不要（npmが自動処理）
