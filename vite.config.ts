import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main/main.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [
    react(),
    copy({
      verbose: true,
      hook: 'writeBundle',
      targets: [
        {
          src: 'manifest.json',
          dest: 'dist',
        },
        {
          src: '*.html',
          dest: 'dist',
        },
      ],
    }),
  ],
});
