import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://docs.n8n.io/api/v1/openapi.yml',
  output: {
    path: 'src/generated',
  },
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/sdk',
      asClass: false,
    },
  ],
});
