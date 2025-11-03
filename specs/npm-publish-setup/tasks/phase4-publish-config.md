# Phase 4: publishConfig設定 計画書

## タスク目次

- 1. publishConfigフィールドの追加 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 2. registryの設定 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 3. accessの設定 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 4. publishConfig設定の検証 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → 4）

## Phase概要
- **Phase名**: publishConfig設定
- **状態**: 未着手
- **目標**: npm公開レジストリとアクセス設定を行い、公開npmレジストリにスコープ付きパッケージをpublicとして公開できるようにする

## TDD & 設計原則の適用

### TDDアプローチ
1. **Red（検証スクリプト作成）**: publishConfigフィールドが正しく設定されていることを検証するスクリプトを作成
2. **Green（設定実施）**: publishConfigフィールドを追加し、registry とaccess を設定
3. **Refactor（最適化）**: 設定の妥当性を確認

### 設計原則の適用方針

- **最小限の公開**: publishConfigに必要な設定のみを記載

## 依存関係
- **前提条件**: Phase 3完了（filesフィールド設定済み）
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 5以降のnpm publish実行時にこの設定が使用される

## 実装する機能
- 機能1: npm公開設定 - publishConfigフィールドによる公開レジストリとアクセス設定

## タスク詳細

### タスク1: publishConfigフィールドの追加
- **説明**:
  - publishConfigフィールドをpackage.jsonに追加
  - npm公開時の設定を定義
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: publishConfigフィールドが存在することを検証
  - [ ] Green: publishConfigフィールドを追加
    ```json
    {
      "publishConfig": {}
    }
    ```
  - [ ] Refactor: 不要
- **依存関係**: Phase 3完了後
- **状態**: 未着手

### タスク2: registryの設定
- **説明**:
  - publishConfig内にregistryフィールドを追加
  - 公開npmレジストリのURL `https://registry.npmjs.org/` を設定
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: publishConfig.registryが正しいURLであることを検証
  - [ ] Green: registryを設定
    ```json
    {
      "publishConfig": {
        "registry": "https://registry.npmjs.org/"
      }
    }
    ```
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: accessの設定
- **説明**:
  - publishConfig内にaccessフィールドを追加
  - スコープ付きパッケージを公開するため `"public"` に設定
  - デフォルトではスコープ付きパッケージはprivateなので、明示的にpublicを指定
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: publishConfig.accessが "public" であることを検証
  - [ ] Green: accessを設定
    ```json
    {
      "publishConfig": {
        "registry": "https://registry.npmjs.org/",
        "access": "public"
      }
    }
    ```
  - [ ] Refactor: 不要
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: publishConfig設定の検証
- **説明**:
  - publishConfigフィールドの設定が正しいことを検証
  - registry URLが正しいか確認
  - accessが "public" であるか確認
  - package.jsonがJSON形式として有効であるか確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: publishConfigの各フィールドが正しく設定されていることを検証
  - [ ] Green: 設定を確認
  - [ ] Refactor: 不要
- **依存関係**: タスク3完了後
- **状態**: 未着手

## テスト戦略

- **検証スクリプト**:
  - publishConfigフィールドが存在するか検証
  - publishConfig.registryが正しいURLか検証
  - publishConfig.accessが "public" か検証
  - package.jsonがJSON形式として有効か検証

## Phase完了条件
- [ ] 全タスク完了
- [ ] publishConfigフィールドが正しく設定済み
- [ ] registry URLが `https://registry.npmjs.org/` に設定されている
- [ ] accessが `"public"` に設定されている
- [ ] 検証スクリプトが全て成功
- [ ] コードレビュー承認

## 技術的課題と解決方針
- **課題**: スコープ付きパッケージのデフォルトアクセスがprivate
  - **解決方針**: publishConfig.accessを明示的に "public" に設定

## リスク管理
- **リスク**: accessを設定し忘れてprivate公開になる
  - **対策**: 検証スクリプトでaccessフィールドを確認
- **リスク**: registry URLが間違っている
  - **対策**: 検証スクリプトでURL形式を確認

## 次Phaseへの引き継ぎ事項
- Phase 5でnpm packとnpm publish --dry-runを実行し、publishConfig設定が正しく動作するか確認
- publishConfig設定が完了し、npm公開の準備が整った
