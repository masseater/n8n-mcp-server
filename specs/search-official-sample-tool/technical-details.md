# 技術詳細ドキュメント

## アーキテクチャ

### システム構成図
```
┌─────────────────────────────────────────────────────────┐
│ Claude Code (MCPクライアント)                            │
└────────────────────┬────────────────────────────────────┘
                     │ MCP Protocol
                     ▼
┌─────────────────────────────────────────────────────────┐
│ MCPサーバー                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ToolRegistry                                      │  │
│  │  - SearchOfficialSamplesTool                     │  │
│  │  - GetOfficialSampleTool                         │  │
│  │  - ImportOfficialSampleTool (オプション)          │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │ OfficialSampleClient                             │  │
│  │  - fetchSamples()                                │  │
│  │  - getSampleById()                               │  │
│  │  - searchSamples()                               │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │ SampleCache (キャッシュ層)                        │  │
│  │  - get(key)                                      │  │
│  │  - set(key, value, ttl)                          │  │
│  │  - invalidate()                                  │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
└─────────────────────┼────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────────┐     ┌─────────────────────┐
│ n8n API           │     │ サンプルソース       │
│ (インポート時のみ)│     │ (n8n.io API)        │
└───────────────────┘     └─────────────────────┘
```

### 技術スタック
- **言語**: TypeScript
- **ランタイム**: Node.js (既存プロジェクトに準拠)
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP Client**: Axios（既存プロジェクトで使用中）
- **キャッシュ**: node-cache（インメモリ、TTL: 24時間）
- **検索**: Fuse.js（ファジー検索ライブラリ）
- **バリデーション**: Zod（既存プロジェクトで使用中）

### インフラ構成
- 既存のn8n-mcp-serverに統合
- デプロイ方法: npm package（既存と同じ）
- 実行モード: stdio / HTTP transport（既存と同じ）

## 技術選定

### サンプルデータソースの選定
**選定結果**: n8n.io公式API

**Phase 1での調査項目**:
- APIエンドポイントの存在確認
- 認証要件（API Keyの必要性）
- レスポンス形式とサンプルIDフォーマット
- レート制限の有無
- APIが存在しない場合の代替案（スクレイピング、GitHub API）の検討

### キャッシュ戦略の選定
**選定結果**: node-cache（インメモリ）

**設定**:
- TTL: 24時間
- プロセス再起動でデータ消失（許容範囲）
- シンプルで軽量な実装

### 検索アルゴリズムの選定
**選定結果**: Fuse.js（ファジー検索）

**実装例**:
```typescript
const fuse = new Fuse(samples, {
  keys: ['title', 'description', 'metadata.tags'],
  threshold: 0.3, // 調整が必要
});
const results = fuse.search(query);
```

**選定理由**:
- 高精度な検索
- typo対応
- スコアリング機能
- 外部依存は許容範囲（npmパッケージ）

## データ設計

### データモデル

#### OfficialSample型定義
```typescript
// src/types/official-sample.ts
export type OfficialSample = {
  id: string;
  title: string;
  description: string;
  workflow: {
    nodes: INode[];
    connections: IConnections;
    settings?: IWorkflowSettings;
  };
  metadata: {
    author?: string;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    usedNodes: string[];
  };
  sourceUrl?: string;
};

export type OfficialSampleSummary = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  nodeCount: number;
};
```

#### レスポンス型定義
```typescript
// MCPツールのレスポンス型
export type SearchOfficialSamplesResponse = {
  count: number;
  samples: OfficialSampleSummary[];
};

export type GetOfficialSampleResponse = OfficialSample;

export type ImportOfficialSampleResponse = {
  workflowId: string;
  name: string;
  active: boolean;
};
```

### データベーススキーマ
データベースは使用しない（キャッシュのみ）

### データフロー

#### サンプル取得フロー
```
OfficialSampleClient.fetchSamples()
  → Check Cache
    → Cache Hit: Return cached data
    → Cache Miss:
      → Fetch from source (API/Scraping/GitHub)
      → Transform to OfficialSample[]
      → Store in cache
      → Return data
```

#### 検索フロー
```
SearchOfficialSamplesTool.executeCore()
  → OfficialSampleClient.searchSamples(query, filters)
    → fetchSamples() // キャッシュ経由で全サンプル取得
    → Apply filters (query, nodeType, tags)
    → Paginate (limit, offset)
    → Transform to OfficialSampleSummary[]
  → Return MCPToolResponse
```

## API設計

### 内部API（クライアントクラス）

