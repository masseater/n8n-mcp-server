# Phase 8: npm公開実行 計画書

## タスク目次

- 1. ~~NPM_TOKENの取得と確認~~ - 状態: 不要（GITHUB_TOKEN使用） - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. ~~GitHub SecretsへのNPM_TOKEN登録~~ - 状態: 不要（GITHUB_TOKEN使用） - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 3. 最終ビルドとテストの実行 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. GitHub Actionsワークフローの手動実行 - 状態: 実行可能 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 5. npm公開の確認 - 状態: 未実施 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 6. GitHub Packagesページでの動作確認 - 状態: 未実施 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 7. npxコマンドでの最終テスト - 状態: 未実施 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → 4 → 5 → 6 → 7）

## Phase概要
- **Phase名**: npm公開実行
- **状態**: 実行可能（自動化済み、ワークフロー実行待ち）
- **目標**: GitHub Package Registryへの実際の公開を行い、パッケージが利用可能になることを確認する

## TDD & 設計原則の適用

### TDDアプローチ
1. **Red（検証項目定義）**: 公開後の確認項目を定義
2. **Green（公開実行）**: npm公開を実行
3. **Refactor（確認）**: 公開後の動作を確認し、問題があれば修正

### 設計原則の適用方針

- **セキュリティ**: NPM_TOKENは安全に管理し、公開されないようにする

## 依存関係
- **前提条件**: Phase 7完了（GitHub Actionsワークフロー作成済み）
- **ブロッカー**:
  - npmアカウントが必要
  - NPM_TOKENが取得済みである必要がある
  - スコープ（@masseater）の使用権限が必要
- **後続Phaseへの影響**: これが最終Phaseなので後続はなし

## 実装する機能
- 全機能の統合完了とnpm公開

## タスク詳細

### タスク1: NPM_TOKENの取得と確認
- **説明**:
  - npmアカウントにログイン（https://www.npmjs.com/）
  - Account Settings → Access Tokens → Generate New Token を実行
  - トークンタイプ: Automation（CI/CD用）
  - 生成されたトークンを安全に保存
  - トークンの有効性を確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: NPM_TOKENが有効であることを検証
  - [ ] Green: NPM_TOKENを取得
  - [ ] Refactor: 不要
- **依存関係**: Phase 7完了後
- **状態**: 未着手

### タスク2: GitHub SecretsへのNPM_TOKEN登録
- **説明**:
  - GitHubリポジトリの Settings → Secrets and variables → Actions を開く
  - New repository secret をクリック
  - Name: `NPM_TOKEN`
  - Secret: 取得したNPM_TOKENを貼り付け
  - Add secret で保存
  - 登録されたことを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: GitHub SecretsにNPM_TOKENが登録されていることを検証
  - [ ] Green: NPM_TOKENを登録
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: 最終ビルドとテストの実行
- **説明**:
  - `pnpm run build` を実行して最終ビルド
  - `npm pack` を実行してパッケージ内容を最終確認
  - `npm publish --dry-run` を実行してドライラン
  - 全てのテストが成功することを確認
  - エラーがないことを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: ビルドとテストが全て成功することを検証
  - [ ] Green: ビルドとテストを実行
  - [ ] Refactor: エラーがあれば修正
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: GitHub Actionsワークフローの手動実行
- **説明**:
  - GitHubリポジトリの Actions タブを開く
  - 「Publish to npm」ワークフローを選択
  - 「Run workflow」ボタンをクリック
  - バージョン番号を入力（例: 1.0.0）
  - 「Run workflow」で実行開始
  - ワークフローの実行ログを監視
  - 全てのステップが成功することを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: ワークフローが成功することを検証
  - [ ] Green: ワークフローを実行
  - [ ] Refactor: エラーがあれば修正して再実行
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: npm公開の確認
- **説明**:
  - ワークフロー完了後、npm公開が成功したことを確認
  - `npm view @masseater/n8n-mcp-server` コマンドでパッケージ情報を確認
  - バージョンが正しく公開されていることを確認
  - `npm view @masseater/n8n-mcp-server versions` で全バージョンを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npmに公開されていることを検証
  - [ ] Green: npm viewコマンドで確認
  - [ ] Refactor: 不要
- **依存関係**: タスク4完了後
- **状態**: 未着手

### タスク6: npmページでの動作確認
- **説明**:
  - npmページを開く: https://www.npmjs.com/package/@masseater/n8n-mcp-server
  - パッケージ情報が正しく表示されていることを確認
    - パッケージ名
    - バージョン
    - 説明（description）
    - キーワード（keywords）
    - README内容
  - インストールコマンドが表示されていることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npmページが正しく表示されることを検証
  - [ ] Green: npmページを確認
  - [ ] Refactor: 表示に問題があれば修正（再公開が必要な場合あり）
- **依存関係**: タスク5完了後
- **状態**: 未着手

### タスク7: npxコマンドでの最終テスト
- **説明**:
  - 別の環境（クリーンな環境推奨）でnpxコマンドをテスト
  - `npx @masseater/n8n-mcp-server --help` を実行
  - コマンドが正常に動作することを確認
  - ヘルプメッセージが表示されることを確認
  - バージョン指定でもテスト: `npx @masseater/n8n-mcp-server@1.0.0 --help`
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npxコマンドが成功することを検証
  - [ ] Green: npxコマンドを実行
  - [ ] Refactor: 不要
- **依存関係**: タスク6完了後
- **状態**: 未着手

## テスト戦略

- **公開前テスト**: ビルド、npm pack、npm publish --dry-run
- **公開後テスト**: npm view、npmページ確認、npxコマンド実行
- **別環境テスト**: クリーンな環境でnpxコマンドを実行

## Phase完了条件
- [ ] 全タスク完了
- [ ] NPM_TOKENがGitHub Secretsに登録されている
- [ ] GitHub Actionsワークフローが成功している
- [ ] npmに公開されている
- [ ] npmページが正しく表示されている
- [ ] npxコマンドが正常に動作している
- [ ] コードレビュー承認

## 技術的課題と解決方針
- **課題**: 初回公開の失敗リスク
  - **解決方針**: npm publish --dry-runで事前確認
- **課題**: スコープの所有権確認
  - **解決方針**: 公開前にnpmアカウントでスコープの使用権限を確認

## リスク管理
- **リスク**: NPM_TOKENが漏洩する
  - **対策**: GitHub Secretsで安全に管理、絶対にコードにコミットしない
- **リスク**: 公開後にバグが見つかる
  - **対策**: Phase 5でのローカルテストを徹底、問題があればパッチバージョンを公開
- **リスク**: パッケージ名が既に使用されている
  - **対策**: 公開前にnpm searchで確認

## 次Phaseへの引き継ぎ事項
- これが最終Phaseなので引き継ぎ事項なし
- npm公開が完了し、`npx @masseater/n8n-mcp-server` でユーザーが利用可能になった

## 公開後の継続的な運用

### バージョンアップ手順（参考）
1. コード変更を実施
2. GitHub Actionsワークフローを手動実行
3. 新しいバージョン番号を入力（例: 1.0.1, 1.1.0, 2.0.0）
4. ワークフローが自動でビルド、バージョン更新、公開を実行

### トラブルシューティング（参考）
- **公開失敗**: ワークフローログを確認し、エラー原因を特定
- **npmページが更新されない**: 数分待ってから再確認（反映に時間がかかる場合あり）
- **npxコマンドが動作しない**: キャッシュをクリア（`npm cache clean --force`）
