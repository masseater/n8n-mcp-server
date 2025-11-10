# Phase 1: BaseToolエラーハンドリング実装 計画書

## タスク目次

- 1. [BaseToolエラーハンドリングテストの作成] - 状態: 完了 - TDD: ✅ Red / ⬜ Green / ⬜ Refactor
- 2. [handler()のtry-catch実装とCustomError型定義の厳密化] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ⬜ Refactor
- 3. [エラーレスポンス形式とログ出力の最適化] - 状態: 完了 - TDD: ✅ Red / ✅ Green / ✅ Refactor
- 4. [Phase完了確認と品質チェック] - 状態: 完了 - TDD: N/A

**番号付けルール:**
- 全タスクは直列実行（依存関係あり）

## Phase概要
- **Phase名**: BaseToolエラーハンドリング実装
- **状態**: 完了
- **開始日時**: 2025-11-03 11:55
- **完了日時**: 2025-11-03 12:00
- **目標**:
  - TDDサイクルでBaseToolのhandler()にエラーハンドリングを追加
  - CustomErrorのcontext型定義を実装と同時に厳密化
  - エラーログ出力の実装

## TDD & 設計原則の適用

### TDDアプローチ
このPhaseでは以下のTDDサイクルを適用します：

1. **Red（テスト作成）**: handler()のエラーケーステストを先に作成し、期待される振る舞いを定義
2. **Green（最小実装）**: try-catchとCustomError型定義を同時に実装してテストを通す
3. **Refactor（リファクタリング）**: エラーレスポンス形式とログ出力を最適化

### 設計原則の適用方針

- **単一責任の原則 (SRP)**: BaseToolのhandler()はエラーハンドリングの責任のみを持つ
- **開放/閉鎖の原則 (OCP)**: CustomErrorの型定義を拡張可能にする
- **リスコフの置換原則 (LSP)**: 全てのCustomErrorサブクラスがError型として扱える
- **最小限の公開**: handler()はToolResponseのみを返す（内部実装の詳細は隠蔽）
- **依存性逆転の原則 (DIP)**: logger依存は注入可能にする（テスト容易性）

⚠️ **型定義と実装は同時に進める**: CustomError型定義だけを先に作らず、handler()実装と同じタスクで行う

## 依存関係
- **前提条件**: なし
- **ブロッカー**: なし
- **後続Phaseへの影響**: Phase 2が依存（BaseToolのエラーハンドリング実装が完了していること）

## 実装する機能
- BaseToolのhandler()にtry-catchブロック追加
- CustomErrorの型定義厳密化（ApiErrorContext、NotFoundErrorContext、ValidationErrorContext）
- エラーログ出力の実装（logger.error）
- エラーレスポンスの返却（isError: true、content: [{ type: "text", text: error.message }]）

## タスク詳細

### タスク1: BaseToolエラーハンドリングテストの作成
- **説明**:
  - `tests/tools/base/base-tool.test.ts` にエラーケーステストを作成
  - テスト対象: handler()がエラーをキャッチして適切なToolResponseを返すこと
  - テストケース:
    - NotFoundError: 存在しないリソースへのアクセス
    - ApiError: n8n API制約違反（400エラーなど）
    - ValidationError: バリデーションエラー（既存のCustomErrorを使用）
    - Unknown Error: 予期しない例外（汎用Error）
  - 各テストケースで検証する項目:
    - response.isError === true
    - response.content[0].type === "text"
    - response.content[0].text === error.message
    - logger.errorが呼ばれること
- **開始日時**: 2025-11-03 11:55
- **完了日時**: 2025-11-03 11:56
- **TDDステップ**:
  - [x] Red: テストケース作成（このタスクで実施）
  - [ ] Green: 最小実装
  - [ ] Refactor: リファクタリング
- **依存関係**: なし
- **状態**: 完了

### タスク2: handler()のtry-catch実装とCustomError型定義の厳密化
- **説明**:
  - `src/tools/base/base-tool.ts` のhandler()メソッドにtry-catchを追加
  - try-catchの実装内容:
    ```typescript
    async handler(args: TArgs): Promise<ToolResponse> {
      try {
        const result = await this.execute(args);
        return createToolResponse(result);
      } catch (error) {
        logger.error(`[${this.name}] Error`, { error });
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : String(error),
          }],
          isError: true,
        };
      }
    }
    ```
  - `src/errors/custom-errors.ts` に厳密な型定義を追加（実装と同時）:
    - ApiErrorContext型の定義
    - NotFoundErrorContext型の定義
    - ValidationErrorContext型の定義
    - 各CustomErrorクラスのconstructorでcontext型を適用
  - 既存のCustomError使用箇所（n8n-api-client.ts）を新しい型定義に移行