#### OfficialSampleClient
```typescript
export class OfficialSampleClient {
  constructor(
    private cache: SampleCache,
    private sourceAdapter: SampleSourceAdapter
  ) {}

  /**
   * 全サンプルを取得（キャッシュ経由）
   */
  async fetchSamples(): Promise<OfficialSample[]> {
    const cached = await this.cache.get('all_samples');
    if (cached) return cached;

    const samples = await this.sourceAdapter.fetchAll();
    await this.cache.set('all_samples', samples, this.cacheTTL);
    return samples;
  }

  /**
   * IDでサンプルを取得
   */
  async getSampleById(id: string): Promise<OfficialSample | null> {
    const samples = await this.fetchSamples();
    return samples.find(s => s.id === id) || null;
  }

  /**
   * サンプルを検索
   */
  async searchSamples(options: SearchOptions): Promise<OfficialSampleSummary[]> {
    const samples = await this.fetchSamples();
    let filtered = samples;

    // フィルタリング
    if (options.query) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(options.query.toLowerCase()) ||
        s.description.toLowerCase().includes(options.query.toLowerCase())
      );
    }

    if (options.nodeType) {
      filtered = filtered.filter(s =>
        s.metadata.usedNodes.includes(options.nodeType)
      );
    }

    if (options.tags?.length) {
      filtered = filtered.filter(s =>
        options.tags.some(tag => s.metadata.tags.includes(tag))
      );
    }

    // ページネーション
    const start = options.offset || 0;
    const end = start + (options.limit || 20);
    const paginated = filtered.slice(start, end);

    // サマリーに変換
    return paginated.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      tags: s.metadata.tags,
      nodeCount: s.workflow.nodes.length,
    }));
  }
}

type SearchOptions = {
  query?: string;
  nodeType?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
};
```

#### SampleSourceAdapter（抽象化）
Phase 1の調査結果に基づいて実装

```typescript
export interface SampleSourceAdapter {
  fetchAll(): Promise<OfficialSample[]>;
  fetchById(id: string): Promise<OfficialSample | null>;
}

// 実装: n8n.io API Adapter
export class N8nIoApiSampleSourceAdapter implements SampleSourceAdapter {
  constructor(
    private httpClient: AxiosInstance,
    private apiKey?: string // Phase 1で認証要件を確認
  ) {}

  async fetchAll(): Promise<OfficialSample[]> {
    // n8n.io APIでサンプルを取得
    // エンドポイント、レスポンス形式はPhase 1で調査
    // 実装詳細はPhase 2で決定
    throw new Error('Not implemented');
  }

  async fetchById(id: string): Promise<OfficialSample | null> {
    throw new Error('Not implemented');
  }
}
```

### MCPツールの実装パターン

#### SearchOfficialSamplesTool
```typescript
export class SearchOfficialSamplesTool extends BaseTool<SearchOfficialSamplesArgs> {
  readonly name = 'search_official_samples';
  readonly description = 'n8n公式サンプルワークフローを検索します';

  constructor(
    private sampleClient: OfficialSampleClient,
    context: ToolContext
  ) {
    super(context);
  }

  getInputSchema() {
    return z.object({
      query: z.string().optional(),
      nodeType: z.string().optional(),
      tags: z.array(z.string()).optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional(),
    });
  }

  async execute(args: SearchOfficialSamplesArgs): Promise<MCPToolResponse> {
    const samples = await this.sampleClient.searchSamples(args);
    return {
      success: true,
      message: `${samples.length}件の公式サンプルを取得しました`,
      data: { count: samples.length, samples },
    };
  }
}
```

**注**: rawオプションは不要のため、BaseTool を使用（RawTool ではない）

## セキュリティ

### データ検証
- **入力バリデーション**: Zodスキーマによる厳密な型チェック
  - nodeType: 有効なn8nノードタイプ形式（n8n-nodes-base.xxx）を厳密に検証
- **出力サニタイゼーション**: 基本的な型チェックのみ
  - INode[]、IConnections形式の確認
  - 悪意のあるワークフロー定義の検出は不要（n8n公式ソースを信頼）

### 認証・認可
- n8n APIへのアクセス: 既存のN8nApiClientImplの認証機構を使用
- n8n.io APIへのアクセス:
  - Phase 1でAPI Key必要性を調査
  - 必要な場合は環境変数 `OFFICIAL_SAMPLE_API_KEY` で管理

### 監査ログ
- サンプルインポート機能: ワークフロー作成操作をログに記録
- ログレベル: info（成功）、error（失敗）

## パフォーマンス要件
**注**: ユーザーはパフォーマンス要件セクションを含めないことを選択したため、省略

### キャッシュ戦略（参考）
- TTL: 24時間
- キャッシュサイズ制限: メモリ使用量による
- キャッシュ無効化: プロセス再起動、または手動クリア機能（実装する場合）

## 開発環境
**注**: ユーザーは開発環境セクションを含めないことを選択したため、省略

## テスト戦略
**注**: ユーザーはテスト戦略セクションを含めないことを選択したため、省略
