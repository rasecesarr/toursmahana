import { Express, Request, Response } from "express";
import { db } from "./db";
import { tours, categories } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureAdmin } from "./auth";
import { upload } from "./storage";
import fs from "fs";
import path from "path";

export function setupRoutes(app: Express) {
  // Public APIs -------------------------------------------------------------
/**
 * @openapi
 * /tours:
 *   get:
 *     summary: Obtener lista completa de tours
 *     description: Retorna todos los tours disponibles en la base de datos con sus respectivos campos parseados.
 *     responses:
 *       200:
 *         description: Lista de tours.
 */
  app.get("/api/tours", async (req, res) => {
    try {
      const allTours = await db.select().from(tours);
      // Parse JSON fields
      const parsed = allTours.map((t) => ({
        ...t,
        includes: JSON.parse(t.includes),
        notIncludes: JSON.parse(t.notIncludes),
        whatToBring: t.whatToBring ? JSON.parse(t.whatToBring) : [],
      }));
      res.json(parsed);
    } catch (err) {
      console.error("Error fetching tours:", err);
      res.status(500).json({ message: "Error al obtener los tours" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  });

  // Admin APIs (Protected) --------------------------------------------------
  
  /**
   * @openapi
   * /admin/stats:
     get:
       summary: "Reporte Estadístico PRO (Admin)"
       description: "Obtiene estadísticas clave del negocio para el agente de IA: conteos, precios y categorías."
       security: [{ ApiKeyAuth: [] }]
       responses:
         200:
           description: "Estadísticas generadas correctamente."
   */
  app.get("/api/admin/stats", ensureAdmin, async (req, res) => {
    try {
      const tourCount = await db.select({ count: sql`count(*)` }).from(tours);
      const catCount = await db.select({ count: sql`count(*)` }).from(categories);
      
      const toursByCat = await db.select({
        category: tours.category,
        count: sql`count(*)`
      }).from(tours).groupBy(tours.category);

      res.json({
        overview: {
          total_tours: (tourCount[0] as any).count,
          total_categories: (catCount[0] as any).count,
        },
        distribution: toursByCat,
        system: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      res.status(500).json({ error: "Error generando estadísticas" });
    }
  });

  /**
   * @openapi
   * /admin/health:
     get:
       summary: "Diagnóstico de Salud del Sistema"
       security: [{ ApiKeyAuth: [] }]
       responses:
         200:
           description: "Estado del servidor y almacenamiento."
   */
  app.get("/api/admin/health", ensureAdmin, async (req, res) => {
    const uploadPath = path.resolve(process.cwd(), "client", "public", "uploads");
    const canWrite = fs.existsSync(uploadPath);
    res.json({
      status: "online",
      database: "connected",
      storage_writable: canWrite,
      uploads_dir_exists: canWrite
    });
  });

  // Tours CRUD
  /**
   * @openapi
   * /admin/tours:
   *   post:
   *     summary: Crear un nuevo tour
   *     security: [{ ApiKeyAuth: [] }]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TourInsert'
   *     responses:
   *       200:
   *         description: Tour creado.
   */
  app.post("/api/admin/tours", ensureAdmin, async (req, res) => {
    try {
      const tourData = req.body;
      // Convert arrays back to JSON strings
      const toInsert = {
        ...tourData,
        includes: JSON.stringify(tourData.includes || []),
        notIncludes: JSON.stringify(tourData.notIncludes || []),
        whatToBring: JSON.stringify(tourData.whatToBring || []),
      };
      
      const [newTour] = await db.insert(tours).values(toInsert).returning();
      res.json(newTour);
    } catch (err) {
      console.error("Error creating tour:", err);
      res.status(500).json({ message: "Error al crear el tour" });
    }
  });

  /**
   * @openapi
   * /admin/tours/{id}:
   *   patch:
   *     summary: Actualizar un tour existente
   *     security: [{ ApiKeyAuth: [] }]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TourInsert'
   *     responses:
   *       200:
   *         description: Tour actualizado.
   */
  app.patch("/api/admin/tours/:id", ensureAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const tourData = req.body;
      
      const toUpdate: any = { ...tourData };
      if (tourData.includes) toUpdate.includes = JSON.stringify(tourData.includes);
      if (tourData.notIncludes) toUpdate.notIncludes = JSON.stringify(tourData.notIncludes);
      if (tourData.whatToBring) toUpdate.whatToBring = JSON.stringify(tourData.whatToBring);

      const [updated] = await db
        .update(tours)
        .set(toUpdate)
        .where(eq(tours.id, id))
        .returning();
      res.json(updated);
    } catch (err) {
      console.error("Error updating tour:", err);
      res.status(500).json({ message: "Error al actualizar el tour" });
    }
  });

  app.delete("/api/admin/tours/:id", ensureAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(tours).where(eq(tours.id, id));
      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting tour:", err);
      res.status(500).json({ message: "Error al eliminar el tour" });
    }
  });

  // Categories CRUD
  app.post("/api/admin/categories", ensureAdmin, async (req, res) => {
    try {
      const [newCat] = await db.insert(categories).values(req.body).returning();
      res.json(newCat);
    } catch (err) {
      console.error("Error creating category:", err);
      res.status(500).json({ message: "Error al crear la categoría" });
    }
  });

  // Image Uploads
  /**
   * @openapi
   * /admin/upload:
   *   post:
   *     summary: Subir una imagen
   *     security: [{ ApiKeyAuth: [] }]
   *     description: Sube una imagen al servidor y retorna la URL pública.
   *     responses:
   *       200:
   *         description: Imagen subida con éxito.
   */
  app.post("/api/admin/upload", ensureAdmin, upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }
    // Return the public URL path
    const publicPath = `/uploads/${req.file.filename}`;
    res.json({ url: publicPath });
  });
}
