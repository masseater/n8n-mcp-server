# czlonkowski検証システムの全体仕様

## 結論

- **選択**: czlonkowski/n8n-mcpの検証システムを**完全移植する**（czlonkowskiの実装をそのまま移植）
- **理由**: 全ノード情報を管理しないと詳細な検証ができないため、541ノードのデータベースを含む検証システム全体を移植する。これにより、ノード設定の詳細検証、enum値検証、型検証、AI固有ノード検証などの高度な機能を提供できる

## 詳細

### 1. czlonkowski検証システムの全体像

czlonkowski/n8n-mcpは、**包括的なノード情報データベース**を基盤とした検証システムです。

**主要コンポーネント**:
- **WorkflowValidator**: ワークフロー全体の統合検証エントリーポイント
- **EnhancedConfigValidator**: 操作認識機能を備えたノード設定検証
- **ExpressionValidator**: n8n式（`{{ }}`構文）の構文検証
- **AINodeValidator**: Langchain系AIノードの専用検証
- **NodeRepository**: SQLiteデータベース経由のノード定義管理（541ノード、プロパティ99%カバレッジ）

### 2. 各検証機能の詳細

#### 2-1. ワークフロー構造検証（WorkflowValidator）

**ファイル**: `src/services/workflow-validator.ts` (1871行)

**検証項目**:
- ノード配列・接続オブジェクトの基本構造確認
- ノードID・名前の重複検出
- 単一ノード/多ノードワークフローの妥当性評価
- 循環参照検出（loopNodeTypesを例外として扱う）
- 孤立ノード検出
- トリガーノードの存在確認
- エラーハンドリング設定検証
- AI固有ノード検証の統合

**主要メソッド**:
```typescript
// メインエントリーポイント
async validateWorkflow(
  workflow: WorkflowJson,
  options: {
    validateNodes?: boolean;
    validateConnections?: boolean;
    validateExpressions?: boolean;
    profile?: 'minimal' | 'runtime' | 'ai-friendly' | 'strict';
  } = {}
): Promise<WorkflowValidationResult>

// 構造検証
private validateWorkflowStructure(
  workflow: WorkflowJson,
  result: WorkflowValidationResult
): void

// ノード検証（各ノードごと）
private async validateAllNodes(
  workflow: WorkflowJson,
  result: WorkflowValidationResult,
  profile: string
): Promise<void>

// 接続検証
private validateConnections(
  workflow: WorkflowJson,
  result: WorkflowValidationResult,
  profile: string
): void

// 式検証
private validateExpressions(
  workflow: WorkflowJson,
  result: WorkflowValidationResult,
  profile: string
): void

// ワークフローパターン検証
private checkWorkflowPatterns(
  workflow: WorkflowJson,
  result: WorkflowValidationResult,
  profile: string
): void
```

**実装の特徴**:
1. **検証プロファイル対応**: minimal/runtime/ai-friendly/strictで検証範囲を調整
2. **循環検出**: DFSベースの`checkForCycles()`でループノードを例外扱い
3. **Sticky Note除外**: `isNonExecutableNode()`で非実行ノード（Sticky Note等）を統計から除外
4. **NodeSimilarityService統合**: 不明なノード型に対して類似ノード提案（最大3件、信頼度90%以上で自動修正可能）
5. **AI固有検証**: `validateAISpecificNodes()`でLangchainノードの専用検証
6. **typeVersion検証**: 全versionedノード（Langchain含む）でtypeVersionの妥当性確認
   - 欠落: エラー
   - 無効値（負数）: エラー
   - 古いバージョン: 警告
   - 最大バージョン超過: エラー

**エラー例**:
```typescript
// 重複ID検出（改善されたメッセージ）
{
  type: 'error',
  nodeId: 'node-123',
  message: 'Duplicate node ID: "node-123". Node at index 5 (name: "HTTP Request 1", type: "nodes-base.httpRequest") conflicts with node at index 2 (name: "HTTP Request", type: "nodes-base.httpRequest"). Each node must have a unique ID. Generate a new UUID using crypto.randomUUID() - Example: {id: "a1b2c3d4-...", name: "HTTP Request 1", type: "nodes-base.httpRequest", ...}'
}

// 不明なノード型（類似ノード提案付き）
{
  type: 'error',
  nodeId: 'node-456',
  nodeName: 'My Node',
  message: 'Unknown node type: "httpRequest".

Did you mean one of these?
• nodes-base.httpRequest (95% match) - Exact name match but missing package prefix
  → can be auto-fixed
• nodes-base.webhook (45% match) - Similar HTTP-related functionality
  → Alternative HTTP node',
  suggestions: [
    { nodeType: 'nodes-base.httpRequest', confidence: 0.95, reason: '...' },
    { nodeType: 'nodes-base.webhook', confidence: 0.45, reason: '...' }
  ]
}
```

