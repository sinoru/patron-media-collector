import { resolve } from 'path';
import { defineConfig } from 'vite';

const root = './src'

export default defineConfig(({ command, mode }) => {
  return {
    base: './',
    build: {
      emptyOutDir: true,
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: {
          background: resolve(__dirname, root, 'background/index.js'),
          content: resolve(__dirname, root, 'content/index.js'),
          popup: resolve(__dirname, root, 'popup/index.html')
        },
        output: {
          entryFileNames: (chunkInfo) => {
            switch (chunkInfo.name) {
            case 'popup':
              return '[name]/[name].js';
            default:
              return '[name].js';
            }
          },
        },
      },
      sourcemap: (() => {
        switch (mode) {
          case 'development':
            return 'inline';
          default:
            return false;
        }
      })(),
      target: [
        'firefox115',
        'safari16',
        'ios15',
      ],
    },
    root,
  }
});