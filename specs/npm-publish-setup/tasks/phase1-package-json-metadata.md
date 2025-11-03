# Phase 1: package.json基本メタデータ設定 計画書

## タスク目次

- 1. package.jsonのnameフィールド確認・更新 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 2. package.jsonのversionフィールド確認 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 3. package.jsonのdescriptionフィールド確認・更新 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 4. package.jsonのkeywordsフィールド確認・更新 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 5. package.jsonのauthorフィールド確認 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 6. package.jsonのlicenseフィールド確認 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor
- 7. package.jsonのenginesフィールド確認 - 状態: 未着手 - TDD: ⬜ Red / ⬜ Green / ⬜ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → ... → 7）

## Phase概要
- **Phase名**: package.json基本メタデータ設定
- **状態**: 未着手
- **目標**: パッケージ名、バージョン、基本情報の設定を完了し、npm公開の基礎を整える

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseではpackage.jsonの設定が中心のため、従来のTDDサイクルではなく、以下のアプローチを適用します：

1. **Red（検証スクリプト作成）**: package.jsonの必須フィールドが正しく設定されているか検証するスクリプトを作成
2. **Green（設定実施）**: 必要な設定を追加・更新
3. **Refactor（最適化）**: 冗長な記述を削除し、標準的な形式に整える

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: 各タスクは単一のフィールド設定に焦点を当てる
- **最小限の公開**: 必要な情報のみをpackage.jsonに記載

## 依存関係
- **前提条件**: package.jsonが既に存在すること
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 2（binフィールド設定）で必要な基本メタデータが整う

## 実装する機能
- 機能1: npm公開設定 - パッケージ名とメタデータ設定

## タスク詳細

### タスク1: package.jsonのnameフィールド確認・更新
- **説明**:
  - 現在のnameフィールドを確認
  - スコープ付きパッケージ名 `@masseater/n8n-mcp-server` に更新
  - スコープ（@masseater）の所有権を事前確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: nameフィールドがスコープ付きであることを検証するスクリプト作成
  - [ ] Green: nameフィールドを `@masseater/n8n-mcp-server` に設定
  - [ ] Refactor: 不要
- **依存関係**: なし
- **状態**: 未着手

### タスク2: package.jsonのversionフィールド確認
- **説明**:
  - 現在のversionフィールドを確認
  - 初回公開のため `1.0.0` であることを確認
  - セマンティックバージョニングに従っていることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: versionフィールドがセマンティックバージョニング形式であることを検証
  - [ ] Green: 必要に応じて `1.0.0` に設定
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: package.jsonのdescriptionフィールド確認・更新
- **説明**:
  - descriptionフィールドを確認
  - 「Model Context Protocol server for n8n workflow automation platform」に設定
  - npm検索で見つかりやすい説明文であることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: descriptionフィールドが存在し、空でないことを検証
  - [ ] Green: 適切な説明文を設定
  - [ ] Refactor: 簡潔で分かりやすい表現に調整
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: package.jsonのkeywordsフィールド確認・更新
- **説明**:
  - keywordsフィールドを確認・追加
  - 以下のキーワードを設定: `["n8n", "mcp", "model-context-protocol", "workflow", "automation"]`
  - npm検索での発見性を向上させる
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: keywordsフィールドが配列形式で存在することを検証
  - [ ] Green: 適切なキーワードを配列で設定
  - [ ] Refactor: 重複キーワードを削除
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: package.jsonのauthorフィールド確認
- **説明**:
  - authorフィールドを確認
  - 既存の値を保持、または必要に応じて更新
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: authorフィールドが存在することを検証（空でも可）
  - [ ] Green: 既存値を確認、必要なら更新
  - [ ] Refactor: 不要
- **依存関係**: タスク4完了後
- **状態**: 未着手

### タスク6: package.jsonのlicenseフィールド確認
- **説明**:
  - licenseフィールドを確認
  - MITライセンスであることを確認
  - LICENSEファイルの存在も確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: licenseフィールドが "MIT" であることを検証
  - [ ] Green: licenseフィールドを確認、必要なら設定
  - [ ] Refactor: 不要
- **依存関係**: タスク5完了後
- **状態**: 未着手

### タスク7: package.jsonのenginesフィールド確認
- **説明**:
  - enginesフィールドを確認
  - Node.js 22.10.0以上が必要であることを確認
  - `"node": "^22.10.0"` が設定されていることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: enginesフィールドが存在し、適切なNode.jsバージョンが指定されていることを検証
  - [ ] Green: 既存値を確認
  - [ ] Refactor: 不要
- **依存関係**: タスク6完了後
- **状態**: 未着手

## テスト戦略

- **検証スクリプト**: package.jsonの各フィールドが正しく設定されているか検証するスクリプトを作成
  - nameがスコープ付きであるか
  - versionがセマンティックバージョニング形式であるか
  - 必須フィールド（description, license, engines）が存在するか

## Phase完了条件
- [ ] 全タスク完了
- [ ] package.jsonの基本メタデータが全て設定済み
- [ ] 検証スクリプトが全て成功
- [ ] コードレビュー承認

## 技術的課題と解決方針
- **課題**: スコープ（@masseater）の所有権確認
  - **解決方針**: npmアカウントでスコープの使用権限を事前確認

## リスク管理
- **リスク**: パッケージ名が既に使用されている
  - **対策**: npm検索で事前に名前の重複を確認
- **リスク**: スコープの所有権がない
  - **対策**: npm公開前にスコープの使用許可を取得

## 次Phaseへの引き継ぎ事項
- Phase 2で使用するパッケージ名 `@masseater/n8n-mcp-server` が確定
- 基本メタデータが整い、binフィールド設定の準備が完了
