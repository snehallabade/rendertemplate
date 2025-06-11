import express from "express";
import type { Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import type { Server } from "node:http";
import { fileURLToPath } from 'node:url';
import fs from "node:fs";
import path from "node:path";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";
import { resolveClientPath, resolvePublicPath } from './utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost', '127.0.0.1', '.render.com'],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
    optimizeDeps: {
      disabled: true
    },
    build: {
      ...viteConfig.build,
      commonjsOptions: {
        transformMixedEsModules: true,
        esmExternals: true
      },
      rollupOptions: {
        output: {
          format: 'es',
          generatedCode: {
            constBindings: true
          }
        }
      }
    }
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export async function serveStatic(app: Express): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    const publicPath = resolvePublicPath();
    console.log('Serving static files from:', publicPath);
    
    // Serve static files with proper MIME types
    app.use(express.static(publicPath, {
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
          res.set('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
          res.set('Content-Type', 'text/css');
        }
      }
    }));

    // Serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }

      const indexPath = resolvePublicPath('index.html');
      console.log('Serving index.html from:', indexPath);

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).json({ error: 'Failed to serve application' });
        }
      });
    });
  }
}
