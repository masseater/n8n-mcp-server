import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // In-source testing の有効化
    includeSource: ["src/**/*.ts"],

    // 除外設定
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.temp/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],

    // カバレッジ設定
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/index.ts",
      ],
    },

    // TypeScript サポート
    globals: true,
  },

  // プロダクションビルド用の define 設定
  // import.meta.vitest を undefined にして dead code elimination を有効化
  define: {
    "import.meta.vitest": "undefined",
  },
});
