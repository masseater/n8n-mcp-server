# 詳細仕様書

## TDD開発アプローチ

### テスト駆動開発の原則
1. **テストファースト**: 実装前にテストを書く
2. **最小限の実装**: テストを通すための最小限のコードのみ作成
3. **継続的リファクタリング**: テストが通った後でコードを改善
4. **高テストカバレッジ**: 最初からテストを書くことで自然に高カバレッジを達成

### Red-Green-Refactorサイクル
- **Red**: 失敗するテストを書く（要求仕様の明確化）
- **Green**: テストを通す最小限の実装
- **Refactor**: テストを保持したままコードを改善

## 機能要件

### 機能1: list_executions - 実行履歴一覧取得
- **概要**: ワークフローの実行履歴を一覧形式で取得する機能
- **優先度**: High
- **実装Phase**: Phase 2
- **ユースケース**:
  - アクター: AIエージェント
  - 前提条件: n8nサーバーへの認証が完了している
  - 基本フロー:
    1. AIが特定のワークフローIDまたはステータスで実行履歴を要求
    2. システムがn8n APIを呼び出し
    3. 実行履歴の一覧を返却
  - 代替フロー:
    - ワークフローIDが無効な場合、エラーメッセージを返却
    - 実行履歴が存在しない場合、空の配列を返却
  - 事後条件: 実行履歴の一覧がAIに提供される

- **入力**:
  - `workflowId` (string, optional): 特定ワークフローの実行のみ取得
  - `status` (enum, optional): "success" | "error" | "waiting" | "running" | "canceled"
  - `startDate` (ISO 8601 string, optional): 開始日時（この日時以降の実行）
  - `endDate` (ISO 8601 string, optional): 終了日時（この日時以前の実行）
  - `limit` (number, optional): 取得件数（デフォルト: 20, 最大: 100）
  - `offset` (number, optional): オフセット（ページネーション用）
  - `raw` (boolean, optional): 完全な実行情報を返却するか

- **出力**:
  - デフォルト（raw=false）:
    ```json
    {
      "success": true,
      "message": "実行履歴を取得しました",
      "data": {
        "count": 42,
        "executions": [
          {
            "id": "12345",
            "workflowId": "workflow-123",
            "workflowName": "My Workflow",
            "status": "success",
            "startedAt": "2024-10-29T10:00:00Z",
            "stoppedAt": "2024-10-29T10:00:05Z",
            "executionTime": 5000
          }
        ]
      }
    }
    ```
  - raw=true: 完全な実行データ（ノードの実行結果を含む）

- **ビジネスルール**:
  - 実行履歴は新しい順（降順）でソート
  - デフォルトで過去24時間の実行のみ取得（startDate未指定時）
  - 削除されたワークフローの実行も表示（workflowNameは"Deleted Workflow"）

- **バリデーション**:
  - limitは1-100の範囲内
  - startDateはendDateより前
  - statusは定義された列挙値のいずれか

### 機能2: get_execution - 実行詳細取得
- **概要**: 特定の実行の詳細情報を取得する機能
- **優先度**: High
- **実装Phase**: Phase 2
- **ユースケース**:
  - アクター: AIエージェント
  - 前提条件:
    - n8nサーバーへの認証が完了している
    - 対象の実行IDが存在する
  - 基本フロー:
    1. AIが実行IDを指定して詳細を要求
    2. システムがn8n APIから実行データを取得
    3. 各ノードの実行結果を含む詳細を返却
  - 代替フロー:
    - 実行IDが存在しない場合、404エラーを返却
    - 権限がない場合、403エラーを返却
  - 事後条件: 実行の詳細情報がAIに提供される

- **入力**:
  - `id` (string, required): 実行ID
  - `includeData` (boolean, optional): ノードの入出力データを含めるか（デフォルト: false）
  - `raw` (boolean, optional): 完全な実行情報を返却するか

