import process from 'process';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    base: './',
    build: {
      emptyOutDir: true,
      outDir: resolve(process.cwd(), 'dist'),
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'assets/[name].js',
          entryFileNames: '[name].js',
          compact: (() => {
            switch (mode) {
              case 'development':
                return true;
              default:
                return false;
            }
          })(),
          interop: 'auto',
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
        'firefox128',
        'safari15',
        'ios15',
      ],
    },
    root: './src',
  }
});