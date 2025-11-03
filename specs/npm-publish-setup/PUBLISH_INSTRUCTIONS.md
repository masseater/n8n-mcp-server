# npm公開手順（完全自動化版）

Phase 1-7の実装が完了し、npm公開が完全自動化されました。

## ✅ 完了済みの準備作業

- [x] package.jsonの設定完了（GitHub Package Registry対応）
- [x] LICENSEファイル作成
- [x] README.md更新（npxインストール手順、.npmrc設定手順追加）
- [x] GitHub Actionsワークフロー作成（GITHUB_TOKEN使用）
- [x] ビルドとローカルテスト成功
- [x] ES Modules対応（fix-esm-imports.sh）

## 🚀 npm公開の実行方法

### ステップ1: GitHub Actionsワークフローを手動実行

1. GitHubリポジトリの **Actions** タブを開く

2. 左サイドバーから **"Publish to GitHub Packages"** ワークフローを選択

3. **"Run workflow"** ボタンをクリック

4. バージョン番号を入力:
   - 初回公開: `1.0.0`
   - 以降: セマンティックバージョニングに従う（例: 1.0.1, 1.1.0, 2.0.0）

5. **"Run workflow"** をクリックして実行開始

6. ワークフローの実行ログを監視:
   - 全てのステップが成功することを確認（緑色のチェックマーク）
   - エラーが発生した場合はログを確認

**それだけです！** NPM_TOKENの取得やGitHub Secretsへの登録は不要です。

## 🎯 完全自動化の仕組み

GitHub Package Registryを使用することで、以下が自動化されています:

1. ✅ **認証**: GITHUB_TOKENが自動的に使用される
2. ✅ **依存関係インストール**: ワークフロー内で自動実行
3. ✅ **ビルド**: ワークフロー内で自動実行（ES Modules修正含む）
4. ✅ **バージョン更新**: 入力されたバージョン番号で自動更新
5. ✅ **公開**: GitHub Package Registryに自動公開

## 📦 公開後の確認

### GitHub Packagesページで確認

1. GitHubリポジトリのページを開く

2. 右サイドバーの **"Packages"** セクションを確認

3. `@masseater/n8n-mcp-server` が表示されていることを確認

### コマンドラインで確認

```bash
# ユーザー側で初回のみ.npmrc設定
echo "@masseater:registry=https://npm.pkg.github.com" >> ~/.npmrc

# パッケージ情報を確認
npm view @masseater/n8n-mcp-server

# npxで実行テスト
npx @masseater/n8n-mcp-server --help
```

## 🔄 今後のバージョンアップ

新しいバージョンを公開する場合:

1. コードを変更してコミット・プッシュ

2. GitHub ActionsのActionsタブを開く

3. "Publish to GitHub Packages" → "Run workflow"

4. 新しいバージョン番号を入力（例: 1.0.1）

5. 実行！

**それだけです！** 全て自動で処理されます。

## 🎉 メリット

- ✅ NPM_TOKENの取得不要
- ✅ GitHub Secretsの設定不要
- ✅ npmアカウント不要
- ✅ 完全自動化
- ✅ GitHubとの完全統合

## ℹ️ ユーザー側の設定

エンドユーザーが`npx @masseater/n8n-mcp-server`を使用する際、初回のみ以下の設定が必要:

```bash
echo "@masseater:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

この設定は一度だけ実行すれば、以降は通常のnpxコマンドで使用できます。
