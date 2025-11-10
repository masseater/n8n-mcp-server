# Phase 1: npm公開設定の準備 計画書

## タスク目次

- 1. [package.jsonへのnpm公開用フィールド追加](#タスク1-packagejsonへのnpm公開用フィールド追加)
- 2. [package.json設定の妥当性検証](#タスク2-packagejson設定の妥当性検証)
- 3. [パッケージ内容の確認](#タスク3-パッケージ内容の確認)

**並列実行の判断基準（明示的並列宣言方式）:**
- デフォルトは全て直列実行
- Phase 1では全てのタスクが直列実行（依存関係が明確）

## Phase概要
- **Phase名**: npm公開設定の準備
- **状態**: 未着手
- **目標**: package.jsonにnpm公開に必要な設定を追加し、公開可能な状態にする

## 開発原則

このPhaseでは `specs/_steering/principles.md` に記載された開発原則を適用します。

**重要な原則**:
- **実用性重視（YAGNI原則）**: 現時点で明確に必要な設定のみを追加する。将来の拡張を予測した設定は行わない
- **設定ミニマリズム**: デフォルト値で十分なフィールドは追加しない（例: registry、engines.pnpmなど）
- **既存実装の尊重**: 既にsrc/index.tsに存在するshebangなど、既存の実装をそのまま活用する
- **npm標準に準拠**: npmベストプラクティスに従い、標準的な設定方法を採用する

## 依存関係
- **前提条件**:
  - 既存のpackage.jsonが存在する
  - TypeScriptビルドが正常に動作する（dist/index.jsが生成される）
  - src/index.tsにshebang (`#!/usr/bin/env node`) が既に存在する
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 2（ビルドとテスト）で本Phase完了後のpackage.jsonを使用してビルド・検証を行う

## 実装する機能
- package.jsonへの`bin`フィールド追加（npxコマンド実行を可能にする）
- package.jsonへの`files`フィールド追加（公開ファイルの明示的制御）
- package.jsonへの`publishConfig`フィールド追加（公開レジストリとアクセス設定）
- package.jsonへの`repository`フィールド追加（ソースコードリンク表示）
- パッケージ内容の検証（npm packによる事前確認）

## タスク詳細

### タスク1: package.jsonへのnpm公開用フィールド追加
- **説明**:
  npm公開に必要な最小限のフィールドをpackage.jsonに追加する。以下の4つのフィールドを追加:

  1. `bin`: npxコマンドで実行するエントリーポイントを指定
     ```json
     "bin": {
       "n8n-mcp-server": "dist/index.js"
     }
     ```

  2. `files`: 公開に含めるファイルを明示的に指定（README.md、LICENSE、package.jsonはnpmがデフォルトで含めるため記載不要）
     ```json
     "files": [
       "dist/"
     ]
     ```

  3. `publishConfig`: 公開レジストリとアクセス設定（スコープ付きパッケージをpublicで公開するため必須）
     ```json
     "publishConfig": {
       "access": "public"
     }
     ```
     注: `registry`フィールドはデフォルト（https://registry.npmjs.org/）を使用するため省略

  4. `repository`: GitHubリポジトリURL（npmページに「Repository」リンクを表示するため必須）
     ```json
     "repository": {
       "type": "git",
       "url": "https://github.com/masseater/n8n-mcp-server.git"
     }
     ```

- **状態**: 未着手
- **開始日時**:
- **実装ステップ**:
  - [ ] 既存のpackage.jsonを読み込む
  - [ ] `bin`フィールドを追加（コマンド名: `n8n-mcp-server`、パス: `dist/index.js`）
  - [ ] `files`フィールドを追加（含めるファイル: `dist/`のみ）
  - [ ] `publishConfig`フィールドを追加（`access: "public"`のみ）
  - [ ] `repository`フィールドを追加（GitHubリポジトリURL）
  - [ ] package.jsonをフォーマットして保存
- **依存関係**: なし
- **検証方法**:
  - package.jsonが有効なJSON形式であること
  - 追加したフィールドが正しい構造であること
  - `bin`フィールドのパスが`dist/index.js`であること
  - `files`フィールドに`dist/`が含まれていること
  - `publishConfig.access`が`"public"`であること
  - `repository.type`が`"git"`であること

### タスク2: package.json設定の妥当性検証
- **説明**:
  追加した設定が正しく機能することを検証する。以下の項目を確認:

  1. TypeScriptビルドが成功し、dist/index.jsが生成されること
  2. dist/index.jsにshebang (`#!/usr/bin/env node`) が含まれていること（src/index.tsから引き継がれている）
  3. package.jsonが有効なJSON形式であること（npm publish時にエラーにならない）
  4. 必須フィールドが全て揃っていること（name, version, description, main, type, bin, files, publishConfig, repository等）

- **状態**: 未着手
- **開始日時**:
- **実装ステップ**:
  - [ ] `pnpm run build`を実行してdist/ディレクトリを生成
  - [ ] dist/index.jsの存在を確認
  - [ ] dist/index.jsの1行目がshebangであることを確認（`grep -m 1 '^#!/usr/bin/env node' dist/index.js`）
  - [ ] `npm publish --dry-run`を実行して公開可能性を確認（実際には公開しない）
  - [ ] ドライランの出力にエラーや警告がないことを確認
- **依存関係**: タスク1
- **検証方法**:
  - `pnpm run build`が成功すること（exit code 0）
  - dist/index.jsファイルが存在すること
  - dist/index.jsの1行目が`#!/usr/bin/env node`であること
  - `npm publish --dry-run`がエラーなく完了すること
  - ドライラン出力に`npm notice`が含まれ、パッケージ情報が正しく表示されること

### タスク3: パッケージ内容の確認
- **説明**:
  `npm pack`コマンドでtarballを生成し、公開されるファイルの内容を確認する。以下を検証:

  1. dist/ディレクトリが含まれていること
  2. README.md、LICENSE、package.jsonが含まれていること（npmのデフォルト挙動）
  3. 開発用ファイルが含まれていないこと（src/, tests/, specs/, .github/, node_modules/, tsconfig.json, vitest.config.ts, eslint.config.js等）
  4. 機密情報ファイルが含まれていないこと（.env, .env.*等）
  5. TypeScript型定義ファイル（.d.ts）がdist/内に含まれていること

- **状態**: 未着手
- **開始日時**:
- **実装ステップ**:
  - [ ] `npm pack`を実行してtarballを生成（例: `masseater-n8n-mcp-server-1.0.0.tgz`）
  - [ ] `tar -tzf [tarball名]`を実行してtarball内容をリスト表示
  - [ ] dist/ディレクトリが含まれていることを確認
  - [ ] README.md、LICENSE、package.jsonが含まれていることを確認
  - [ ] 開発用ファイル（src/, tests/, specs/等）が含まれていないことを確認
  - [ ] .envファイルが含まれていないことを確認
  - [ ] TypeScript型定義ファイル（.d.ts）がdist/内に含まれていることを確認
  - [ ] tarballファイルを削除（クリーンアップ）
- **依存関係**: タスク2
- **検証方法**:
  - tarball内に`package/dist/`ディレクトリが存在すること
  - tarball内に`package/README.md`、`package/LICENSE`、`package/package.json`が存在すること
  - tarball内に`package/src/`、`package/tests/`、`package/specs/`が**存在しない**こと
  - tarball内に`package/.env`が**存在しない**こと
  - tarball内に`package/dist/*.d.ts`ファイルが存在すること（TypeScript型定義）
  - tarballサイズが妥当であること（目安: < 1MB）

## Phase完了条件
- [ ] package.jsonに必須フィールド（bin, files, publishConfig, repository）が追加されている
- [ ] `pnpm run build`が成功し、dist/index.jsが生成される
- [ ] dist/index.jsにshebangが含まれている
- [ ] `npm publish --dry-run`がエラーなく完了する
- [ ] `npm pack`で生成されたtarballに正しいファイルのみが含まれている（開発用ファイル、機密情報は除外）
- [ ] TypeScript型定義ファイル（.d.ts）がdist/内に含まれている

## 次Phaseへの引き継ぎ事項
- package.jsonの設定が完了し、npm公開可能な状態になっている
- Phase 2では、本Phase完了後のpackage.jsonを使用してローカルテスト（`npm install -g ./[tarball]`、`npx n8n-mcp-server`）を実施する