- **出力**:
  - デフォルト（raw=false）:
    ```json
    {
      "success": true,
      "message": "実行詳細を取得しました",
      "data": {
        "id": "12345",
        "workflowId": "workflow-123",
        "workflowName": "My Workflow",
        "status": "error",
        "startedAt": "2024-10-29T10:00:00Z",
        "stoppedAt": "2024-10-29T10:00:05Z",
        "executionTime": 5000,
        "error": {
          "node": "HTTP Request",
          "message": "Connection timeout",
          "timestamp": "2024-10-29T10:00:05Z"
        },
        "nodeExecutions": [
          {
            "nodeName": "Start",
            "status": "success",
            "executionTime": 10
          },
          {
            "nodeName": "HTTP Request",
            "status": "error",
            "executionTime": 4990,
            "error": "Connection timeout"
          }
        ]
      }
    }
    ```
  - raw=true: 完全な実行データ（各ノードの入出力データを含む）

- **ビジネスルール**:
  - エラーが発生したノードの情報を優先的に表示
  - 実行時間はミリ秒単位で記録
  - ノードの実行順序を保持

- **バリデーション**:
  - idは必須かつ有効な実行ID形式

## 非機能要件

### パフォーマンス
- **レスポンスタイム要件**:
  - list_executions: 2秒以内（100件取得時）
  - get_execution: 1秒以内（includeData=false時）
  - get_execution: 5秒以内（includeData=true時）

- **同時接続数**:
  - MCPサーバーレベルで10同時接続まで対応
  - n8n APIレート制限に準拠

- **データ処理量**:
  - 単一実行の最大サイズ: 10MB
  - 一覧取得の最大件数: 100件/リクエスト

### 可用性
- **稼働率目標**: 99.5%（n8nサーバーの可用性に依存）
- **ダウンタイム許容範囲**: 月間3.6時間
- **障害復旧時間**: 30分以内（サービス再起動で復旧）

### セキュリティ
- **認証・認可要件**:
  - n8n API キーによる認証必須
  - 実行データへのアクセスは認証済みユーザーのみ
  - API キーの安全な保管（環境変数）

- **データ暗号化**:
  - HTTPS通信必須
  - ローカルキャッシュなし（セキュリティ優先）

- **監査ログ**:
  - すべてのAPI呼び出しをログ記録
  - エラー発生時の詳細ログ

### スケーラビリティ
- **将来的な成長予測**:
  - 月間10万実行まで対応
  - ユーザー数100まで対応

- **スケールアウト方針**:
  - MCPサーバーの水平スケーリング対応
  - n8n APIのページネーション活用

### 保守性
- **コード品質基準**:
  - TypeScript strictモード
  - ESLint準拠
  - テストカバレッジ80%以上

- **ドキュメント要件**:
  - JSDocコメント必須
  - CLAUDE.md更新
  - 型定義の完備

- **技術的負債の管理**:
  - 定期的なリファクタリング
  - 依存関係の最新化

### ユーザビリティ
- **UI/UX要件**:
  - 直感的なエラーメッセージ
  - 進捗状況の表示（大量データ取得時）
  - コンテキスト最適化によるAI応答速度向上

- **アクセシビリティ**:
  - MCPプロトコル準拠
  - 標準的なJSON形式

- **多言語対応**:
  - メッセージの日本語対応
  - エラーメッセージの国際化準備

## データ要件
- **データモデル概要**:
  - ExecutionSummary: 実行の概要情報
  - ExecutionDetail: 実行の詳細情報
  - NodeExecution: ノードごとの実行情報
  - ExecutionError: エラー情報

- **データ保持期間**:
  - キャッシュなし（常に最新データを取得）
  - n8n側の保持期間に準拠

- **データ移行要件**:
  - なし（新規機能のため）

## インターフェース要件
- **外部システム連携**:
  - n8n REST API v1
  - MCP Protocol v1.0

- **API仕様概要**:
  - GET /api/v1/executions
  - GET /api/v1/executions/:id
  - 認証: X-N8N-API-KEY ヘッダー

- **データフォーマット**:
  - リクエスト: Query parameters / Path parameters
  - レスポンス: JSON (MCPToolResponse形式)

## 制約条件
- **技術的制約**:
  - n8n API v1の制限（実行のキャンセル・再実行不可）
  - Node.js 18以上必須
  - TypeScript 5.0以上必須

- **ビジネス的制約**:
  - 実行履歴は読み取り専用
  - 実行データの編集不可

- **法的・規制上の制約**:
  - GDPR準拠（個人情報を含む場合）
  - ログデータの適切な管理