**検証フロー**:
```
validateWorkflow()
  ├─ null/undefined チェック
  ├─ validateWorkflowStructure()
  │   ├─ 基本構造（nodes配列、connections オブジェクト）
  │   ├─ 空ワークフロー警告
  │   ├─ 単一ノードワークフロー検証
  │   ├─ 重複ID・名前検出
  │   └─ トリガーノード数カウント
  ├─ validateAllNodes() (validateNodes=true)
  │   ├─ ノード型正規化（NodeTypeNormalizer）
  │   ├─ NodeRepositoryからノード定義取得
  │   ├─ typeVersion検証（全versionedノード）
  │   ├─ Langchainノードはパラメータ検証スキップ（AI専用検証で処理）
  │   └─ EnhancedConfigValidator.validateWithMode()
  ├─ validateConnections() (validateConnections=true)
  │   ├─ 出力接続存在確認
  │   ├─ 接続先ノード存在確認
  │   ├─ 循環検出（loopNodeTypes例外）
  │   ├─ 孤立ノード検出
  │   └─ エラー出力設定の矛盾検出
  ├─ validateExpressions() (validateExpressions=true)
  │   └─ ExpressionValidator.validateNodeExpressions()
  ├─ checkWorkflowPatterns()
  │   ├─ エラーハンドリング設定確認
  │   ├─ 認証情報の検証
  │   └─ 線形チェーン長測定
  ├─ validateAISpecificNodes() (AIノード存在時)
  │   └─ AINodeValidator統合
  ├─ generateSuggestions()
  │   ├─ トリガー追加提案
  │   ├─ エラーハンドリング提案
  │   └─ 構造改善提案
  └─ addErrorRecoverySuggestions() (エラー存在時)
```

#### 2-2. ノード設定検証（EnhancedConfigValidator）

**ファイル**: `src/services/enhanced-config-validator.ts` (986行)

**検証項目**:
- 必須フィールドチェック
- enum値検証（許可されたオプションのみ）
- 型検証（string/number/boolean/object/array）
- リソース・操作の類似度マッチング（OperationSimilarityService/ResourceSimilarityService）
- fixedCollection構造の自動修正（FixedCollectionValidator）
- displayOptions.showによるプロパティ可視性評価
- ノード固有の検証ロジック（NodeSpecificValidators）

**主要メソッド**:
```typescript
// メインエントリーポイント
static validateWithMode(
  nodeType: string,
  config: Record<string, any>,
  properties: any[],
  mode: ValidationMode = 'operation',
  profile: ValidationProfile = 'ai-friendly'
): EnhancedValidationResult

// 操作コンテキスト抽出
private static extractOperationContext(
  config: Record<string, any>
): OperationContext

// プロパティフィルタリング
private static filterPropertiesByMode(
  properties: any[],
  config: Record<string, any>,
  mode: ValidationMode,
  operation: OperationContext
): { properties: any[], configWithDefaults: Record<string, any> }

// プロファイル別フィルタ適用
private static applyProfileFilters(
  result: EnhancedValidationResult,
  profile: ValidationProfile
): void

// リソース・操作検証（類似度マッチング付き）
private static validateResourceAndOperation(
  nodeType: string,
  config: Record<string, any>,
  result: EnhancedValidationResult
): void
```

**検証プロファイル**:

| プロファイル | 特徴 | 警告フィルタ | ユースケース |
|------------|------|-------------|-------------|
| **minimal** | 必須エラーと重大警告のみ | security, deprecated のみ | 最小限の検証（開発初期） |
| **runtime** | 実行時の致命的エラーを優先 | security, deprecated のみ<br/>プロパティ可視性警告除外 | 本番環境実行前チェック |
| **ai-friendly** | バランス型（デフォルト） | security, deprecated, missing_common, best_practice<br/>プロパティ可視性警告除外 | AIエージェント利用、誤検知削減 |
| **strict** | 全検証+推奨事項適用 | 全警告を保持<br/>エラーハンドリング強制 | セキュリティ重視、本番デプロイ |

**ValidationMode**:
- `full`: すべてのプロパティ検証
- `operation`: 現在の操作に関連するプロパティのみ（displayOptions.show使用）
- `minimal`: 必須かつ表示可能なプロパティ

**実装の特徴**:
1. **プロファイル別フィルタリング**: `applyProfileFilters()`で警告を段階的にフィルタ
   - `minimal`: `missing_required`エラーのみ
   - `runtime`: 実行時エラー + セキュリティ/非推奨警告
   - `ai-friendly`: バランス型（可視性警告除外）
   - `strict`: 全チェック + エラーハンドリング強制
2. **プロパティ絞り込み**: `filterPropertiesByMode()`でdisplayOptions.showを評価
3. **デフォルト値への誤警告排除**: `userProvidedKeys`追跡でユーザー未指定プロパティへの警告を抑制
4. **類似度マッチング統合**:
   - `OperationSimilarityService`: 操作名の類似度計算（信頼度80%以上で"Did you mean"提示）
   - `ResourceSimilarityService`: リソース名の類似度計算
5. **ノード固有検証**: `NodeSpecificValidators`で以下のノード専用ロジックを実装
   - Slack: チャンネル指定検証
   - Google Sheets: レンジ形式検証
   - HTTP Request: URL形式、認証、レスポンス形式検証
   - Code: 構文、n8n変数パターン検証
   - OpenAI: resourceLocator形式検証
   - MongoDB: クエリ検証
   - Webhook: responseMode検証
   - Postgres/MySQL: SQL安全性検証
   - AI Agent: プロンプト、接続検証
   - Set: values.values配列構造検証
6. **fixedCollection自動修正**: `FixedCollectionValidator`でSwitch/If/FilterノードのfixedCollection構造を自動修正
   - 誤った形式: `{conditions: {}}`
   - 正しい形式: `{conditions: {values: []}}`
   - 自動修正を`result.autofix`に格納

