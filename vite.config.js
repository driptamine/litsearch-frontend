import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc';
import wyw from '@wyw-in-js/vite';
import { visualizer } from 'rollup-plugin-visualizer'
import { ghPages } from 'vite-plugin-gh-pages'


import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import dns from 'dns'


dns.setDefaultResultOrder('verbatim')

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    plugins: [
      {
        ...wyw({
          babelOptions: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@wyw-in-js/babel-preset",
            ],
          },
        }),
        enforce: 'pre',
      },
      react(),
      ghPages(),
      visualizer({
        open: true, // Automatically opens the visualizer in your browser
      }),
    ],
    resolve: {
      alias: {
        src: "/src",
        views: "/src/views",
        core: "/src/core",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [esbuildCommonjs(['react-moment'])],
      },
    },
    server: {
      host: true,
      port: 3001,
    },
  }
});
