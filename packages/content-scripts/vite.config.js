import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  return {
    base: './',
    build: {
      emptyOutDir: true,
      modulePreload: false,
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: 'src/index.js',
        output: {
          compact: (() => {
            switch (mode) {
              case 'development':
                return true;
              default:
                return false;
            }
          })(),
          entryFileNames: '[name].js',
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
        'firefox115',
        'safari15',
        'ios15',
        'chrome121',
      ],
    },
    root: './src',
  }
});