**エラー例**:
```typescript
// 無効なリソース（類似度マッチング付き）
{
  type: 'invalid_value',
  property: 'resource',
  message: 'Invalid resource "mesage" for node nodes-base.slack. Did you mean "message"?',
  fix: 'Change resource to "message". Exact name match with typo correction',
  suggestion: 'Did you mean "message"? Exact name match with typo correction'
}

// 無効な操作（類似度マッチング付き）
{
  type: 'invalid_value',
  property: 'operation',
  message: 'Invalid operation "sent" for node nodes-base.slack with resource "message". Did you mean "send"?',
  fix: 'Change operation to "send". Exact name match with typo correction'
}

// fixedCollection構造エラー（自動修正付き）
{
  type: 'invalid_value',
  property: 'conditions',
  message: 'Invalid fixedCollection structure for property "conditions". Expected: {conditions: {values: [...]}} but got: {conditions: {}}',
  fix: 'Change conditions to: {values: [{"leftValue": "", "rightValue": "", "operation": "equal"}]}'
}
```

**検証フロー**:
```
validateWithMode()
  ├─ 入力検証（nodeType, config, properties型チェック）
  ├─ extractOperationContext() - resource/operation/action抽出
  ├─ userProvidedKeys保存（デフォルト値追跡用）
  ├─ filterPropertiesByMode() - プロパティ絞り込み
  │   ├─ applyNodeDefaults() - デフォルト値適用
  │   ├─ mode='minimal': 必須かつ可視のみ
  │   ├─ mode='operation': 現在の操作に関連するもの
  │   └─ mode='full': 全プロパティ
  ├─ super.validate() - ConfigValidator基底クラス検証
  │   ├─ checkRequiredProperties()
  │   ├─ getPropertyVisibility()
  │   ├─ validatePropertyTypes()
  │   ├─ performNodeSpecificValidation()
  │   ├─ checkCommonIssues()
  │   └─ performSecurityChecks()
  ├─ applyProfileFilters() - プロファイル別警告フィルタ
  ├─ addOperationSpecificEnhancements()
  │   ├─ validateResourceAndOperation() - 類似度マッチング
  │   ├─ validateFixedCollectionStructures() - fixedCollection検証
  │   └─ NodeSpecificValidators - ノード固有ロジック
  ├─ deduplicateErrors() - エラー重複排除
  ├─ generateNextSteps() - 修正手順生成
  └─ 出力: EnhancedValidationResult
```

#### 2-3. 接続検証（WorkflowValidator.validateConnections）

**検証項目**:
- 出力接続（main/error/ai_tool）の存在確認
- 接続先ノードの存在確認
- エラー出力設定の矛盾検出
- 孤立ノード検出（トリガーノード除外）

**実装の特徴**:
- `buildReverseConnectionMap()`で逆引きマップ構築
- `checkForCycles()`で循環検出
- エラーハンドリング設定との整合性チェック

#### 2-4. n8n式検証（ExpressionValidator）

**ファイル**: `src/services/expression-validator.ts` (343行)

**検証項目**:
- 括弧の対応（`{{ }}`）
- ネスト式の禁止（`{{ {{ }} }}`は非対応）
- 空式の検出（`{{ }}`）
- テンプレートリテラル（`${}`）の禁止
- オプショナルチェイニング（`?.`）の非対応警告

**主要メソッド**:
```typescript
// 単一式の検証
static validateExpression(
  expression: string,
  context: ExpressionContext
): ExpressionValidationResult

// ノードパラメータ全体の式検証（再帰的）
static validateNodeExpressions(
  parameters: any,
  context: ExpressionContext
): ExpressionValidationResult

// 式の抽出
private static extractExpressions(text: string): string[]

// 構文エラーチェック
private static checkSyntaxErrors(expression: string): string[]

// 一般的な間違いの検出
private static checkCommonMistakes(expr: string, result: ExpressionValidationResult): void

// ノード参照の確認
private static checkNodeReferences(
  result: ExpressionValidationResult,
  context: ExpressionContext
): void
```

**サポートする変数パターン**:
```typescript
const VARIABLE_PATTERNS = {
  json: /\$json(\.[a-zA-Z_][\w]*|\["[^"]+"\]|\['[^']+'\]|\[\d+\])*/g,
  node: /\$node\["([^"]+)"\]\.json/g,
  input: /\$input\.item(\.[a-zA-Z_][\w]*|\["[^"]+"\]|\['[^']+'\]|\[\d+\])*/g,
  items: /\$items\("([^"]+)"(?:,\s*(-?\d+))?\)/g,
  parameter: /\$parameter\["([^"]+)"\]/g,
  env: /\$env\.([a-zA-Z_][\w]*)/g,
  workflow: /\$workflow\.(id|name|active)/g,
  execution: /\$execution\.(id|mode|resumeUrl)/g,
  prevNode: /\$prevNode\.(name|outputIndex|runIndex)/g,
  itemIndex: /\$itemIndex/g,
  runIndex: /\$runIndex/g,
  now: /\$now/g,
  today: /\$today/g,
};
```

**コンテキスト情報**:
```typescript
interface ExpressionContext {
  availableNodes: string[];     // 利用可能なノード名リスト
  currentNodeName?: string;     // 現在のノード名
  isInLoop?: boolean;           // ループ内かどうか
  hasInputData?: boolean;       // 入力データの有無
}
```

**検証ロジック**:
1. **構文エラーチェック**:
   - 括弧の対応: `{{ }}`の開閉一致
   - ネスト検出: `{{ {{ }} }}`の禁止
   - 空式検出: `{{ }}`の警告
