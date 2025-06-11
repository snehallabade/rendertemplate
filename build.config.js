import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outdir: 'dist/server',
  sourcemap: true,
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
  external: [
    // Node.js built-ins
    'node:*',
    'fs/*',
    'path/*',
    'url/*',
    // Dependencies
    'express',
    'dotenv',
    '@supabase/supabase-js',
    'drizzle-orm',
    'lightningcss',
    '@babel/*',
    'class-variance-authority',
    'clsx',
    'cmdk',
    'connect-pg-simple',
    'docx',
    'exceljs',
    'express-session',
    'framer-motion',
    'input-otp',
    'jsonwebtoken',
    'jspdf',
    'memorystore',
    'multer',
    'passport',
    'passport-local',
    'postgres',
    'react',
    'react-dom',
    'recharts',
    'ws',
    'zod'
  ],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
