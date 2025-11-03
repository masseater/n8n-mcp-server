# Phase 7: GitHub Actionsワークフロー作成 計画書

## タスク目次

- 1. .github/workflowsディレクトリの確認・作成 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. publish.ymlファイルの作成 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 3. ワークフロートリガーの設定 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. ジョブステップの実装 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 5. NPM_TOKEN認証の設定 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 6. ワークフローYAML構文の検証 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → 4 → 5 → 6）

## Phase概要
- **Phase名**: GitHub Actionsワークフロー作成
- **状態**: 完了
- **目標**: npm公開を自動化するGitHub Actionsワークフローを作成し、手動トリガーでバージョンを指定して公開できるようにする

## TDD & 設計原則の適用

### TDDアプローチ
1. **Red（検証スクリプト作成）**: ワークフローYAMLが正しい構文であることを検証するスクリプトを作成
2. **Green（実装）**: ワークフローファイルを作成
3. **Refactor（最適化）**: ワークフローの効率性を確認し、不要なステップを削除

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: ワークフローは「npm公開」という単一の責任のみを持つ
- **セキュリティ**: NPM_TOKENはGitHub Secretsで管理

## 依存関係
- **前提条件**: Phase 6完了（README更新済み）
- **ブロッカー**: NPM_TOKENがGitHub Secretsに設定されている必要がある
- **後続Phaseへの影響**: Phase 8で実際にワークフローを手動実行してnpm公開を行う

## 実装する機能
- 機能5: GitHub Actionsワークフロー - npm公開を自動化する手動トリガーワークフロー

## タスク詳細

### タスク1: .github/workflowsディレクトリの確認・作成
- **説明**:
  - .github/workflowsディレクトリの存在を確認
  - 存在しない場合は作成
  - ディレクトリのパーミッションを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: .github/workflowsディレクトリが存在することを検証
  - [ ] Green: ディレクトリを作成（必要な場合）
  - [ ] Refactor: 不要
- **依存関係**: Phase 6完了後
- **状態**: 未着手

### タスク2: publish.ymlファイルの作成
- **説明**:
  - .github/workflows/publish.ymlファイルを新規作成
  - 基本的なワークフロー構造を定義
  - ワークフロー名を「Publish to npm」に設定
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: publish.ymlファイルが存在することを検証
  - [ ] Green: publish.ymlファイルを作成
    ```yaml
    name: Publish to npm
    ```
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: ワークフロートリガーの設定
- **説明**:
  - workflow_dispatch（手動トリガー）を設定
  - バージョン番号を入力パラメータとして定義
  - 入力パラメータは必須（required: true）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: workflow_dispatchトリガーが正しく設定されていることを検証
  - [ ] Green: トリガーを設定
    ```yaml
    on:
      workflow_dispatch:
        inputs:
          version:
            description: 'Version to publish (e.g., 1.0.0)'
            required: true
            type: string
    ```
  - [ ] Refactor: 説明文を分かりやすく調整
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: ジョブステップの実装
- **説明**:
  - publishジョブを定義
  - ubuntu-latestで実行
  - 以下のステップを実装:
    1. リポジトリをチェックアウト（actions/checkout@v4）
    2. Node.js 22.10.0をセットアップ（actions/setup-node@v4）
    3. pnpm 10.19.0をセットアップ（pnpm/action-setup@v4）
    4. 依存関係をインストール（pnpm install）
    5. ビルドを実行（pnpm run build）
    6. package.jsonのバージョンを更新（npm version）
    7. npm publishを実行
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: 全てのステップが正しく定義されていることを検証
  - [ ] Green: ジョブステップを実装
    ```yaml
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
  - [ ] Refactor: ステップの順序を確認し、最適化
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: NPM_TOKEN認証の設定
- **説明**:
  - npm publishステップでNODE_AUTH_TOKEN環境変数を設定
  - GitHub SecretsからNPM_TOKENを取得
  - actions/setup-nodeでregistry-urlを設定
  - NPM_TOKENがGitHub Secretsに設定されていることを確認（Phase 8で実施）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npm publishステップでNODE_AUTH_TOKENが設定されていることを検証
  - [ ] Green: 認証設定を確認
  - [ ] Refactor: 不要
- **依存関係**: タスク4完了後
- **状態**: 未着手

### タスク6: ワークフローYAML構文の検証
- **説明**:
  - YAML構文が正しいことを検証
  - インデントが正しいことを確認
  - 必要に応じて `yamllint` で検証
  - GitHub Actionsのワークフロー構文に準拠していることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: YAML構文が正しいことを検証
  - [ ] Green: 構文エラーがあれば修正
  - [ ] Refactor: 不要
- **依存関係**: タスク5完了後
- **状態**: 未着手

## テスト戦略

- **YAML構文検証**: yamllintでYAML構文を検証
- **ワークフロー構文検証**: GitHub CLIまたはアクションのスキーマで検証
- **ドライラン**: GitHub Actionsのワークフローエディタでプレビュー

## Phase完了条件
- [x] 全タスク完了
- [x] .github/workflows/publish.ymlが作成されている
- [x] ワークフロートリガーが正しく設定されている
- [x] 全てのジョブステップが実装されている
- [x] NPM_TOKEN認証が設定されている
- [x] YAML構文が正しい
- [x] コードレビュー承認

## 技術的課題と解決方針
- **課題**: npm versionコマンドがgitコミットを作成しようとする
  - **解決方針**: `--no-git-tag-version` フラグを使用してgitタグ作成を無効化
- **課題**: pnpmのセットアップ方法
  - **解決方針**: pnpm/action-setup@v4を使用

## リスク管理
- **リスク**: NPM_TOKENがGitHub Secretsに設定されていない
  - **対策**: Phase 8でワークフロー実行前にNPM_TOKENを設定
- **リスク**: ワークフローが失敗する
  - **対策**: 各ステップにエラーハンドリングを追加（必要に応じて）

## 次Phaseへの引き継ぎ事項
- Phase 8でNPM_TOKENをGitHub Secretsに設定する必要がある
- Phase 8でワークフローを手動実行してnpm公開を行う
- GitHub Actionsワークフローが完成し、自動化の準備が整った