2. **変数パターンマッチング**:
   - 各変数パターンで式内の変数を抽出
   - `usedVariables`と`usedNodes`に記録
3. **コンテキスト検証**:
   - `$json`使用時: `hasInputData`または`isInLoop`を確認
   - `$input`使用時: `hasInputData`を確認
   - `$node`/`$items`参照時: `availableNodes`で存在確認
4. **一般的な間違いチェック**:
   - `$`プレフィックスの欠落検出（`json`を`$json`に修正提案）
   - 配列アクセス形式の誤り（`$json[0]`を推奨）
   - テンプレートリテラル（`${}`）の誤用検出
   - オプショナルチェイニング（`?.`）の非対応警告
5. **未定義ノード参照の検出**:
   - `$node["NodeName"]`または`$items("NodeName")`で参照されたノードを`usedNodes`に追加
   - `availableNodes`リストで存在確認
   - 未定義の場合: `Referenced node "NodeName" not found in workflow`エラー

**再帰的検証**:
- `validateNodeExpressions()`がパラメータオブジェクトを再帰的に走査
- 文字列フィールドに`{{ }}`が含まれる場合、`validateExpression()`を呼び出し
- 循環参照対策として`WeakSet<object>`で訪問済みオブジェクトを追跡
- パス情報（`config.options.timeout`など）をエラーメッセージに付加

**エラー例**:
```typescript
// 括弧の不一致
{
  errors: ['Unmatched expression brackets {{ }}'],
  warnings: [],
  usedVariables: new Set(),
  usedNodes: new Set(),
  valid: false
}

// 未定義ノード参照
{
  errors: ['Referenced node "HTTP Request 2" not found in workflow'],
  warnings: [],
  usedVariables: new Set(['$node']),
  usedNodes: new Set(['HTTP Request 2']),
  valid: false
}

// テンプレートリテラル誤用
{
  errors: ['Template literals ${} are not supported. Use string concatenation instead'],
  warnings: [],
  usedVariables: new Set(),
  usedNodes: new Set(),
  valid: false
}

// $プレフィックス欠落
{
  errors: [],
  warnings: ['Possible missing $ prefix for variable (e.g., use $json instead of json)'],
  usedVariables: new Set(),
  usedNodes: new Set(),
  valid: true
}
```

#### 2-5. AI固有ノード検証（AINodeValidator）

**ファイル**: `src/services/ai-node-validator.ts` (635行)

**検証対象のAIノードタイプ**:
- `@n8n/n8n-nodes-langchain.agent` (AI Agent)
- `@n8n/n8n-nodes-langchain.chatTrigger` (Chat Trigger)
- `@n8n/n8n-nodes-langchain.chainLlm` (Basic LLM Chain)
- AI Tool sub-nodes（13タイプ）

**主要機能**:
```typescript
// 逆接続マップ構築（AI接続はTO方向）
export function buildReverseConnectionMap(
  workflow: WorkflowJson
): Map<string, ReverseConnection[]>

// AI接続の取得
export function getAIConnections(
  nodeName: string,
  reverseConnections: Map<string, ReverseConnection[]>,
  connectionType?: string
): ReverseConnection[]

// AI Agent検証
export function validateAIAgent(
  node: WorkflowNode,
  reverseConnections: Map<string, ReverseConnection[]>,
  workflow: WorkflowJson
): ValidationIssue[]

// Chat Trigger検証
export function validateChatTrigger(
  node: WorkflowNode,
  workflow: WorkflowJson,
  reverseConnections: Map<string, ReverseConnection[]>
): ValidationIssue[]

// Basic LLM Chain検証
export function validateBasicLLMChain(
  node: WorkflowNode,
  reverseConnections: Map<string, ReverseConnection[]>
): ValidationIssue[]

// メインエントリーポイント
export function validateAISpecificNodes(
  workflow: WorkflowJson
): ValidationIssue[]
```

**AI接続タイプ**:
```typescript
const AI_CONNECTION_TYPES = [
  'ai_languageModel',   // 言語モデル接続
  'ai_memory',          // メモリ接続
  'ai_tool',            // ツール接続
  'ai_embedding',       // 埋め込みモデル接続
  'ai_vectorStore',     // ベクトルストア接続
  'ai_document',        // ドキュメント接続
  'ai_textSplitter',    // テキスト分割接続
  'ai_outputParser'     // 出力パーサー接続
] as const;
```

**検証項目**:

**1. AI Agent検証**:
- **言語モデル接続**: 1-2個必須（2個の場合はフォールバック設定を確認）
  - 0個: エラー `MISSING_LANGUAGE_MODEL`
  - 3個以上: エラー `TOO_MANY_LANGUAGE_MODELS`
  - 2個でneedsFallback=false: 警告
  - 1個でneedsFallback=true: エラー `FALLBACK_MISSING_SECOND_MODEL`
- **出力パーサー設定**: 一貫性確認
  - hasOutputParser=trueで接続なし: エラー `MISSING_OUTPUT_PARSER`
  - hasOutputParser=falseで接続あり: 警告
  - 2個以上の出力パーサー: エラー `MULTIPLE_OUTPUT_PARSERS`
- **プロンプトタイプ**: 自動 vs 定義の妥当性
  - promptType='define'でtextが空: エラー `MISSING_PROMPT_TEXT`
- **システムメッセージ**: 推奨（20文字以上）
- **ストリーミングモード制約**: **CRITICAL**
  - Chat Triggerからのストリーミング時、AI Agentにmain出力接続があるとエラー `STREAMING_WITH_MAIN_OUTPUT`
  - 自身のstreamResponse=trueでもmain出力接続禁止
