import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc';
import wyw from '@wyw-in-js/vite';
import { readFileSync } from 'node:fs';
// import { visualizer } from 'rollup-plugin-visualizer'

// maplibre-gl builds its worker URL dynamically
// (`new URL('./maplibre-gl-worker.mjs', import.meta.url)`), which bundlers
// cannot statically detect, so the worker asset is never emitted. Without it
// the map silently fails to request ANY tiles in the production build. Emit
// the worker AND its imported module (`maplibre-gl-shared.mjs`) next to the
// bundled chunks so the relative URLs resolve.
function emitMaplibreWorker() {
  return {
    name: 'emit-maplibre-worker',
    apply: 'build',
    generateBundle() {
      for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
        const source = readFileSync(
          new URL(`./node_modules/maplibre-gl/dist/${file}`, import.meta.url),
          'utf8',
        );
        this.emitFile({
          type: 'asset',
          fileName: `assets/${file}`,
          source,
        });
      }
    },
  }
}

function lazyImportTogglePlugin(eager) {
  return {
    name: 'vite-plugin-lazy-toggle',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/')) return null
      if (!/\.(jsx?|tsx?)$/.test(id)) return null
      if (!code.includes('lazyImport')) return null

      if (eager) {
        return transformEager(code)
      }

      return transformLazy(code)
    },
  }
}

const LAZY_IMPORT_IMPORT_RE = /import\s*\{\s*lazyImport\s*\}\s*from\s*'[^']*'\s*;?\s*\n?/g

function transformEager(code) {
  let counter = 0
  const inlineImports = []

  // 1. Named exports: const X = lazyImport(() => import('path').then(m => ({ default: m.Y })));
  code = code.replace(
    /const\s+(\w+)\s*=\s*lazyImport\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*'([^']+)'\s*\)\s*\.then\s*\(\s*m\s*=>\s*\(\s*\{\s*default:\s*m\.(\w+)\s*\}\s*\)\s*\)\s*\)\s*;?\s*/g,
    (_, name, path, exportName) => `import { ${exportName} as ${name} } from '${path}';`
  )

  // 2. Default exports: const X = lazyImport(() => import('path'));
  code = code.replace(
    /const\s+(\w+)\s*=\s*lazyImport\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*'([^']+)'\s*\)\s*\)\s*;?\s*/g,
    (_, name, path) => `import ${name} from '${path}';`
  )

  // 3. Inline usage: lazyImport(() => import('path'))
  code = code.replace(
    /lazyImport\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*'([^']+)'\s*\)\s*\)/g,
    (_, path) => {
      const name = `__LazyEager_${counter++}`
      inlineImports.push({ name, path })
      return name
    }
  )

  // 4. Remove import { lazyImport } ...
  code = code.replace(LAZY_IMPORT_IMPORT_RE, '')

  // 5. Prepend inline-generated imports after the last import statement
  if (inlineImports.length > 0) {
    const stmts = inlineImports.map(({ name, path }) => `import ${name} from '${path}';`).join('\n')

    const lastImportMatch = code.match(/^import\s.*$/m)
    if (lastImportMatch) {
      const lines = code.split('\n')
      let insertIdx = 0
      for (let i = lines.length - 1; i >= 0; i--) {
        if (/^import\s/.test(lines[i])) {
          insertIdx = i + 1
          break
        }
      }
      lines.splice(insertIdx, 0, stmts)
      code = lines.join('\n')
    } else {
      code = stmts + '\n' + code
    }
  }

  return code
}

function transformLazy(code) {
  code = code.replace(/lazyImport\s*\(/g, 'React.lazy(')
  code = code.replace(LAZY_IMPORT_IMPORT_RE, '')
  return code
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const eager = env.VITE_EAGER_IMPORTS === 'true';
  return {
    base: '/',
    build: {
      cssMinify: 'esbuild',
    },
    plugins: [
      wyw({
        include: /src\/.*\.(jsx?|tsx?)$/,
      }),
      react(),
      lazyImportTogglePlugin(eager),
      emitMaplibreWorker(),
      // visualizer({ open: true }),
    ],
    resolve: {
      alias: {
        src: "/src",
        views: "/src/views",
        core: "/src/core",
      },
    },
    envPrefix: ['VITE_', 'TMDB_'],
    server: {
      host: true,
      port: 3001,
    },
  }
});
