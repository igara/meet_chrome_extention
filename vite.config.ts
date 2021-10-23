import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { chromeExtension } from 'vite-plugin-chrome-extension';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: 'src/manifest.json',
    },
  },
  plugins: [react(), chromeExtension()],
});