- **メモリ接続**: 0-1個に制限
  - 2個以上: エラー `MULTIPLE_MEMORY_CONNECTIONS`
- **ツール接続**: 0個の場合は情報レベル警告
- **maxIterations**: 50超過時に警告

**2. Chat Trigger検証**:
- **responseMode='streaming'**: AI Agentターゲット必須
  - 非AI Agentへの接続: エラー `STREAMING_WRONG_TARGET`
  - AI Agentにmain出力接続あり: エラー `STREAMING_AGENT_HAS_OUTPUT`
- **responseMode='lastNode'**: AI Agentの場合、ストリーミング推奨（情報レベル）

**3. Basic LLM Chain検証**:
- **言語モデル接続**: 正確に1個必須
  - 0個: エラー `MISSING_LANGUAGE_MODEL`
  - 2個以上: エラー `MULTIPLE_LANGUAGE_MODELS`（フォールバック非対応）
- **メモリ接続**: 0-1個に制限
- **ツール接続**: 禁止（エラー `TOOLS_NOT_SUPPORTED`）
- **プロンプト設定**: AI Agent同様

**逆接続マップ（Reverse Connection Map）**:
- **通常のn8n接続**: `Source -> Target` 方向
  ```typescript
  workflow.connections["Source"]["main"] = [[{node: "Target", ...}]]
  ```
- **AI接続**: `Provider -> Consumer` 方向（逆方向）
  ```typescript
  workflow.connections["Language Model"]["ai_languageModel"] = [[{node: "AI Agent", ...}]]
  ```
- **逆接続マップ**: `buildReverseConnectionMap()`でAI検証用に逆引きマップ構築
  ```typescript
  reverseMap.get("AI Agent") = [
    {sourceName: "Language Model", type: "ai_languageModel", ...},
    {sourceName: "Memory", type: "ai_memory", ...}
  ]
  ```

**エラーコード一覧**:
- `MISSING_LANGUAGE_MODEL`: 言語モデル接続なし
- `TOO_MANY_LANGUAGE_MODELS`: 言語モデル接続が3個以上
- `FALLBACK_MISSING_SECOND_MODEL`: フォールバック有効だが2個目の言語モデルなし
- `MISSING_OUTPUT_PARSER`: hasOutputParser=trueだが接続なし
- `MULTIPLE_OUTPUT_PARSERS`: 出力パーサー2個以上
- `MISSING_PROMPT_TEXT`: promptType='define'だがtextが空
- `STREAMING_WITH_MAIN_OUTPUT`: ストリーミングモードでmain出力接続あり
- `STREAMING_WRONG_TARGET`: ストリーミングモードだが非AI Agentターゲット
- `STREAMING_AGENT_HAS_OUTPUT`: ストリーミングAI Agentにmain出力接続
- `MULTIPLE_MEMORY_CONNECTIONS`: メモリ接続2個以上
- `INVALID_MAX_ITERATIONS_TYPE`: maxIterationsが数値でない
- `MAX_ITERATIONS_TOO_LOW`: maxIterations < 1
- `TOOLS_NOT_SUPPORTED`: Basic LLM Chainにツール接続
- `MISSING_CONNECTIONS`: Chat Triggerに出力接続なし
- `INVALID_TARGET_NODE`: 接続先ノードが存在しない

**実装の特徴**:
1. **逆接続マップの構築**: AI接続はProvider→Consumer方向なので、逆引きマップで効率的に検証
2. **ストリーミングモード検証**: Chat Triggerからのストリーミング時、AI Agentのmain出力を禁止する厳密な制約
3. **情報レベルの警告**: ツール接続なし、システムメッセージなしは情報レベル（エラーではない）
4. **定数管理**: `MIN_SYSTEM_MESSAGE_LENGTH=20`、`MAX_ITERATIONS_WARNING_THRESHOLD=50`

#### 2-6. 基底検証ロジック（ConfigValidator）

**ファイル**: `src/services/config-validator.ts` (999行)

ConfigValidatorはEnhancedConfigValidatorの基底クラスで、ノード設定の基本的な検証ロジックを提供します。

**主要メソッド**:
```typescript
// メイン検証メソッド
static validate(
  nodeType: string,
  config: Record<string, any>,
  properties: any[],
  userProvidedKeys?: Set<string>
): ValidationResult

// バッチ検証
static validateBatch(
  configs: Array<{nodeType, config, properties}>
): ValidationResult[]

// 必須プロパティチェック
private static checkRequiredProperties(
  properties: any[],
  config: Record<string, any>,
  errors: ValidationError[]
): void

// プロパティ可視性判定
protected static isPropertyVisible(
  prop: any,
  config: Record<string, any>
): boolean

// プロパティ型検証
private static validatePropertyTypes(
  properties: any[],
  config: Record<string, any>,
  errors: ValidationError[]
): void

// ノード固有検証
private static performNodeSpecificValidation(
  nodeType: string,
  config: Record<string, any>,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: string[],
  autofix: Record<string, any>
): void

// セキュリティチェック
private static performSecurityChecks(
  nodeType: string,
  config: Record<string, any>,
  warnings: ValidationWarning[]
): void
```

**検証項目**:
1. **必須プロパティチェック**:
   - プロパティの存在確認
   - null/undefined検出
   - 空文字列検出（required string）
