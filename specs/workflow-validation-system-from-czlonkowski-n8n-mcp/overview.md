# workflow-validation-system-from-czlonkowski-n8n-mcp

## 目的
czlonkowski/n8n-mcpで実装されている包括的なワークフロー検証システムを本プロジェクトに移植し、AI最適化されたレスポンス設計を維持しながら、ワークフロー作成時のエラー検出精度を向上させる。

## スコープ
### 含まれるもの
- **ワークフロー構造検証**: ノードID重複、接続の妥当性、循環参照検出
- **ノード設定検証**: 必須フィールドチェック、enum値検証、型検証
- **接続検証**: ノード間の接続構文とエラーハンドラ設定の検証
- **n8n式検証**: Expression構文の検証（`{{ }}`内の式）
- **AI固有ノード検証**: AI Agentノードの言語モデル接続チェック
- **検証プロファイル**: minimal/runtime/ai-friendly/strictの4段階の検証レベル
- **詳細エラーメッセージ**: フィールド名、期待値、実際の値を含む構造化エラー

### 含まれないもの
- n8n本体の機能拡張（n8nプロジェクトの管轄）
- 独自の認証システム（n8n API認証に依存）
- ワークフロー実行エンジン（n8nに委譲）
- テンプレートシステム（czlonkowskiプロジェクト固有機能）
- テレメトリ・分析機能（czlonkowskiプロジェクト固有機能）

## 想定される成果物
- 既存MCPツールの拡張: `create_workflow`, `update_workflow` の検証機能強化
- 新規MCPツール: `validate_workflow` - ワークフロー作成前の事前検証

## 実装概要
### 実装する機能
1. ワークフロー構造検証
   - 概要: ノードID重複、接続の妥当性、循環参照を検出
   - 入力: ワークフローオブジェクト（nodes, connections）
   - 出力: 構造化された検証結果（success, errors[]）
   - 優先度: High

2. ノード設定検証
   - 概要: 必須フィールドチェック、enum値検証、型検証
   - 入力: ノードタイプ、ノード設定オブジェクト
   - 出力: 各フィールドごとの検証結果
   - 優先度: High

3. 接続検証
   - 概要: ノード間の接続構文とエラーハンドラ設定の検証
   - 入力: connections オブジェクト、nodes 配列
   - 出力: 接続の妥当性（未接続ノード、無効な接続）
   - 優先度: High

4. n8n式検証
   - 概要: Expression構文（`{{ }}`内の式）の検証
   - 入力: ノード設定内の文字列フィールド
   - 出力: 式の構文エラー、未定義変数
   - 優先度: High

5. AI固有ノード検証
   - 概要: AI Agentノードの言語モデル接続チェック
   - 入力: AI Agentノード、ワークフロー全体
   - 出力: 必須接続の有無
   - 優先度: High

6. 検証プロファイル
   - 概要: minimal/runtime/ai-friendly/strictの4段階の検証レベル
   - 入力: プロファイル名、ワークフロー
   - 出力: プロファイルに応じた検証結果
   - 優先度: High

7. 詳細エラーメッセージ
   - 概要: フィールド名、期待値、実際の値を含む構造化エラー
   - 入力: 検証エラー情報
   - 出力: MCPToolResponse形式の構造化エラー
   - 優先度: High

### 技術スタック（確定）
- バリデーションライブラリ: Zod（既存）
- 検証ロジック: czlonkowski/n8n-mcpから移植
- レスポンス形式: 既存のMCPToolResponse + RawToolパターン
- アーキテクチャ: 既存の4層構造に統合

## 調査項目
| 状態 | 調査項目名 | 理由 | 概要 |
|------|-----------|------|------|
| 完了 | czlonkowski検証システムの全体仕様 | 各検証機能（ワークフロー構造、ノード設定、接続、式、AIノード）の詳細な実装方法とロジックが不明 | **完全移植**を選択。541ノードDBを含む全検証システムを移植。実際のソースコード（5ファイル、4,834行）を読み、全検証ロジックを詳細に文書化。[詳細](research/czlonkowski検証システムの全体仕様.md) |
| 完了 | RawToolパターン適合化 | czlonkowskiの検証コードを本プロジェクトのRawTool/executeCore/formatResponseパターンに適合させる方法が不明 | WorkflowValidatorをRawToolでラップ。AI最適化レスポンス（60-80%削減）を実装。[詳細](research/RawToolパターン適合化.md) |
| 完了 | 検証プロファイル仕様 | minimal/runtime/ai-friendly/strictの各プロファイルの詳細な動作、使い分け、デフォルト設定が不明 | EnhancedConfigValidator.applyProfileFilters()の実装を確認。各プロファイルの警告フィルタリングロジック、使用場面を文書化。[詳細](research/czlonkowski検証システムの全体仕様.md#2-2-ノード設定検証enhancedconfigvalidator) |
| 完了 | エラーメッセージ形式統合 | czlonkowskiのエラーフォーマットと本プロジェクトのMCPToolResponse形式をどう統合するかが不明 | ValidationIssue型とMCPToolResponse形式の対応関係を確認。RawToolパターンでformatResponse()によりWorkflowValidationResult→MCPToolResponse変換を実装。[詳細](research/RawToolパターン適合化.md#7-詳細エラーメッセージ) |

---

**次のステップ**:
- ✅ 全調査完了（4項目）
- 次のコマンド: `/sdd:define-requirements workflow-validation-system-from-czlonkowski-n8n-mcp`

**調査完了サマリー**:
- 5つの主要Validatorファイル（4,834行）を完全に読み、実装詳細を文書化
- 検証プロファイル（minimal/runtime/ai-friendly/strict）の動作を確認
- エラーメッセージ形式統合の方針を確定
- RawToolパターンへの適合方法を確立
