// vite.config.mjs
import { defineConfig, loadEnv } from "file:///Users/driptamine/Desktop/litsearch-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/driptamine/Desktop/litsearch-frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import wyw from "file:///Users/driptamine/Desktop/litsearch-frontend/node_modules/@wyw-in-js/vite/esm/index.mjs";
import { visualizer } from "file:///Users/driptamine/Desktop/litsearch-frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { ghPages } from "file:///Users/driptamine/Desktop/litsearch-frontend/node_modules/vite-plugin-gh-pages/dist/index.js";
import { viteCommonjs, esbuildCommonjs } from "file:///Users/driptamine/Desktop/litsearch-frontend/node_modules/@originjs/vite-plugin-commonjs/lib/index.js";
import dns from "dns";
dns.setDefaultResultOrder("verbatim");
function lazyImportTogglePlugin(eager) {
  return {
    name: "vite-plugin-lazy-toggle",
    enforce: "pre",
    transform(code, id) {
      if (!/\.(jsx?|tsx?)$/.test(id))
        return null;
      if (!code.includes("lazyImport"))
        return null;
      if (eager) {
        return transformEager(code);
      }
      return transformLazy(code);
    }
  };
}
var LAZY_IMPORT_IMPORT_RE = /import\s*\{\s*lazyImport\s*\}\s*from\s*'[^']*'\s*;?\s*\n?/g;
function transformEager(code) {
  let counter = 0;
  const inlineImports = [];
  code = code.replace(
    /const\s+(\w+)\s*=\s*lazyImport\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*'([^']+)'\s*\)\s*\.then\s*\(\s*m\s*=>\s*\(\s*\{\s*default:\s*m\.(\w+)\s*\}\s*\)\s*\)\s*\)\s*;?\s*/g,
    (_, name, path, exportName) => `import { ${exportName} as ${name} } from '${path}';`
  );
  code = code.replace(
    /const\s+(\w+)\s*=\s*lazyImport\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*'([^']+)'\s*\)\s*\)\s*;?\s*/g,
    (_, name, path) => `import ${name} from '${path}';`
  );
  code = code.replace(
    /lazyImport\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*'([^']+)'\s*\)\s*\)/g,
    (_, path) => {
      const name = `__LazyEager_${counter++}`;
      inlineImports.push({ name, path });
      return name;
    }
  );
  code = code.replace(LAZY_IMPORT_IMPORT_RE, "");
  if (inlineImports.length > 0) {
    const stmts = inlineImports.map(({ name, path }) => `import ${name} from '${path}';`).join("\n");
    const lastImportMatch = code.match(/^import\s.*$/m);
    if (lastImportMatch) {
      const lines = code.split("\n");
      let insertIdx = 0;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (/^import\s/.test(lines[i])) {
          insertIdx = i + 1;
          break;
        }
      }
      lines.splice(insertIdx, 0, stmts);
      code = lines.join("\n");
    } else {
      code = stmts + "\n" + code;
    }
  }
  return code;
}
function transformLazy(code) {
  code = code.replace(/lazyImport\s*\(/g, "React.lazy(");
  code = code.replace(LAZY_IMPORT_IMPORT_RE, "");
  return code;
}
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const eager = env.VITE_EAGER_IMPORTS === "true";
  return {
    base: "/",
    plugins: [
      {
        ...wyw({
          babelOptions: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@wyw-in-js/babel-preset"
            ]
          }
        }),
        enforce: "pre"
      },
      react(),
      lazyImportTogglePlugin(eager),
      ghPages(),
      visualizer({
        open: true
      })
    ],
    resolve: {
      alias: {
        src: "/src",
        views: "/src/views",
        core: "/src/core"
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [esbuildCommonjs(["react-moment"])]
      }
    },
    server: {
      host: true,
      port: 3001
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2RyaXB0YW1pbmUvRGVza3RvcC9saXRzZWFyY2gtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kcmlwdGFtaW5lL0Rlc2t0b3AvbGl0c2VhcmNoLWZyb250ZW5kL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHJpcHRhbWluZS9EZXNrdG9wL2xpdHNlYXJjaC1mcm9udGVuZC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgd3l3IGZyb20gJ0B3eXctaW4tanMvdml0ZSc7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuaW1wb3J0IHsgZ2hQYWdlcyB9IGZyb20gJ3ZpdGUtcGx1Z2luLWdoLXBhZ2VzJ1xuXG5cbmltcG9ydCB7IHZpdGVDb21tb25qcywgZXNidWlsZENvbW1vbmpzIH0gZnJvbSAnQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWNvbW1vbmpzJztcbmltcG9ydCBkbnMgZnJvbSAnZG5zJ1xuXG5cbmRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoJ3ZlcmJhdGltJylcblxuZnVuY3Rpb24gbGF6eUltcG9ydFRvZ2dsZVBsdWdpbihlYWdlcikge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1sYXp5LXRvZ2dsZScsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBpZiAoIS9cXC4oanN4P3x0c3g/KSQvLnRlc3QoaWQpKSByZXR1cm4gbnVsbFxuICAgICAgaWYgKCFjb2RlLmluY2x1ZGVzKCdsYXp5SW1wb3J0JykpIHJldHVybiBudWxsXG5cbiAgICAgIGlmIChlYWdlcikge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtRWFnZXIoY29kZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRyYW5zZm9ybUxhenkoY29kZSlcbiAgICB9LFxuICB9XG59XG5cbmNvbnN0IExBWllfSU1QT1JUX0lNUE9SVF9SRSA9IC9pbXBvcnRcXHMqXFx7XFxzKmxhenlJbXBvcnRcXHMqXFx9XFxzKmZyb21cXHMqJ1teJ10qJ1xccyo7P1xccypcXG4/L2dcblxuZnVuY3Rpb24gdHJhbnNmb3JtRWFnZXIoY29kZSkge1xuICBsZXQgY291bnRlciA9IDBcbiAgY29uc3QgaW5saW5lSW1wb3J0cyA9IFtdXG5cbiAgLy8gMS4gTmFtZWQgZXhwb3J0czogY29uc3QgWCA9IGxhenlJbXBvcnQoKCkgPT4gaW1wb3J0KCdwYXRoJykudGhlbihtID0+ICh7IGRlZmF1bHQ6IG0uWSB9KSkpO1xuICBjb2RlID0gY29kZS5yZXBsYWNlKFxuICAgIC9jb25zdFxccysoXFx3KylcXHMqPVxccypsYXp5SW1wb3J0XFxzKlxcKFxccypcXChcXHMqXFwpXFxzKj0+XFxzKmltcG9ydFxccypcXChcXHMqJyhbXiddKyknXFxzKlxcKVxccypcXC50aGVuXFxzKlxcKFxccyptXFxzKj0+XFxzKlxcKFxccypcXHtcXHMqZGVmYXVsdDpcXHMqbVxcLihcXHcrKVxccypcXH1cXHMqXFwpXFxzKlxcKVxccypcXClcXHMqOz9cXHMqL2csXG4gICAgKF8sIG5hbWUsIHBhdGgsIGV4cG9ydE5hbWUpID0+IGBpbXBvcnQgeyAke2V4cG9ydE5hbWV9IGFzICR7bmFtZX0gfSBmcm9tICcke3BhdGh9JztgXG4gIClcblxuICAvLyAyLiBEZWZhdWx0IGV4cG9ydHM6IGNvbnN0IFggPSBsYXp5SW1wb3J0KCgpID0+IGltcG9ydCgncGF0aCcpKTtcbiAgY29kZSA9IGNvZGUucmVwbGFjZShcbiAgICAvY29uc3RcXHMrKFxcdyspXFxzKj1cXHMqbGF6eUltcG9ydFxccypcXChcXHMqXFwoXFxzKlxcKVxccyo9PlxccyppbXBvcnRcXHMqXFwoXFxzKicoW14nXSspJ1xccypcXClcXHMqXFwpXFxzKjs/XFxzKi9nLFxuICAgIChfLCBuYW1lLCBwYXRoKSA9PiBgaW1wb3J0ICR7bmFtZX0gZnJvbSAnJHtwYXRofSc7YFxuICApXG5cbiAgLy8gMy4gSW5saW5lIHVzYWdlOiBsYXp5SW1wb3J0KCgpID0+IGltcG9ydCgncGF0aCcpKVxuICBjb2RlID0gY29kZS5yZXBsYWNlKFxuICAgIC9sYXp5SW1wb3J0XFxzKlxcKFxccypcXChcXHMqXFwpXFxzKj0+XFxzKmltcG9ydFxccypcXChcXHMqJyhbXiddKyknXFxzKlxcKVxccypcXCkvZyxcbiAgICAoXywgcGF0aCkgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGBfX0xhenlFYWdlcl8ke2NvdW50ZXIrK31gXG4gICAgICBpbmxpbmVJbXBvcnRzLnB1c2goeyBuYW1lLCBwYXRoIH0pXG4gICAgICByZXR1cm4gbmFtZVxuICAgIH1cbiAgKVxuXG4gIC8vIDQuIFJlbW92ZSBpbXBvcnQgeyBsYXp5SW1wb3J0IH0gLi4uXG4gIGNvZGUgPSBjb2RlLnJlcGxhY2UoTEFaWV9JTVBPUlRfSU1QT1JUX1JFLCAnJylcblxuICAvLyA1LiBQcmVwZW5kIGlubGluZS1nZW5lcmF0ZWQgaW1wb3J0cyBhZnRlciB0aGUgbGFzdCBpbXBvcnQgc3RhdGVtZW50XG4gIGlmIChpbmxpbmVJbXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBzdG10cyA9IGlubGluZUltcG9ydHMubWFwKCh7IG5hbWUsIHBhdGggfSkgPT4gYGltcG9ydCAke25hbWV9IGZyb20gJyR7cGF0aH0nO2ApLmpvaW4oJ1xcbicpXG5cbiAgICBjb25zdCBsYXN0SW1wb3J0TWF0Y2ggPSBjb2RlLm1hdGNoKC9eaW1wb3J0XFxzLiokL20pXG4gICAgaWYgKGxhc3RJbXBvcnRNYXRjaCkge1xuICAgICAgY29uc3QgbGluZXMgPSBjb2RlLnNwbGl0KCdcXG4nKVxuICAgICAgbGV0IGluc2VydElkeCA9IDBcbiAgICAgIGZvciAobGV0IGkgPSBsaW5lcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoL15pbXBvcnRcXHMvLnRlc3QobGluZXNbaV0pKSB7XG4gICAgICAgICAgaW5zZXJ0SWR4ID0gaSArIDFcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaW5lcy5zcGxpY2UoaW5zZXJ0SWR4LCAwLCBzdG10cylcbiAgICAgIGNvZGUgPSBsaW5lcy5qb2luKCdcXG4nKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb2RlID0gc3RtdHMgKyAnXFxuJyArIGNvZGVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29kZVxufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1MYXp5KGNvZGUpIHtcbiAgY29kZSA9IGNvZGUucmVwbGFjZSgvbGF6eUltcG9ydFxccypcXCgvZywgJ1JlYWN0LmxhenkoJylcbiAgY29kZSA9IGNvZGUucmVwbGFjZShMQVpZX0lNUE9SVF9JTVBPUlRfUkUsICcnKVxuICByZXR1cm4gY29kZVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBjb25zdCBlYWdlciA9IGVudi5WSVRFX0VBR0VSX0lNUE9SVFMgPT09ICd0cnVlJztcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnLycsXG4gICAgcGx1Z2luczogW1xuICAgICAge1xuICAgICAgICAuLi53eXcoe1xuICAgICAgICAgIGJhYmVsT3B0aW9uczoge1xuICAgICAgICAgICAgcHJlc2V0czogW1xuICAgICAgICAgICAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCIsXG4gICAgICAgICAgICAgIFwiQGJhYmVsL3ByZXNldC1yZWFjdFwiLFxuICAgICAgICAgICAgICBcIkB3eXctaW4tanMvYmFiZWwtcHJlc2V0XCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBlbmZvcmNlOiAncHJlJyxcbiAgICAgIH0sXG4gICAgICByZWFjdCgpLFxuICAgICAgbGF6eUltcG9ydFRvZ2dsZVBsdWdpbihlYWdlciksXG4gICAgICBnaFBhZ2VzKCksXG4gICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgc3JjOiBcIi9zcmNcIixcbiAgICAgICAgdmlld3M6IFwiL3NyYy92aWV3c1wiLFxuICAgICAgICBjb3JlOiBcIi9zcmMvY29yZVwiLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgICAgcGx1Z2luczogW2VzYnVpbGRDb21tb25qcyhbJ3JlYWN0LW1vbWVudCddKV0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiB0cnVlLFxuICAgICAgcG9ydDogMzAwMSxcbiAgICB9LFxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1QsU0FBUyxjQUFjLGVBQWU7QUFDOVYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGVBQWU7QUFHeEIsU0FBUyxjQUFjLHVCQUF1QjtBQUM5QyxPQUFPLFNBQVM7QUFHaEIsSUFBSSxzQkFBc0IsVUFBVTtBQUVwQyxTQUFTLHVCQUF1QixPQUFPO0FBQ3JDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxJQUNULFVBQVUsTUFBTSxJQUFJO0FBQ2xCLFVB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