2. **プロパティ可視性評価**:
   - displayOptions.show条件の評価
   - displayOptions.hide条件の評価
3. **型検証**:
   - string/number/boolean/array/object型チェック
   - resourceLocator型の特殊検証
   - options型（enum）の値検証
4. **ノード固有検証**:
   - HTTP Request: URL形式、認証、JSON body、POST/PUT/PATCH body
   - Webhook: responseMode検証
   - Postgres/MySQL: SQL injection警告、DELETE WHERE句、SELECT *警告
   - Code: 構文チェック、n8nパターン検証、return文確認
5. **セキュリティチェック**:
   - ハードコード認証情報の検出（api_key, password, secret, token, credential）

**ノード固有検証の詳細**:

**HTTP Request**:
- URL形式: `http://`または`https://`で始まるか
- 式の除外: `shouldSkipLiteralValidation()`で式を除外
- POST/PUT/PATCH body警告: `sendBody=false`で警告
- 認証警告: API endpoint検出（`api.`または`/api/`）で認証なしの警告
- JSON body検証: `JSON.parse()`で構文エラー検出

**Code Node**:
- 構文チェック（JavaScript/Python）:
  - 括弧の対応: `{}`、`()`、`[]`の開閉一致
  - Pythonインデント: タブとスペースの混在検出
  - 制御構造: コロンの欠落検出（Python）
- n8n変数パターン検証:
  - return文の存在確認
  - items/input参照の確認
  - `$json`使用時の"Run Once for Each Item"モード警告
  - `$helpers`可用性チェック（mode依存）
  - `$helpers.getWorkflowStaticData()`の誤用検出→`$getWorkflowStaticData()`推奨
  - async/await警告（Promise未解決）
  - crypto requireチェック
  - 無限ループ検出（`while(true)`または`while True:`）
  - エラーハンドリング推奨（try/catch, try/except）
- return形式検証:
  - JavaScript: `return [{json: {...}}]`形式推奨
  - Python: `return [{"json": {...}}]`形式推奨
  - 配列でラップされているか確認
  - json keyの存在確認

**Postgres/MySQL**:
- SQL injection警告: `${}`または`{{}}`を含むクエリ
- DELETE without WHERE: 全レコード削除の警告
- SELECT *: 特定カラム選択の推奨

**resourceLocator型検証**:
- 構造検証: `{mode: string, value: any}`形式
- mode検証: スキーマ定義のmodesリストと照合
- value必須チェック
- AIモデルノード（OpenAI, Anthropic等）で使用

**UI-only型の除外**:
- 'notice', 'callout', 'infoBox', 'info'型は検証スキップ（設定ではなくUI要素）

**エラー型**:
```typescript
type ValidationErrorType =
  | 'missing_required'      // 必須フィールド欠落
  | 'invalid_type'          // 型不一致
  | 'invalid_value'         // 無効な値
  | 'incompatible'          // 互換性なし
  | 'invalid_configuration' // 設定不正
  | 'syntax_error';         // 構文エラー

type ValidationWarningType =
  | 'missing_common'        // よく使われるフィールド欠落
  | 'deprecated'            // 非推奨
  | 'inefficient'           // 非効率
  | 'security'              // セキュリティ警告
  | 'best_practice'         // ベストプラクティス違反
  | 'invalid_value';        // 無効な値（警告レベル）
```

**userProvidedKeys追跡**:
- EnhancedConfigValidatorから渡される
- デフォルト値として追加されたプロパティへの誤警告を防ぐ
- `checkCommonIssues()`でユーザー未指定プロパティの可視性警告をスキップ

**実装の特徴**:
1. **式のスキップロジック**: `shouldSkipLiteralValidation()`でn8n式（`{{ }}`や`=`プレフィックス）を検証から除外
2. **セキュリティパターン**: `/api[_-]?key/i`, `/password/i`, `/secret/i`, `/token/i`, `/credential/i`でハードコード検出
3. **バッチ検証**: 複数ノードの一括検証サポート
4. **可視性要件メッセージ**: `getVisibilityRequirement()`でdisplayOptions.showの不一致を人間可読形式で提示

#### 2-7. 検証プロファイルの詳細実装

**検証フロー（シーケンス）**:

```
validateWorkflow() 入力
  ↓
1. null/undefined チェック
  ↓
2. 構造検証（validateWorkflowStructure）
   ├─ ノード配列、接続オブジェクト型確認
   ├─ 重複ID・名前検出
   └─ 単一ノード/多ノード別の妥当性評価
  ↓
3. ノード検証（validateNodes=true時）
   ├─ 型の正規化（NodeTypeNormalizer）
   ├─ NodeRepositoryからノード定義取得
   ├─ typeVersion検証（Langchain含む全versioned nodes）
   ├─ EnhancedConfigValidatorで設定検証
   └─ NodeSimilarityServiceで類似ノード提案
  ↓
4. 接続検証（validateConnections=true時）
   ├─ 出力接続（main/error/ai_tool）確認
   ├─ 循環検出（loopNodeTypes例外）
   ├─ 孤立ノード検出
   └─ エラー出力設定の矛盾検出
  ↓
5. 式検証（validateExpressions=true時）
   ├─ ExpressionValidator で構文チェック
   ├─ ExpressionFormatValidator で形式確認
   └─ 式カウント（統計に追加）
  ↓
6. パターン検証（checkWorkflowPatterns）
   ├─ エラーハンドリング状況
   ├─ 線形チェーン長測定
   ├─ AINodeValidatorでAI特化検証
   └─ 認証情報確認
  ↓
7. 提案生成
   ├─ トリガー、エラーハンドリング提案
   ├─ 構造警告に基づく修正例
   └─ 回復ワークフロー（error typesで分類）
  ↓
出力: WorkflowValidationResult
      { valid, errors[], warnings[], statistics, suggestions[] }
```

#### 2-7. エラーメッセージ形式

**ValidationIssue型**:
```typescript
{
  type: 'error' | 'warning',
  nodeId?: string,
  nodeName?: string,
  message: string,
  details?: any,  // 修正例やメタデータ
  code?: string   // エラーコード（例: MISSING_LANGUAGE_MODEL）
}
```

**提案（suggestions）の特徴**:
- 「🔧 RECOVERY」タグで修正方法を構造化
- エラー数が3を超えると段階的なワークフロー提示
- ノード型プレフィックス（`n8n-nodes-base.`）の正確な使用法をガイド

### 3. 依存関係と外部ライブラリ

**検証システムで使用されるライブラリ**:

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| `zod` | ^3.24.1 | スキーマ検証 |
| `n8n-workflow` | ^1.115.0 | 式の解析、ノード型情報 |
| `sql.js` | ^1.13.0 | SQLiteデータベース（FTS5全文検索） |
| `typescript` | ^5.8.3 | 型チェック |

**n8n関連の依存関係**:
- `n8n` (^1.118.1): メインパッケージ
- `n8n-core` (^1.117.0): コア機能
- `n8n-workflow` (^1.115.0): ワークフロー型定義・式パーサー
- `@n8n/n8n-nodes-langchain` (^1.117.0): Langchainノード定義

### 4. 完全移植戦略

#### 4-1. 移植する全機能

**Phase 1: データベース基盤（最優先）**
1. **SQLiteデータベーススキーマ**: schema.sqlを完全移植
   - nodes テーブル（541ノード情報）
   - node_versions テーブル（バージョン管理）
   - templates テーブル（ワークフローテンプレート）
   - template_node_configs テーブル（実世界の設定例）
   - workflow_versions テーブル（ワークフロー履歴）
   - FTS5全文検索インデックス

2. **DatabaseAdapter**: better-sqlite3とsql.jsの抽象化層
   - トランザクション管理
   - プラグマ設定
   - FTS5サポート確認

3. **NodeRepository**: ノード情報のデータアクセス層
   - ノード保存・取得（saveNode、getNode）
   - ノード検索（searchNodes、getNodesByCategory）
   - バージョン管理（saveNodeVersion、getNodeVersions）
   - 操作・リソース管理（getNodeOperations、getNodeResources）

4. **Node Database Builder**: データベース構築システム
   - N8nNodeLoader（n8nパッケージからノード情報ロード）
   - NodeParser（ノード情報の解析）
   - rebuild.tsスクリプト（データベース構築）

**Phase 2: 検証機能（コア）**
5. **WorkflowValidator**: ワークフロー全体の統合検証
   - 構造検証（validateWorkflowStructure）
   - ノード検証（validateAllNodes）
   - 接続検証（validateConnections）
   - 式検証（validateExpressions）
   - パターン検証（checkWorkflowPatterns）

6. **EnhancedConfigValidator**: ノード設定検証
   - 操作認識機能（operation-aware）
   - 検証プロファイル（minimal/runtime/ai-friendly/strict）
   - ValidationMode（full/operation/minimal）
   - デフォルト値適用
   - fixedCollection自動修正

7. **ExpressionValidator**: n8n式検証
   - 構文チェック（括弧対応、ネスト検出）
   - 変数参照検証（$json/$node/$inputなど）
   - 未定義変数検出

8. **AINodeValidator**: AI固有ノード検証
   - 言語モデル接続チェック
   - ストリーミングモード検証
   - ツール接続検証

**Phase 3: サポート機能**
9. **NodeSimilarityService**: ノード類似度検索
   - FTS5全文検索活用
   - 類似ノード提案

10. **OperationSimilarityService/ResourceSimilarityService**: 操作・リソース類似度マッチング

11. **NodeSpecificValidators**: ノード固有バリデータ
    - Slack、GoogleSheets、HTTPRequestなど

12. **TemplateSanitizer**: テンプレートのサニタイズ

#### 4-2. 依存パッケージの追加（czlonkowskiの依存関係をそのまま移植）

czlonkowski/n8n-mcpのpackage.jsonから以下の依存関係を追加:

```json
{
  "dependencies": {
    "better-sqlite3": "^11.8.1",
    "sql.js": "^1.13.0",
    "n8n-workflow": "^1.115.0",
    "n8n": "^1.118.1",
    "n8n-core": "^1.117.0",
    "@n8n/n8n-nodes-langchain": "^1.117.0"
  }
}
```

#### 4-3. 移植方針（czlonkowskiの構造をそのまま維持）

**ディレクトリ構造**:
czlonkowskiのディレクトリ構造をそのまま本プロジェクトに追加:
- src/validation/ （czlonkowskiのsrc/services/から検証関連をコピー）
- src/database/ （czlonkowskiのsrc/database/をそのままコピー）
- src/loaders/ （czlonkowskiのsrc/loaders/をそのままコピー）
- src/parsers/ （czlonkowskiのsrc/parsers/をそのままコピー）
- src/scripts/ （czlonkowskiのsrc/scripts/rebuild.tsをコピー）

