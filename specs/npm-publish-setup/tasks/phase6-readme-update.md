# Phase 6: README更新 計画書

## タスク目次

- 1. README.mdの現在の構造確認 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. Quick Startセクションの特定 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 3. npxインストール手順の追加 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. バージョン指定インストールの記載 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 5. npmページURLの追加 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 6. マークダウン形式の検証 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → 4 → 5 → 6）

## Phase概要
- **Phase名**: README更新
- **状態**: 完了
- **目標**: npm公開後のインストール・使用方法をREADMEに追加し、ユーザーがnpxコマンドで即座に利用できるようにする

## TDD & 設計原則の適用

### TDDアプローチ
1. **Red（検証スクリプト作成）**: READMEに必要なセクションと情報が含まれていることを検証するスクリプトを作成
2. **Green（更新実施）**: READMEにnpxインストール手順を追加
3. **Refactor（最適化）**: 表現を分かりやすく調整し、コードブロックを正しくフォーマット

### 設計原則の適用方針

- **ユーザビリティ**: エンドユーザーが理解しやすい説明を心がける

## 依存関係
- **前提条件**: Phase 5完了（ローカルテスト成功）
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 8でnpm公開後、このREADMEがnpmページに表示される

## 実装する機能
- 機能4: README更新 - npm公開後のインストール・使用方法の記載

## タスク詳細

### タスク1: README.mdの現在の構造確認
- **説明**:
  - README.mdを読み込み、現在のセクション構造を確認
  - Quick Startセクション、Installationセクションの有無を確認
  - 既存のローカルインストール手順を確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: README.mdが存在し、基本的なセクションが含まれていることを検証
  - [ ] Green: README.mdの構造を確認
  - [ ] Refactor: 不要
- **依存関係**: Phase 5完了後
- **状態**: 未着手

### タスク2: Quick Startセクションの特定
- **説明**:
  - Quick StartまたはInstallationセクションを特定
  - セクションが存在しない場合は新規作成
  - npxインストール手順を追加する位置を決定（セクションの最初に追加）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: Quick Startセクションが存在することを検証
  - [ ] Green: セクションを特定または新規作成
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: npxインストール手順の追加
- **説明**:
  - Quick Startセクションの最初にnpxインストール手順を追加
  - 以下の内容を記載:
    ```markdown
    ## Quick Start

    ### Install via npx (Recommended)

    You can run n8n-mcp-server directly using npx without installing it:

    ```bash
    npx @masseater/n8n-mcp-server
    ```
    ```
  - 既存のローカルインストール手順は残す
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: READMEにnpxコマンドが記載されていることを検証
  - [ ] Green: npxインストール手順を追加
  - [ ] Refactor: 表現を分かりやすく調整
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: バージョン指定インストールの記載
- **説明**:
  - バージョン指定でのnpxインストール方法を追記
  - 以下の内容を追加:
    ```markdown
    You can also specify a version:

    ```bash
    npx @masseater/n8n-mcp-server@latest
    npx @masseater/n8n-mcp-server@1.0.0
    ```
    ```
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: バージョン指定の例が記載されていることを検証
  - [ ] Green: バージョン指定の例を追加
  - [ ] Refactor: 不要
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: npmページURLの追加
- **説明**:
  - npmページへのリンクを追加
  - 以下の内容を追加:
    ```markdown
    View on npm: https://www.npmjs.com/package/@masseater/n8n-mcp-server
    ```
  - バッジを追加（オプション）:
    ```markdown
    [![npm version](https://badge.fury.io/js/@masseater%2Fn8n-mcp-server.svg)](https://www.npmjs.com/package/@masseater/n8n-mcp-server)
    ```
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npmページURLが記載されていることを検証
  - [ ] Green: npmページURLを追加
  - [ ] Refactor: バッジ追加を検討（オプション）
- **依存関係**: タスク4完了後
- **状態**: 未着手

### タスク6: マークダウン形式の検証
- **説明**:
  - README.mdのマークダウン形式が正しいことを検証
  - コードブロックが正しくフォーマットされていることを確認
  - リンクが正しく機能することを確認
  - 必要に応じて `npx markdown-lint README.md` で検証
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: マークダウン形式が正しいことを検証
  - [ ] Green: 形式エラーがあれば修正
  - [ ] Refactor: コードブロックや見出しを整える
- **依存関係**: タスク5完了後
- **状態**: 未着手

## テスト戦略

- **検証スクリプト**:
  - READMEに必要なキーワード（npx, @masseater/n8n-mcp-server）が含まれていることを検証
  - マークダウン形式が正しいことを検証
  - コードブロックが正しく閉じられていることを検証

## Phase完了条件
- [x] 全タスク完了
- [x] READMEにnpxインストール手順が追加されている
- [x] バージョン指定の例が記載されている
- [x] npmページURLが記載されている
- [x] マークダウン形式が正しい
- [x] コードブロックが正しくフォーマットされている
- [x] コードレビュー承認

## 技術的課題と解決方針
- **課題**: 既存のREADME構造を壊さずに追加する
  - **解決方針**: Quick Startセクションの最初に追加し、既存手順は残す

## リスク管理
- **リスク**: マークダウン形式が壊れる
  - **対策**: マークダウンリンターで検証
- **リスク**: 既存のインストール手順を誤って削除する
  - **対策**: 既存手順は残し、新しい手順を追加

## 次Phaseへの引き継ぎ事項
- Phase 8でnpm公開後、このREADMEがnpmページに正しく表示されることを確認
- README更新が完了し、ユーザー向けドキュメントが整った
