import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['src/**/*.ts'],
  ignore: [
    'dist/**',
    'coverage/**',
    'src/generated/**',
    '**/*.test.ts',
    '**/*.spec.ts',
  ],
};

export default config;
