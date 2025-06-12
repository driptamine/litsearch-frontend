import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer'


import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import dns from 'dns'


dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
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

    // alias: [
    //   {
    //     find: "common",
    //     replacement: resolve(__dirname, "src/common"),
    //   },
    // ],
    mainfield: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(['react-moment'])],
    },
  },
  server: {
    host: true,
    // open: '/',
    port: 3001,
  },
});
