import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the built game also loads from file:// inside Electron.
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 120000,
  },
} as any);
