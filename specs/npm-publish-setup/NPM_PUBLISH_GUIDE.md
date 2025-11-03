# npm公開手順ガイド

Phase 1-7の実装が完了しました。Phase 8（npm公開実行）を実施するための手順をまとめます。

## ✅ 完了済みの準備作業

- [x] package.jsonの設定完了（name, bin, files, publishConfig）
- [x] LICENSEファイル作成
- [x] README.md更新（npxインストール手順追加）
- [x] GitHub Actionsワークフロー作成（.github/workflows/publish.yml）
- [x] ビルドとローカルテスト成功
- [x] npm publish --dry-run成功
- [x] npxコマンドでの動作確認成功

## 📋 Phase 8: npm公開実行の手順

### ステップ1: NPM_TOKENの取得

1. npmアカウントにログイン
   - URL: https://www.npmjs.com/login

2. Access Tokenを生成
   - Account Settings → Access Tokens → Generate New Token
   - トークンタイプ: **Automation**（CI/CD用）
   - 生成されたトークンをコピーして安全に保存

### ステップ2: GitHub SecretsへのNPM_TOKEN登録

1. GitHubリポジトリを開く
   - URL: https://github.com/[username]/n8n-mcp-server

2. Settings → Secrets and variables → Actions を開く

3. "New repository secret" をクリック

4. シークレットを追加:
   - Name: `NPM_TOKEN`
   - Secret: ステップ1で取得したNPM_TOKENを貼り付け
   - "Add secret" をクリック

### ステップ3: スコープ（@masseater）の確認

npm公開前に、@masseaterスコープの使用権限を確認してください:

1. npmで@masseaterスコープを検索
   - URL: https://www.npmjs.com/search?q=%40masseater

2. スコープが存在しない場合は使用可能です

3. スコープが既に存在する場合:
   - 所有者に使用許可を得る
   - または、別のスコープ名に変更する

### ステップ4: GitHub Actionsワークフローの手動実行

1. GitHubリポジトリの"Actions"タブを開く
   - URL: https://github.com/[username]/n8n-mcp-server/actions

2. 左サイドバーから"Publish to npm"ワークフローを選択

3. "Run workflow"ボタンをクリック

4. バージョン番号を入力:
   - 初回公開: `1.0.0`

5. "Run workflow"をクリックして実行開始

6. ワークフローの実行ログを監視:
   - 全てのステップが成功することを確認
   - エラーが発生した場合はログを確認

### ステップ5: npm公開の確認

ワークフロー完了後、以下のコマンドで公開を確認:

```bash
# パッケージ情報を確認
npm view @masseater/n8n-mcp-server

# バージョンを確認
npm view @masseater/n8n-mcp-server version

# 全バージョンを確認
npm view @masseater/n8n-mcp-server versions
```

### ステップ6: npmページでの動作確認

1. npmページを開く:
   - URL: https://www.npmjs.com/package/@masseater/n8n-mcp-server

2. 以下が正しく表示されていることを確認:
   - パッケージ名: @masseater/n8n-mcp-server
   - バージョン: 1.0.0
   - 説明文（description）
   - キーワード（keywords）
   - README内容

### ステップ7: npxコマンドでの最終テスト

別の環境（クリーンな環境推奨）でnpxコマンドをテスト:

```bash
# ヘルプを表示
npx @masseater/n8n-mcp-server --help

# バージョン指定でもテスト
npx @masseater/n8n-mcp-server@1.0.0 --help
```

## 🎉 完了！

全てのステップが成功したら、npm公開が完了です。

ユーザーは以下のコマンドで即座に使用可能になります:

```bash
npx @masseater/n8n-mcp-server
```

## 🔄 今後のバージョンアップ手順

新しいバージョンを公開する場合:

1. コードを変更してコミット

2. GitHub Actionsワークフローを手動実行
   - バージョン番号を入力（例: 1.0.1, 1.1.0, 2.0.0）

3. ワークフローが自動で以下を実行:
   - 依存関係のインストール
   - ビルド
   - package.jsonのバージョン更新
   - npm publish

## ❓ トラブルシューティング

### エラー: "need auth"
- 原因: NPM_TOKENが設定されていない
- 解決策: ステップ2を再確認

### エラー: "package name already exists"
- 原因: 同名パッケージが既に存在
- 解決策: パッケージ名を変更（package.jsonのnameフィールド）

### エラー: "missing bin entry"
- 原因: binフィールドに指定されたファイルが存在しない
- 解決策: `pnpm run build`を実行してdist/index.jsを生成

### エラー: "no permission to publish"
- 原因: @masseaterスコープの使用権限がない
- 解決策: スコープの所有者に許可を得るか、別のスコープ名に変更

### 警告: "no repository field"
- これは警告であり、無視しても公開可能です
- 必要に応じてpackage.jsonにrepositoryフィールドを追加できます

