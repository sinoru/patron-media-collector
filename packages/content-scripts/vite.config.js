import { mergeConfig, defineConfig } from 'vite';
import viteConfig from '../../vite.config.common.js'

export default defineConfig((env) => mergeConfig(
  viteConfig(env),
  defineConfig({
    build: {
      modulePreload: false,
      rollupOptions: {
        input: 'src/index.js',
      },
    },
  }),
));
