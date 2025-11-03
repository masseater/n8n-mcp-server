# npm公開手順（npm Trusted Publishing使用）

Phase 1-7の実装が完了し、**npm Trusted Publishing（OIDC認証）**を使用した完全自動化を実現しました。

## ✅ 完了済みの準備作業

- [x] package.jsonの設定完了（provenance: true追加）
- [x] LICENSEファイル作成
- [x] README.md更新（npxインストール手順追加）
- [x] GitHub Actionsワークフロー作成（OIDC対応、--provenance使用）
- [x] ビルドとローカルテスト成功
- [x] ES Modules対応（fix-esm-imports.sh）

## 🚀 npm公開の実行方法

### 事前準備（初回のみ、1回だけ）

npmアカウントでパッケージとGitHubリポジトリを関連付ける必要があります：

1. npmにログイン: https://www.npmjs.com/login

2. パッケージページを開く（初回公開前は存在しないため、公開後に設定）
   - または、npm CLIで初回公開時に自動設定される可能性があります

**注意**: npm Trusted Publishingは比較的新しい機能のため、初回公開時にOIDC設定が自動的に行われる可能性があります。

### 公開手順

1. GitHubリポジトリの **Actions** タブを開く

2. 左サイドバーから **"Publish to npm"** ワークフローを選択

3. **"Run workflow"** ボタンをクリック

4. バージョン番号を入力:
   - 初回公開: `1.0.0`

5. **"Run workflow"** をクリックして実行！

**それだけです！** NPM_TOKENの取得やGitHub Secretsへの登録は不要です。

## 🔐 完全自動化の仕組み（npm Trusted Publishing）

1. ✅ **OIDC認証**: GitHub ActionsがOIDCトークンを使ってnpmに認証
2. ✅ **Provenance**: `--provenance`オプションで署名付き公開
3. ✅ **トークン不要**: NPM_TOKENの生成・管理が完全不要
4. ✅ **セキュリティ向上**: 長期トークンの管理リスクを排除

## 📦 公開後の確認

```bash
# パッケージ情報を確認
npm view @masseater/n8n-mcp-server

# npxで即座に使える（設定不要）
npx @masseater/n8n-mcp-server --help
```

## 🎉 メリット

- ✅ NPM_TOKEN不要
- ✅ npm公式レジストリに公開
- ✅ エンドユーザーは設定不要（`npx`で即座に使える）
- ✅ セキュリティ向上（Provenance署名）
- ✅ 完全自動化

## 📚 参考

- npm Trusted Publishing: https://docs.npmjs.com/generating-provenance-statements
- GitHub OIDC: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect

