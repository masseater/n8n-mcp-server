# n8n MCP Server 出力サイズ改善計画レポート

## 目的
現状のMCPツールはレスポンスサイズが大きく、コンテキスト長を圧迫している。
基本的に成功/失敗のステータスのみを返し、`raw`オプション指定時のみ完全なAPIレスポンスを返す仕組みに変更する。

## 各ツールの分析と改善計画

### 1. list_workflows

#### 現状
- **テストケース**: `limit: 10`で10件のワークフローを取得
- **出力サイズ**: 約1,350文字（10件）
- **主な内容**: 各ワークフローのid, name, active, tags, createdAt, updatedAt, nodeCount
- **問題点**:
  - すでにoptimizeWorkflowSummary()で最適化されており、比較的コンパクト
  - ただし、複数ワークフローを取得する際に全フィールドが必要とは限らない
  - createdAt/updatedAtは通常不要な場合が多い

#### 改善案
- **デフォルト出力**:
  ```json
  {
    "success": true,
    "message": "10件のワークフローを取得しました",
    "data": {
      "count": 10,
      "workflows": [
        { "id": "xxx", "name": "workflow name", "active": true }
      ]
    }
  }
  ```
  必要最小限の情報（id, name, active）のみを返す

- **rawオプション出力**: 現在の完全な出力（id, name, active, tags, createdAt, updatedAt, nodeCount）
- **予想削減率**: 約60-70%削減（1,350文字 → 400-500文字程度）

---

### 2. get_workflow

#### 現状
- **テストケース**: ID `a0kjjRzNfR9bC9jD` のワークフロー取得（16ノード、13接続）
- **出力サイズ**: 約2,300文字
- **主な内容**: id, name, active, tags, createdAt, updatedAt, nodes配列（各ノードのid, name, type, position, disabled）, connections, settings
- **問題点**:
  - **最大のボトルネック**: nodesとconnectionsが大部分を占める
  - nodes配列は各ノードの詳細情報を含むが、パラメータは除外済み（optimizeWorkflowDetail適用済み）
  - connectionsオブジェクトも詳細な接続情報を含む
  - 通常の操作では「ワークフローが存在するか」「基本情報」のみで十分な場合が多い

#### 改善案
- **デフォルト出力**:
  ```json
  {
    "success": true,
    "message": "ワークフローを取得しました",
    "data": {
      "id": "xxx",
      "name": "workflow name",
      "active": true,
      "nodeCount": 16,
      "tags": ["admin", "slack"]
    }
  }
  ```
  基本情報のみを返す（nodes/connections詳細は除外）

- **rawオプション出力**: 現在の完全な出力（nodes配列とconnections含む）
- **予想削減率**: 約85-90%削減（2,300文字 → 200-300文字程度）

---

### 3. create_workflow

#### 現状
- **テストケース**: 新規ワークフロー作成（コードから推測）
- **出力サイズ**: 推定2,000-3,000文字（作成したワークフロー全体を返却）
- **主な内容**: 作成されたワークフローの完全な情報（JSON.stringify(workflow, null, 2)）
- **問題点**:
  - **大きな無駄**: 作成したワークフローの全データを返している（src/server/mcp-server.ts:558）
  - 作成成功確認には、IDとnameがあれば十分
  - nodes/connectionsの詳細は不要

#### 改善案
- **デフォルト出力**:
  ```json
  {
    "success": true,
    "message": "ワークフローを作成しました",
    "data": {
      "id": "xxx",
      "name": "workflow name",
      "active": false
    }
  }
  ```
  作成成功とID、名前のみを返す

- **rawオプション出力**: 作成されたワークフローの完全な情報
- **予想削減率**: 約90%削減（2,500文字 → 200文字程度）

---

### 4. update_workflow

#### 現状
- **テストケース**: 既存ワークフローの更新（コードから推測）
- **出力サイズ**: 推定2,000-3,000文字（更新後のワークフロー全体を返却）
- **主な内容**: 更新されたワークフローの完全な情報（JSON.stringify(workflow, null, 2)）
- **問題点**:
  - **create_workflowと同じ問題**: 更新後の全データを返している（src/server/mcp-server.ts:594）
  - 更新成功確認には、成功ステータスがあれば十分
  - 更新内容の確認が必要な場合のみ、rawオプションで取得すれば良い

#### 改善案
- **デフォルト出力**:
  ```json
  {
    "success": true,
    "message": "ワークフローを更新しました",
    "data": {
      "id": "xxx",
      "name": "workflow name"
    }
  }
  ```
  更新成功とID、名前のみを返す

- **rawオプション出力**: 更新されたワークフローの完全な情報
- **予想削減率**: 約90%削減（2,500文字 → 200文字程度）

---

### 5. delete_workflow

#### 現状
- **テストケース**: ワークフロー削除（コードから確認）
- **出力サイズ**: 約60文字
- **主な内容**: `Workflow ${args.id} deleted successfully`（src/server/mcp-server.ts:614）
- **問題点**:
  - すでにシンプルな実装になっている
  - ただし、成功/失敗の構造化されたレスポンスではない

#### 改善案
- **デフォルト出力**:
  ```json
  {
    "success": true,
    "message": "ワークフローを削除しました",
    "data": {
      "id": "xxx"
    }
  }
  ```
  構造化されたレスポンスに統一

- **rawオプション出力**: デフォルトと同じ（削除操作に追加情報は不要）
- **予想削減率**: ほぼ同等（構造化により若干増加するが、一貫性向上）

---

## 総合分析

### コンテキスト削減効果の見込み

| ツール | 現在の出力サイズ | 改善後のサイズ | 削減率 |
|--------|----------------|--------------|--------|
| list_workflows | 1,350文字 | 400-500文字 | 60-70% |
| get_workflow | 2,300文字 | 200-300文字 | 85-90% |
| create_workflow | 2,500文字 | 200文字 | 90% |
| update_workflow | 2,500文字 | 200文字 | 90% |
| delete_workflow | 60文字 | 80文字 | -30%（構造化のため） |

**総合的な削減効果**: 平均75-85%のコンテキスト削減が見込まれる

### ボトルネックまとめ

1. **get_workflow**: nodes配列とconnectionsが最大のボトルネック
   - ノード数に比例して出力サイズが増加
   - 大規模ワークフロー（50+ノード）では5,000文字以上になる可能性

2. **create/update_workflow**: 不要な完全レスポンス返却
   - 作成・更新後の全データを返す必要性は低い
   - AIモデルのコンテキストを無駄に消費

3. **list_workflows**: 中規模の無駄
   - createdAt/updatedAtなど通常不要な情報を含む
   - 大量のワークフロー取得時に累積的な影響

## 実装方針

### 共通レスポンス型の設計

```typescript
// src/types/mcp-response.ts
interface MCPToolResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string;
  };
}

// 各ツール用のレスポンス型
interface WorkflowListResponse {
  count: number;
  workflows: Array<{
    id: string;
    name: string;
    active: boolean;
  }>;
}

interface WorkflowDetailResponse {
  id: string;
  name: string;
  active: boolean;
  nodeCount: number;
  tags: string[];
}

interface WorkflowCreateResponse {
  id: string;
  name: string;
  active: boolean;
}

interface WorkflowUpdateResponse {
  id: string;
  name: string;
}

interface WorkflowDeleteResponse {
  id: string;
}
```

### ResponseOptimizerの拡張

```typescript
// src/optimizers/response-optimizer.ts に追加

interface OptimizationOptions {
  raw?: boolean;  // trueの場合、最適化をスキップ
}

class ResponseOptimizerImpl {
  // 既存メソッドにrawオプションを追加
  createToolResponse<T>(
    success: boolean,
    message: string,
    data?: T,
    options?: OptimizationOptions
  ): MCPToolResponse<T> {
    if (!success) {
      return {
        success: false,
        message,
        error: {
          code: 'OPERATION_FAILED',
          details: message
        }
      };
    }

    return {
      success: true,
      message,
      data: options?.raw ? data : this.minimizeData(data)
    };
  }

  private minimizeData<T>(data: T): T {
    // データ型に応じて最小化処理を適用
    // 既存のoptimize系メソッドを活用
  }
}
```

### ツールハンドラーの修正パターン

各ツールのハンドラーを以下のパターンで修正：

```typescript
// Before
this.server.registerTool(
  "get_workflow",
  {
    description: "Get detailed information about a specific workflow",
    inputSchema: {
      id: z.string(),
    },
  },
  async (args) => {
    const workflow = await this.n8nClient.getWorkflow(args.id);
    const optimizedWorkflow = this.optimizer.optimizeWorkflowDetail(workflow);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(optimizedWorkflow, null, 2),
        },
      ],
    };
  }
);

// After
this.server.registerTool(
  "get_workflow",
  {
    description: "Get detailed information about a specific workflow",
    inputSchema: {
      id: z.string(),
      raw: z.boolean().optional(),  // rawオプション追加
    },
  },
  async (args) => {
    const workflow = await this.n8nClient.getWorkflow(args.id);

    if (args.raw) {
      // rawオプション指定時は完全な情報を返す
      const optimizedWorkflow = this.optimizer.optimizeWorkflowDetail(workflow);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(optimizedWorkflow, null, 2),
          },
        ],
      };
    }

    // デフォルトは最小限の情報
    const response: MCPToolResponse<WorkflowDetailResponse> = {
      success: true,
      message: "ワークフローを取得しました",
      data: {
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        nodeCount: workflow.nodes?.length || 0,
        tags: workflow.tags || []
      }
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }
);
```

## 実装スケジュール

### Phase 1: 基盤整備
- [ ] 共通レスポンス型の定義
- [ ] ResponseOptimizerへのrawオプション対応追加

### Phase 2: 各ツールの実装
- [ ] list_workflows対応
- [ ] get_workflow対応
- [ ] create_workflow対応
- [ ] update_workflow対応
- [ ] delete_workflow対応

### Phase 3: テストと検証
- [ ] 各ツールの動作確認
- [ ] コンテキスト削減効果の測定
- [ ] ドキュメント更新

---
作成日: 2025-10-24
最終更新: 2025-10-24
