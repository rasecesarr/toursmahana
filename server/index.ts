import express from "express";
import { createServer } from "http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { setupAuth, ensureAdmin } from "./auth";
import { setupRoutes } from "./routes";
import { setupStorage } from "./storage";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  console.log("--- Server Start Sequence ---");
  
  // Setup specialized components
  console.log("[1/4] Setting up Authentication...");
  setupAuth(app);
  
  console.log("[2/4] Setting up API Routes...");
  setupRoutes(app);
  
  console.log("[3/4] Setting up Storage...");
  setupStorage(app);
  
  // Swagger - Pro API Docs (Protected by API Key)
  app.use("/api-docs", ensureAdmin, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const server = createServer(app);

  // Serve static files from dist/public in production
  // and from client/public in development
  // Use the built assets from dist/public in production,
  // or client/public in development
  const isProd = process.env.NODE_ENV === "production";
  const publicPath = isProd 
    ? path.resolve(__dirname, "public") // En dist el public está junto a index.js
    : path.resolve(__dirname, "..", "client", "public");

  app.use(express.static(publicPath));

  // Serve the uploads directory specifically
  const uploadsPath = isProd
    ? path.resolve(process.cwd(), "data", "uploads") // En producción usamos el volumen
    : path.resolve(__dirname, "..", "client", "public", "uploads");

  app.use("/uploads", express.static(uploadsPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(publicPath, "index.html");
    if (!fs.existsSync(indexPath)) {
      return res.status(404).send("Not found");
    }
    res.sendFile(indexPath);
  });

  // Global Error Handler for API routes
  app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
    console.error("[ERROR]", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const port = process.env.PORT || 5001;
  const host = "0.0.0.0"; // Importante para Railway/Docker

  server.listen(Number(port), host, () => {
    console.log(`[4/4] SUCCESS: Backend Server running on http://${host}:${port}/`);
    console.log(`[PRO] Swagger Docs available at http://${host}:${port}/api-docs`);
    console.log("------------------------------");
  });
}

startServer().catch(console.error);
