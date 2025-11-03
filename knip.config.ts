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
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },
};

export default config;
