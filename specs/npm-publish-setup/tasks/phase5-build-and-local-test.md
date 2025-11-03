# Phase 5: ビルドとローカルテスト 計画書

## タスク目次

- 1. ビルドの実行と確認 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 2. npm packによるtarball生成 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 3. tarball内容の検証 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. npm publish --dry-run実行 - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 5. ローカルインストールテスト - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 6. npxコマンドでの実行テスト - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor

**番号付けルール:**
- 全て単一番号で直列実行（1 → 2 → 3 → 4 → 5 → 6）

## Phase概要
- **Phase名**: ビルドとローカルテスト
- **状態**: 完了
- **目標**: npm公開前にビルド確認とローカルテストを実施し、パッケージが正しく動作することを検証する

## TDD & 設計原則の適用

### TDDアプローチ
1. **Red（テスト作成）**: 各検証項目のテストスクリプトを作成
2. **Green（実装）**: ビルド、パッケージング、テストを実行
3. **Refactor（最適化）**: 問題があれば修正し、再度テスト

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: 各タスクは単一の検証項目に焦点を当てる

## 依存関係
- **前提条件**: Phase 4完了（publishConfig設定済み）
- **ブロッカー**: なし
- **後続Phaseへの影響**: このPhaseでのテスト成功がPhase 6以降の実行条件

## 実装する機能
- 機能3: パッケージ内容の最適化 - npm packによる検証
- 機能2: CLI実行可能ファイルの設定 - npxコマンドでの実行テスト

## タスク詳細

### タスク1: ビルドの実行と確認
- **説明**:
  - `pnpm run build` を実行してTypeScriptをコンパイル
  - dist/ディレクトリが生成されることを確認
  - dist/index.jsが存在することを確認
  - ビルドエラーがないことを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: ビルドが成功し、dist/index.jsが生成されることを検証
  - [ ] Green: `pnpm run build` を実行
  - [ ] Refactor: ビルド設定を確認し、最適化
- **依存関係**: Phase 4完了後
- **状態**: 未着手

### タスク2: npm packによるtarball生成
- **説明**:
  - `npm pack` を実行してtarballを生成
  - 生成されたtarballファイル名を確認（例: masseater-n8n-mcp-server-1.0.0.tgz）
  - tarballが正常に生成されることを確認
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npm packが成功し、tarballが生成されることを検証
  - [ ] Green: `npm pack` を実行
  - [ ] Refactor: 不要
- **依存関係**: タスク1完了後
- **状態**: 未着手

### タスク3: tarball内容の検証
- **説明**:
  - `tar -tzf [tarballファイル名]` でtarball内容を確認
  - 必須ファイルが含まれていることを確認: package/, package/dist/, package/README.md, package/LICENSE, package/package.json
  - 不要なファイルが含まれていないことを確認: src/, tests/, specs/, .github/, node_modules/, .env等
  - tarballサイズが妥当であることを確認（目安: < 1MB）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: tarball内に必須ファイルが含まれ、不要なファイルが含まれていないことを検証
  - [ ] Green: tarball内容を確認
  - [ ] Refactor: 不要なファイルが含まれていた場合、filesフィールドを修正
- **依存関係**: タスク2完了後
- **状態**: 未着手

### タスク4: npm publish --dry-run実行
- **説明**:
  - `npm publish --dry-run` を実行して公開のドライランを実施
  - エラーがないことを確認
  - 公開されるファイルリストを確認
  - 警告メッセージを確認（repository fieldなど）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npm publish --dry-runが成功することを検証
  - [ ] Green: `npm publish --dry-run` を実行
  - [ ] Refactor: 警告があれば対処を検討（必須でない警告は無視可）
- **依存関係**: タスク3完了後
- **状態**: 未着手

### タスク5: ローカルインストールテスト
- **説明**:
  - 生成されたtarballをローカルにインストール: `npm install -g ./[tarballファイル名]`
  - インストールが成功することを確認
  - グローバルにインストールされたコマンドを確認: `which n8n-mcp-server`
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: tarballからのインストールが成功することを検証
  - [ ] Green: `npm install -g ./[tarballファイル名]` を実行
  - [ ] Refactor: インストール後のクリーンアップ（npm uninstall -g @masseater/n8n-mcp-server）
- **依存関係**: タスク4完了後
- **状態**: 未着手

### タスク6: npxコマンドでの実行テスト
- **説明**:
  - ローカルインストールしたパッケージをnpxで実行: `npx n8n-mcp-server --help`
  - コマンドが正常に実行されることを確認
  - ヘルプメッセージが表示されることを確認
  - オプション引数が正しく解析されることを確認
  - 実際のn8n接続テストは不要（環境変数が設定されていないため）
- **開始日時**:
- **TDDステップ**:
  - [ ] Red: npxコマンドが成功し、期待される出力が得られることを検証
  - [ ] Green: `npx n8n-mcp-server --help` を実行
  - [ ] Refactor: 不要
- **依存関係**: タスク5完了後
- **状態**: 未着手

## テスト戦略

- **ビルドテスト**: `pnpm run build` が成功し、dist/が生成されること
- **パッケージングテスト**: `npm pack` が成功し、tarballが正しい内容であること
- **ドライランテスト**: `npm publish --dry-run` が成功すること
- **インストールテスト**: tarballからのローカルインストールが成功すること
- **実行テスト**: npxコマンドが正常に動作すること

## Phase完了条件
- [x] 全タスク完了
- [x] ビルドが成功している
- [x] tarballが生成され、内容が正しい
- [x] npm publish --dry-runが成功している
- [x] ローカルインストールが成功している
- [x] npxコマンドが正常に動作している
- [x] コードレビュー承認

## 技術的課題と解決方針
- **課題**: ローカルテスト環境の準備
  - **解決方針**: テスト用のディレクトリを作成し、そこでインストールテストを実施
- **課題**: グローバルインストールの影響
  - **解決方針**: テスト後に必ずアンインストール（npm uninstall -g @masseater/n8n-mcp-server）

## リスク管理
- **リスク**: ビルドが失敗する
  - **対策**: ビルドエラーを修正してから次のタスクに進む
- **リスク**: tarballに不要なファイルが含まれる
  - **対策**: filesフィールドを修正し、再度npm packを実行
- **リスク**: npxコマンドが動作しない
  - **対策**: binフィールドとdist/index.jsのパスを確認

## 次Phaseへの引き継ぎ事項
- Phase 6でREADME更新時、npxコマンドの実行例を記載
- パッケージが正常に動作することが確認され、npm公開の準備が完了
