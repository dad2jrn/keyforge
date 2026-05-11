import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryBasePath = '/keyforge/';
const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
} as const;

export default defineConfig(({ mode }) => ({
  base: process.env.BASE_URL ?? (mode === 'production' ? repositoryBasePath : '/'),
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  },
  server: {
    headers: crossOriginIsolationHeaders,
  },
  preview: {
    headers: crossOriginIsolationHeaders,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));
