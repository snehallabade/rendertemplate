import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outExtension: { '.js': '.mjs' },
  outdir: 'dist/server',
  sourcemap: true,
  banner: {
    js: `
      import { createRequire } from 'module';
      import { fileURLToPath } from 'url';
      import { dirname } from 'path';

      const require = createRequire(import.meta.url);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
    `
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  conditions: ['import', 'module', 'default'],
  mainFields: ['module', 'main'],
  splitting: true,
  packages: 'external',
  plugins: [{
    name: 'native-node-modules',
    setup(build) {
      // Mark node built-ins as external
      build.onResolve({ filter: /^node:/ }, args => ({
        external: true,
        path: args.path
      }));
    },
  }],
  metafile: true
});
