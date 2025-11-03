# Phase 2: binフィールドとCLI設定 計画書

## タスク目次

- 1. package.jsonのmainフィールド確認 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. package.jsonのtypeフィールド確認 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 3. dist/index.jsの存在確認 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. package.jsonのbinフィールド追加 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 5. binフィールドのパス検証 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → 4 → 5）

## Phase概要
- **Phase名**: binフィールドとCLI設定
- **状態**: 完了
- **目標**: npxコマンドで実行可能なCLIエントリーポイントを設定し、`npx @masseater/n8n-mcp-server` での実行を可能にする

## TDD & 設計原則の適用

### TDDアプローチ
1. **Red（検証スクリプト作成）**: binフィールドが正しく設定され、パスが存在することを検証するスクリプトを作成
2. **Green（設定実施）**: binフィールドを追加し、dist/index.jsへのパスを設定
3. **Refactor（最適化）**: 設定の妥当性を確認し、不要な記述を削除

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: binフィールドは単一のコマンド（n8n-mcp-server）のみを提供
- **依存性逆転の原則 (DIP)**: dist/index.jsの存在に依存するため、事前確認を実施

## 依存関係
- **前提条件**: Phase 1完了（パッケージ名が確定している）
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 3でfilesフィールド設定時にdist/を含める必要がある

## 実装する機能
- 機能2: 実行可能ファイル設定 - binフィールドによるCLIコマンドの提供

## タスク詳細

### タスク1: package.jsonのmainフィールド確認
- **説明**:
  - mainフィールドが `dist/index.js` を指していることを確認
  - ES Moduleとして正しく設定されていることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: mainフィールドが存在し、dist/index.jsを指していることを検証
  - [ ] Green: 既存値を確認
  - [ ] Refactor: 不要
- **依存関係**: Phase 1完了後
- **状態**: 未着手

### タスク2: package.jsonのtypeフィールド確認
- **説明**:
  - typeフィールドが `"module"` に設定されていることを確認
  - ES Module形式であることを保証
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: typeフィールドが "module" であることを検証
  - [ ] Green: 既存値を確認
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: dist/index.jsの存在確認
- **説明**:
  - dist/index.jsファイルが存在することを確認
  - ビルドが正常に完了していることを確認
  - 存在しない場合は `pnpm run build` を実行
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: dist/index.jsファイルが存在することを検証
  - [ ] Green: ビルドを実行してファイルを生成
  - [ ] Refactor: 不要
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: package.jsonのbinフィールド追加
- **説明**:
  - binフィールドをpackage.jsonに追加
  - コマンド名 `n8n-mcp-server` を設定
  - パス `./dist/index.js` を設定
  - shebangは追加しない（npmの自動処理に任せる）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: binフィールドが存在し、正しい形式であることを検証
  - [ ] Green: binフィールドを追加
    ```json
    {
      "bin": {
        "n8n-mcp-server": "./dist/index.js"
      }
    }
    ```
  - [ ] Refactor: 不要
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: binフィールドのパス検証
- **説明**:
  - binフィールドに指定されたパス（./dist/index.js）が実際に存在するか検証
  - パスが相対パスとして正しいか確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: binフィールドのパスが実際に存在するファイルを指していることを検証
  - [ ] Green: パスの妥当性を確認
  - [ ] Refactor: 不要
- **依存関係**: タスク4完了後
- **状態**: 未着手

## テスト戦略

- **検証スクリプト**:
  - binフィールドが正しく設定されているか検証
  - binフィールドのパスが存在するファイルを指しているか検証
  - package.jsonがJSON形式として有効であるか検証

## Phase完了条件
- [ ] 全タスク完了
- [ ] binフィールドが正しく設定済み
- [ ] dist/index.jsが存在し、ビルドが成功している
- [ ] 検証スクリプトが全て成功
- [ ] コードレビュー承認

## 技術的課題と解決方針
- **課題**: dist/index.jsにshebangが必要かどうか
  - **解決方針**: npmが自動でshebangを処理するため、追加不要

## リスク管理
- **リスク**: ビルドが失敗してdist/index.jsが存在しない
  - **対策**: Phase開始前に `pnpm run build` を実行して確認
- **リスク**: binフィールドのパスが間違っている
  - **対策**: 検証スクリプトでパスの存在を確認

## 次Phaseへの引き継ぎ事項
- Phase 3のfilesフィールド設定で、dist/ディレクトリを公開対象に含める必要がある
- binフィールドが設定され、npxコマンドでの実行準備が整った
