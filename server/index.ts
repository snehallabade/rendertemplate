import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerRoutes } from './routes.js';
import { setupVite, serveStatic, log } from './vite.js';
import { resolvePublicPath, resolveClientPath } from './utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Handle production mode
  if (process.env.NODE_ENV === 'production') {
    const publicPath = resolvePublicPath();
    app.use(express.static(publicPath));
    
    // Serve index.html for all routes to support client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    // Development mode with Vite
    await setupVite(app, httpServer);
  }

  // Logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(logLine);
      }
    });

    next();
  });

  // Register routes
  await registerRoutes(app);
  const port = process.env.PORT || 3000;
  console.log('Starting server...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Port:', port);
  
  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('API endpoints available at:');
    console.log(`- Health check: http://localhost:${port}/api/health`);
    console.log(`- Templates: http://localhost:${port}/api/templates`);
    console.log(`- Documents: http://localhost:${port}/api/documents`);
  });

  return httpServer;
}

// Start the server
startServer().catch(console.error);
