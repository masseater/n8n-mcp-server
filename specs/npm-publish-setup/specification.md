# 詳細仕様書

## 機能要件

### 機能1: package.json基本メタデータ設定
- **概要**: パッケージ名、バージョン、基本情報を設定し、npm公開の基礎を整える
- **優先度**: High
- **実装Phase**: Phase 1
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: package.jsonが存在する
  - **基本フロー**:
    1. package.jsonの`name`フィールドをスコープ付きパッケージ名に設定
    2. `version`フィールドを確認（初回公開: 1.0.0）
    3. `description`フィールドを設定
    4. `keywords`フィールドを設定（npm検索の発見性向上）
    5. `author`、`license`、`engines`フィールドを確認
  - **代替フロー**: なし
  - **事後条件**: 基本メタデータが設定されたpackage.json
- **入力**:
  - 既存のpackage.json
- **出力**:
  - 基本メタデータが更新されたpackage.json
- **ビジネスルール**:
  - パッケージ名は`@masseater/n8n-mcp-server`（スコープ付き）
  - バージョンはセマンティックバージョニングに従う
  - descriptionはnpm検索で見つかりやすい説明文
  - keywordsは関連性の高いキーワードを5つ程度設定
- **バリデーション**:
  - nameがスコープ付きパッケージ名であること
  - versionがセマンティックバージョニング形式であること
  - 必須フィールド（description, license, engines）が存在すること

### 機能2: binフィールドとCLI設定
- **概要**: npxコマンドで実行可能なCLIエントリーポイントを設定する
- **優先度**: High
- **実装Phase**: Phase 2
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: Phase 1完了、dist/index.jsが存在する
  - **基本フロー**:
    1. package.jsonの`main`フィールドを確認（dist/index.js）
    2. `type`フィールドを確認（ES Module形式）
    3. dist/index.jsの存在を確認
    4. `bin`フィールドを追加（コマンド名とパスを設定）
    5. binフィールドのパスが正しいことを検証
  - **代替フロー**: なし
  - **事後条件**: npxコマンドで実行可能な設定が完了
- **入力**:
  - 既存のpackage.json
  - ビルド成果物（dist/index.js）
- **出力**:
  - binフィールドが追加されたpackage.json
- **ビジネスルール**:
  - コマンド名は`n8n-mcp-server`
  - パスは`./dist/index.js`
  - shebangは追加しない（npmの自動処理に任せる）
- **バリデーション**:
  - binフィールドのパスが実際に存在するファイルを指していること
  - dist/index.jsが存在すること

### 機能3: filesフィールドと公開ファイル最適化
- **概要**: 公開に含めるファイルを最適化し、不要なファイルや機密情報を除外する
- **優先度**: High
- **実装Phase**: Phase 3
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: Phase 2完了（binフィールド設定済み）
  - **基本フロー**:
    1. 公開に必要なファイルリストを作成
    2. package.jsonに`files`フィールドを追加
    3. 除外すべきファイル・ディレクトリを確認
    4. .npmignoreファイルの作成要否を判断
    5. 機密情報が除外されていることを確認
  - **代替フロー**: なし
  - **事後条件**: 公開ファイルが最適化されたpackage.json
- **入力**:
  - 既存のpackage.json
  - プロジェクト内のファイル・ディレクトリ
- **出力**:
  - filesフィールドが追加されたpackage.json
  - .npmignore（必要に応じて）
- **ビジネスルール**:
  - filesフィールドには`dist/`, `README.md`, `LICENSE`を含める
  - 開発用ファイル（src/, tests/, specs/など）は除外
  - 機密情報（.env等）は除外
- **バリデーション**:
  - 必須ファイルが全て含まれていること
  - 機密情報が含まれていないこと

### 機能4: publishConfig設定
- **概要**: npm公開レジストリとアクセス設定を行う
- **優先度**: High
- **実装Phase**: Phase 4
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: Phase 3完了（filesフィールド設定済み）
  - **基本フロー**:
    1. package.jsonに`publishConfig`フィールドを追加
    2. registryを設定（https://registry.npmjs.org/）
    3. accessを設定（public）
    4. publishConfig設定を検証
  - **代替フロー**: なし
  - **事後条件**: npm公開の設定が完了
