# SDD Spec Status

最終更新: 2025-11-10 19:26:56

## 次に実施すべきこと

`/sdd:implement-phase npm-publish-setup 1.1`

## タスク一覧

### ⬜ 未着手

| タスク名 | Phase進捗 | 最終更新 | 次のコマンド |
|---------|----------|---------|-------------|
| npm-publish-setup | Phase 1 (0/3) | 2025-11-10 | `/sdd:implement-phase npm-publish-setup 1.1` |
| workflow-syntax-validator | Phase - (0/0) | 2025-11-10 | `/sdd:plan-phases workflow-syntax-validator` |
| http-authentication | Phase - (0/0) | 2025-11-10 | `/sdd:plan-phases http-authentication` |
| search-official-sample-tool | Phase - (0/0) | 2025-11-03 | `/sdd:plan-phases search-official-sample-tool` |

## タスク詳細

### npm-publish-setup
- **概要**: n8n-mcp-serverをnpmレジストリに公開し、`npx`コマンドで簡単にインストール・実行できるようにする
- **Phase数**: 3
- **Phase詳細**:
  - Phase 1: npm公開設定の準備（未着手、タスク: 0/3完了）
  - Phase 2: ビルドとテスト（未着手、計画書なし）
  - Phase 3: npm公開とドキュメント更新（未着手、計画書なし）

### workflow-syntax-validator
- **概要**: n8nワークフローの構文を事前にチェックし、エラーを早期発見する
- **Phase数**: 4
- **Phase詳細**:
  - Phase 1: 基盤設計とコア機能実装（未着手、計画書なし）
  - Phase 2: 高度なバリデーション機能（未着手、計画書なし）
  - Phase 3: ユーザビリティとエラー報告強化（未着手、計画書なし）
  - Phase 4: 統合とドキュメント化（未着手、計画書なし）

### http-authentication
- **概要**: HTTPモードでMCPサーバーをホスティングする際に、クライアント（AIツール）からn8n API認証情報（API Key）をリクエストヘッダーで受け取り、動的にn8nへの認証を行えるようにする
- **Phase数**: 0
- **Phase詳細**: Phase情報が未定義（overview.mdに「## Phase概要と依存関係」セクションがありません）

### search-official-sample-tool
- **概要**: n8n公式ドキュメントや公式リポジトリから、実際のワークフローサンプルを検索・取得できるツールを提供する
- **Phase数**: 3
- **Phase詳細**:
  - Phase 1: 調査・設計フェーズ（未着手、計画書なし）
  - Phase 2: コア検索機能実装（未着手、計画書なし）
  - Phase 3: インポート機能実装（未着手、計画書なし）
