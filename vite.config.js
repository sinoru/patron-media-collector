import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vite';
import commonConfig from './vite.config.common.js';

export default defineConfig((env) => mergeConfig(
  commonConfig(env),
  defineConfig({
    build: {
      rollupOptions: {
        input: {
          'background': resolve(__dirname, 'src/background/index.js'),
          'popup': resolve(__dirname, 'src/popup/index.html'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            switch (chunkInfo.name) {
            case 'popup':
              return '[name]/index.js';
            default:
              return '[name].js';
            }
          },
          manualChunks: (id) => {
            if (id.includes('src/common')) {
              return 'common'
            } else if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  }),
));