- **入力**:
  - 既存のpackage.json
- **出力**:
  - publishConfigフィールドが追加されたpackage.json
- **ビジネスルール**:
  - registryは公開npmレジストリ（https://registry.npmjs.org/）
  - accessは`public`（スコープ付きパッケージのため明示的に設定）
- **バリデーション**:
  - publishConfig.registryが正しいURLであること
  - publishConfig.accessが`public`であること

### 機能5: ビルドとローカルテスト
- **概要**: npm公開前にビルド確認とローカルテストを実施する
- **優先度**: High
- **実装Phase**: Phase 5
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: Phase 4完了（publishConfig設定済み）
  - **基本フロー**:
    1. ビルドを実行（pnpm run build）
    2. npm packでtarballを生成
    3. tarball内容を検証
    4. npm publish --dry-runを実行
    5. ローカルインストールテストを実施
    6. npxコマンドで実行テストを実施
  - **代替フロー**: テスト失敗時は問題を修正して再実行
  - **事後条件**: パッケージが正常に動作することが確認された
- **入力**:
  - ソースコード（src/）
  - package.json
- **出力**:
  - ビルド成果物（dist/）
  - tarballファイル
  - テスト結果
- **ビジネスルール**:
  - 全てのテストが成功すること
  - tarballサイズが妥当であること（< 1MB）
  - npxコマンドが正常に動作すること
- **バリデーション**:
  - ビルドが成功すること
  - tarballに必須ファイルが含まれていること
  - npxコマンドが正常に実行されること

### 機能6: README更新
- **概要**: npm公開後のインストール・使用方法をREADMEに追加する
- **優先度**: Medium
- **実装Phase**: Phase 6
- **ユースケース**:
  - **アクター**: エンドユーザー
  - **前提条件**: パッケージがnpmに公開されている
  - **基本フロー**:
    1. ユーザーがREADME.mdを閲覧
    2. `npx [パッケージ名]`でのインストール手順を確認
    3. 環境変数の設定方法を確認
    4. 使用例を参照
  - **代替フロー**: なし
  - **事後条件**: ユーザーがnpxコマンドで即座に利用可能
- **入力**:
  - 公開されたパッケージ名（`@masseater/n8n-mcp-server`）
  - npmページURL: `https://www.npmjs.com/package/@masseater/n8n-mcp-server`
- **出力**:
  - 更新されたREADME.md
- **ビジネスルール**:
  - 既存のローカルインストール手順は残す
  - npxインストール手順をQuick Startセクションの最初に追加
  - バージョン指定（`npx @masseater/n8n-mcp-server@latest`）も記載する
- **バリデーション**:
  - マークダウン形式が正しいこと
  - コードブロックが正しくフォーマットされていること

### 機能7: GitHub Actionsワークフロー
- **概要**: npm公開を自動化するGitHub Actionsワークフローを作成する
- **優先度**: Medium
- **実装Phase**: Phase 7
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**:
    - npmアカウントとアクセストークン（NPM_TOKEN）が取得済み
    - NPM_TOKENがGitHub Secretsに登録済み
  - **基本フロー**:
    1. 開発者がGitHub Actionsの手動トリガー（workflow_dispatch）を実行
    2. バージョン番号を入力
    3. ワークフローがビルドを実行
    4. ワークフローがnpm publishを実行
    5. パッケージがnpmレジストリに公開される
  - **代替フロー**:
    - ビルド失敗時はワークフローを中断
    - npm公開失敗時はエラーログを出力
  - **事後条件**: npmレジストリにパッケージが公開される
- **入力**:
  - バージョン番号（手動トリガー時に指定）
  - NPM_TOKEN（GitHub Secretsから取得）
- **出力**:
  - `.github/workflows/publish.yml` ワークフローファイル
  - npm公開成功ログ