- **開始日時**: 2025-11-03 11:56
- **完了日時**: 2025-11-03 11:58
- **TDDステップ**:
  - [x] Red: テストケース作成（タスク1で完了）
  - [x] Green: 最小実装（このタスクで実施）
  - [ ] Refactor: リファクタリング
- **依存関係**: タスク1完了後（テストが作成されていること）
- **状態**: 完了

### タスク3: エラーレスポンス形式とログ出力の最適化
- **説明**:
  - エラーレスポンス形式の確認と調整
  - ログ出力のフォーマット確認（機密情報の除外）
  - 不要なコードの削除とコメント追加
  - テストが全て通ることを確認
- **開始日時**: 2025-11-03 11:58
- **完了日時**: 2025-11-03 11:59
- **TDDステップ**:
  - [x] Red: テストケース作成（タスク1で完了）
  - [x] Green: 最小実装（タスク2で完了）
  - [x] Refactor: リファクタリング（このタスクで実施）
- **依存関係**: タスク2完了後（実装が完了していること）
- **状態**: 完了

### タスク4: Phase完了確認と品質チェック
- **説明**:
  - 全テストの実行と確認（`pnpm run test`）
  - 型チェックの実行（`pnpm run type-check`）
  - Lintの実行（`pnpm run lint`）
  - Buildの実行（`pnpm run build`）
  - 全てのチェックに合格することを確認
- **開始日時**: 2025-11-03 11:59
- **完了日時**: 2025-11-03 12:00
- **TDDステップ**: なし（品質チェックのため）
- **依存関係**: タスク3完了後（リファクタリングが完了していること）
- **状態**: 完了

## テスト戦略

- **単体テスト**: BaseToolのhandler()メソッドの振る舞いを検証
  - 各エラー種別（NotFoundError、ApiError、ValidationError、Unknown Error）でテスト
  - モックされたexecute()メソッドがエラーをthrowする状況を作る
  - 返却されたToolResponseの形式を検証
- **型チェック**: CustomError型定義の厳密性を検証
  - TypeScriptコンパイラが型エラーを検出すること
  - context プロパティの型が正しいこと

## Phase完了条件
- [x] 全タスク完了
- [x] 全テスト通過（`pnpm run test`）
- [x] 型チェック成功（`pnpm run type-check`）
- [x] Lint成功（`pnpm run lint`）
- [x] Build成功（`pnpm run build`）

## 技術的課題と解決方針

### 課題1: CustomError型定義の既存コードへの影響
- **課題**: context型を厳密化すると、既存のエラー生成箇所で型エラーが発生する可能性
- **解決方針**: タスク2で既存のエラー生成箇所（n8n-api-client.ts）を同時に修正する

### 課題2: logger依存の注入方法
- **課題**: BaseToolでloggerに依存すると、テストが難しくなる可能性
- **解決方針**: logger はグローバルインスタンスを使用する（既存パターンに従う）

## リスク管理

### リスク1: エラーレスポンス形式変更による既存テストへの影響
- **発生確率**: 低
- **影響度**: 低
- **対策**: 既存テストは成功ケースのみをテストしているため、影響は軽微
- **回避策**: Phase 2で既存テストを確認・修正

### リスク2: CustomError型定義変更による互換性の問題
- **発生確率**: 中
- **影響度**: 中
- **対策**: 既存のエラー生成箇所を同時に修正（タスク2）
- **回避策**: context プロパティをoptionalにして後方互換性を維持

## 次Phaseへの引き継ぎ事項

### Phase 2で利用可能になる機能
- BaseToolのhandler()でエラーが適切にキャッチされる
- CustomErrorの型定義が厳密化され、型安全性が向上
- エラーログが標準化されたフォーマットで出力される

### 未解決の課題
- なし（Phase 1で全て解決予定）

### 技術的負債
- なし
