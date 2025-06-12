import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import dns from 'dns';

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
    visualizer({
      open: true,
    }),
    // your other plugins
    viteCommonjs(),
  ],
  resolve: {
    alias: {
      src: "/src",
      views: "/src/views",
      core: "/src/core",
    },
    mainfield: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(["react-moment"])],
    },
  },
  server: {
    host: true,
    port: 3001,
  },
});