- **ビジネスルール**:
  - 手動トリガー（workflow_dispatch）でのみ実行
  - 自動pushによる発火は実装しない
  - バージョン番号はセマンティックバージョニングに従う（MAJOR.MINOR.PATCH）
  - 2FAは無効（シンプルな認証フローを優先）
  - NPM_TOKENはGitHub Secretsで安全に管理
- **バリデーション**:
  - ワークフローYAML構文が正しいこと
  - NPM_TOKENがGitHub Secretsに設定されていること
  - ビルド成果物（dist/）が生成されること
  - npm公開が成功すること

### 機能8: npm公開実行
- **概要**: npmレジストリへの実際の公開を行い、パッケージがnpmページで利用可能になることを確認する
- **優先度**: High
- **実装Phase**: Phase 8
- **ユースケース**:
  - **アクター**: 開発者
  - **前提条件**: Phase 7完了（GitHub Actionsワークフロー作成済み）
  - **基本フロー**:
    1. NPM_TOKENを取得してGitHub Secretsに登録
    2. 最終ビルドとテストを実行
    3. GitHub Actionsワークフローを手動実行
    4. npm公開が成功したことを確認
    5. npmページで正しく表示されることを確認
    6. npxコマンドで最終動作確認
  - **代替フロー**:
    - 公開失敗時はエラーログを確認して修正
  - **事後条件**: パッケージがnpmレジストリに公開され、エンドユーザーがnpxで実行可能
- **入力**:
  - NPM_TOKEN
  - バージョン番号
- **出力**:
  - npm公開完了
  - npmページURL
- **ビジネスルール**:
  - 初回公開はバージョン1.0.0
  - セマンティックバージョニングに従う
  - 公開前に必ず最終テストを実施
- **バリデーション**:
  - npm公開が成功すること
  - npmページが正しく表示されること
  - npxコマンドが正常に動作すること

## 非機能要件

### セキュリティ
- npm公開時にAPIキーなどの機密情報が含まれないこと
- .npmignoreまたはfilesフィールドで.envファイルを除外すること
- 2FAは無効（シンプルな認証フローを優先）
- GitHub ActionsでのNPM_TOKENはシークレットとして管理

### パフォーマンス要件
このプロジェクトではnpm公開設定のみを扱うため、パフォーマンス要件は該当しません。

### 可用性要件
このプロジェクトではnpm公開設定のみを扱うため、可用性要件は該当しません。

### 保守性要件
- package.jsonの設定は標準的なnpm仕様に準拠すること
- 将来のバージョンアップ時にも再利用可能な設定であること

### ユーザビリティ要件
- npxコマンドでの実行が直感的であること
- README.mdのインストール手順が明確であること
- エラーメッセージが理解しやすいこと（既存実装を継承）

### 制約条件

#### 技術的制約
- Node.js 22.10.0以上が必要
- pnpmパッケージマネージャーの使用
- TypeScriptからJavaScriptへのトランスパイルが必須
- npmアカウントとアクセストークン（NPM_TOKEN）の事前取得が必要
- GitHub Actionsでの手動トリガー実行

#### ビジネス的制約
- パッケージ名は`@masseater/n8n-mcp-server`（スコープ付き）
- 公開npmレジストリ（registry.npmjs.org）で公開
- MITライセンスで公開
- バージョン更新はGitHub Actionsの手動トリガーで実行

#### 法的・規制上の制約
- オープンソースライセンス（MIT）の遵守
- 依存パッケージのライセンス確認
- スコープ（@masseater）の所有権・使用許可の事前確認が必要

## データ要件
- npm公開に必要なメタデータ（name, version, description, keywords等）
- ビルド成果物（dist/）のバージョン管理
- npm公開履歴は今回のスコープ外（将来的にCHANGELOG.mdを作成する可能性あり）

## インターフェース要件
- **npmレジストリとの連携**:
  - npm publish APIの使用
  - 認証方式: npmトークン（NPM_TOKEN）、2FAは無効
  - GitHub ActionsからのNPM_TOKENはシークレットとして安全に管理
- **npxコマンドとの連携**:
  - package.jsonの`bin`フィールドによる実行可能ファイル指定
  - shebangは不要（npmが自動処理）