**MCPツール統合**:
- ValidateWorkflowTool（新規）: czlonkowskiのvalidate_workflowツールを移植
- CreateWorkflowTool: 検証機能を統合
- UpdateWorkflowTool: 検証機能を統合

**データベースビルド**:
czlonkowskiのbuildプロセスをそのまま実装:
- `pnpm run rebuild` コマンド追加（czlonkowskiと同じ）
- data/nodes.db をリポジトリに含める

### 5. アーキテクチャ統合案

**本プロジェクトの拡張された層構造**:

```
Tool Layer (src/tools/implementations/)
  ├─ CreateWorkflowTool → executeCore() → validateWorkflow()
  ├─ UpdateWorkflowTool → executeCore() → validateWorkflow()
  └─ ValidateWorkflowTool (新規) → executeCore() → validateWorkflow()

Validation Layer (新規: src/validation/)
  ├─ workflow-validator.ts
  │   ├─ WorkflowValidator クラス
  │   ├─ validateWorkflow() - 統合検証エントリーポイント
  │   ├─ validateWorkflowStructure() - 構造検証
  │   ├─ validateAllNodes() - ノード個別検証
  │   ├─ validateConnections() - 接続検証
  │   ├─ validateExpressions() - 式検証
  │   └─ checkWorkflowPatterns() - パターン検証
  ├─ enhanced-config-validator.ts
  │   ├─ EnhancedConfigValidator クラス
  │   ├─ validateWithMode() - 操作認識検証
  │   ├─ filterPropertiesByMode() - プロパティフィルタリング
  │   └─ applyProfileFilters() - プロファイル適用
  ├─ expression-validator.ts
  │   ├─ ExpressionValidator クラス
  │   ├─ validateExpressions() - 式構文チェック
  │   └─ extractVariableReferences() - 変数参照抽出
  ├─ expression-format-validator.ts
  │   └─ ExpressionFormatValidator クラス
  ├─ ai-node-validator.ts
  │   ├─ validateAISpecificNodes() - AIノード検証
  │   └─ validateAIToolSubNode() - AIツールサブノード検証
  ├─ node-specific-validators.ts
  │   └─ NodeSpecificValidators クラス（Slack、GoogleSheetsなど）
  └─ config-validator.ts
      └─ ConfigValidator クラス（基本設定検証）

Services Layer (新規: src/services/)
  ├─ node-similarity-service.ts
  │   └─ NodeSimilarityService クラス（FTS5全文検索）
  ├─ operation-similarity-service.ts
  │   └─ OperationSimilarityService クラス
  ├─ resource-similarity-service.ts
  │   └─ ResourceSimilarityService クラス
  └─ template-sanitizer.ts
      └─ TemplateSanitizer クラス

Database Layer (新規: src/database/)
  ├─ database-adapter.ts
  │   └─ DatabaseAdapter 抽象化層（better-sqlite3/sql.js）
  ├─ node-repository.ts
  │   └─ NodeRepository クラス（ノード情報CRUD）
  └─ schema.sql
      └─ SQLiteスキーマ定義

Loaders Layer (新規: src/loaders/)
  └─ node-loader.ts
      └─ N8nNodeLoader クラス（n8nパッケージからノード情報ロード）

Parsers Layer (新規: src/parsers/)
  └─ node-parser.ts
      └─ NodeParser クラス（ノード情報解析）

Utils Layer (src/utils/)
  ├─ node-type-normalizer.ts
  ├─ node-type-utils.ts
  ├─ node-classification.ts
  ├─ expression-utils.ts
  └─ validation-schemas.ts

Scripts Layer (src/scripts/)
  └─ rebuild.ts
      └─ ノードデータベース構築スクリプト

Types (src/types/)
  ├─ validation-types.ts
  │   ├─ ValidationResult
  │   ├─ ValidationIssue
  │   ├─ ValidationProfile
  │   ├─ ValidationMode
  │   └─ ValidationStatistics
  └─ n8n-types.ts（既存を拡張）
      ├─ INode
      ├─ IConnections
      ├─ LoadedNode
      └─ NodePropertyTypes
```

**データフロー**:
```
User Request → CreateWorkflowTool.executeCore()
  ↓
WorkflowValidator.validateWorkflow()
  ↓
├─ validateWorkflowStructure()
│   └─ 構造検証（重複ID、基本構造）
├─ validateAllNodes()
│   ├─ NodeRepository.getNode() → SQLiteからノード定義取得
│   ├─ EnhancedConfigValidator.validateWithMode()
│   │   ├─ filterPropertiesByMode() → 操作コンテキスト適用
│   │   ├─ ConfigValidator.validate() → 基本検証
│   │   └─ applyProfileFilters() → プロファイル適用
│   └─ NodeSimilarityService.findSimilar() → 類似ノード提案
├─ validateConnections()
│   ├─ buildReverseConnectionMap()
│   ├─ checkForCycles() → 循環参照検出
│   └─ checkOrphanedNodes() → 孤立ノード検出
├─ validateExpressions()
│   ├─ ExpressionValidator.validateExpressions()
│   └─ ExpressionFormatValidator.validateFormat()
└─ checkWorkflowPatterns()
    ├─ validateAISpecificNodes() → AIノード検証
    └─ checkNodeErrorHandling() → エラーハンドリング検証
  ↓
ValidationResult → formatResponse() → MCPToolResponse
  ↓
User Response
```

## 関連タスク

- specs/workflow-validation-system-from-czlonkowski-n8n-mcp/
