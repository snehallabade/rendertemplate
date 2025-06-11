import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { storage } from "./storage.js";
import templatesRouter from "./api/templates.js";
import documentsRouter from "./api/documents.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // API routes
  app.use('/api/templates', templatesRouter);
  app.use('/api/documents', documentsRouter);

  // Test database connection
  app.get('/api/test-db', async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json({ 
        status: 'database connected', 
        templateCount: templates.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'database error', 
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
