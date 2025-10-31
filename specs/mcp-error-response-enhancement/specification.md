# 詳細仕様書

## 機能要件

### 機能1: BaseToolでのエラーハンドリング
- **概要**: BaseToolのhandler()にtry-catchを追加し、エラーをキャッチして error.message をAIクライアントに返す
- **優先度**: High
- **実装Phase**: Phase 1
- **ユースケース**:
  - アクター: BaseToolのhandler()
  - 前提条件: MCPツール実行時にエラーが発生
  - 基本フロー:
    1. ツール実行時にエラーが発生（NotFoundError、ValidationError、ApiError等）
    2. BaseToolのhandler()がエラーをキャッチ
    3. error.message をToolResponseに含めて返却
    4. AIクライアントがエラーメッセージを受け取り、適切に対処
  - 代替フロー: なし
  - 事後条件: AIクライアントがエラーの原因を理解できる
- **入力**: Error オブジェクト（CustomError または汎用Error）
- **出力**: ToolResponse形式のエラーレスポンス
  ```typescript
  {
    content: [{
      type: "text",
      text: error.message  // CustomErrorが既に持っている適切なメッセージ
    }],
    isError: true
  }
  ```
- **ビジネスルール**:
  - CustomErrorのmessageプロパティは既に適切な英語メッセージを持っている
  - ZodバリデーションエラーはMCPフレームワークが処理（このフローには到達しない）
- **バリデーション**:
  - error.message が存在すること
  - isError: true が設定されていること

### 機能2: エラーログの標準化
- **概要**: 全ツールで一貫したフォーマットでエラーログを出力
- **優先度**: Medium
- **実装Phase**: Phase 1
- **ユースケース**:
  - アクター: Logger
  - 前提条件: エラーが発生
  - 基本フロー:
    1. BaseToolのhandler()がエラーをキャッチ
    2. logger.error()を呼び出し
    3. ログファイルにJSON形式で記録
  - 代替フロー: なし
  - 事後条件: エラー詳細がログファイルに記録される
- **入力**: Error オブジェクト、ツール名
- **出力**: ログファイルへの記録
- **ビジネスルール**:
  - ログレベル: error
  - シンプルなログフォーマット（既存のWinstonロガーを使用）
  - 機密情報（apiKey、パスワード等）はログに含めない
- **バリデーション**: なし

### 機能3: CustomErrorのcontext型厳密化
- **概要**: CustomErrorのcontext プロパティにエラー種別ごとの厳密な型定義を追加
- **優先度**: Medium
- **実装Phase**: Phase 1
- **ユースケース**:
  - アクター: CustomError
  - 前提条件: エラーが生成される
  - 基本フロー:
    1. CustomErrorインスタンス生成時に型安全なcontextを渡す
    2. TypeScriptコンパイラが型チェック
  - 代替フロー: なし
  - 事後条件: context の型が保証される
- **入力**: エラー種別ごとの型定義されたcontext
- **出力**: 型安全なCustomErrorインスタンス
- **ビジネスルール**:
  - ApiError context: `{ operation: string; resourceType?: string; resourceId?: string; statusCode?: number; errorDetails?: string }`
  - NotFoundError context: `{ operation: string; resourceType: string; resourceId: string }`
  - ValidationError context: `{ field: string; expectedType?: string; receivedType?: string; constraint?: string }`
- **バリデーション**: TypeScriptの型チェック

### 機能4: エラーケーステスト
- **概要**: 各エラー種別（NotFoundError、ValidationError、ApiError）の自動テスト
- **優先度**: High
- **実装Phase**: Phase 2
- **ユースケース**:
  - アクター: テストランナー（Vitest）
  - 前提条件: BaseToolのエラーハンドリング実装が完了
  - 基本フロー:
    1. モックされたn8nクライアントがエラーをthrow
    2. ツールのhandler()を呼び出し
    3. 返却されたToolResponseを検証
    4. エラーメッセージの内容を検証
  - 代替フロー: なし
  - 事後条件: 全エラーケースが正しく処理されることを確認
- **入力**: モックされたエラー
- **出力**: テスト結果（合格/不合格）
- **ビジネスルール**:
  - テストケース:
    - NotFoundError: 存在しないワークフローID
    - ValidationError: 必須パラメータ欠如、不正な型
    - ApiError: n8n API制約違反（read-only field更新など）
    - Unknown Error: 予期しない例外
- **バリデーション**: なし

## 非機能要件

### セキュリティ
- **機密情報の保護**:
  - エラーメッセージにAPIキー、パスワード、内部パスを含めない
  - ログファイルにも機密情報を記録しない
  - スタックトレースはログファイルのみに記録（AIクライアントには返さない）

- **エラー情報の制御**:
  - AI用MCPツールのため、本番環境の概念は存在しない
  - 常に詳細なエラー情報をAIクライアントに返す（AIが適切に対処できるようにするため）

### 保守性
- **エラーメッセージの一貫性**:
  - CustomErrorが適切な英語メッセージを持つことを保証

- **コード品質基準**:
  - エラーハンドリングロジックはBaseToolに集約
  - 各ツールは CustomError をthrowするのみ
  - try-catchの乱用を避ける

- **ドキュメント要件**:
  - CLAUDE.mdにエラーレスポンス仕様を追記
  - 各CustomErrorクラスにJSDocコメント追加

- **技術的負債の管理**:
  - context プロパティに厳密な型定義を追加

## データ要件
- **エラーレスポンスデータ構造**:
  ```typescript
  type ErrorResponse = {
    content: [{
      type: "text";
      text: string; // error.message
    }];
    isError: true;
  };
  ```

- **データ保持期間**: ログファイルはユーザー自身で管理（ローテーション設定なし）

- **データ移行要件**: なし（既存のエラーレスポンス形式から新形式への移行は後方互換）

## インターフェース要件
- **MCPフレームワークとのインターフェース**:
  - ToolResponse形式に準拠
  - isError: true を設定することでMCPフレームワークがエラーと認識

- **n8n APIクライアントとのインターフェース**:
  - CustomError（ApiError、NotFoundError、ValidationError）をthrow
  - エラーの context プロパティに詳細情報を含める

- **Logger とのインターフェース**:
  - logger.error(message, error) 形式（既存のWinstonロガーを使用）

## 制約条件
- **技術的制約**:
  - MCPフレームワークのToolResponse形式に準拠する必要がある
  - 既存のCustomErrorクラスの互換性を維持しつつ、context型を厳密化
  - Zodバリデーションエラーの処理はMCPフレームワークに委ねる

- **ビジネス的制約**:
  - 既存のツール動作を壊さないこと（後方互換性）
  - 全品質チェック（lint、type-check、test）を必ず通過すること
