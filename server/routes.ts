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
        gallery: t.gallery ? JSON.parse(t.gallery) : ["", "", "", "", "", ""],
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
   *   get:
   *     summary: "Reporte Estadístico PRO (Admin)"
   *     description: "Obtiene estadísticas clave del negocio para el agente de IA: conteos, precios y categorías."
   *     security: [{ ApiKeyAuth: [] }]
   *     responses:
   *       200:
   *         description: "Estadísticas generadas correctamente."
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
   *   get:
   *     summary: "Diagnóstico de Salud del Sistema"
   *     security: [{ ApiKeyAuth: [] }]
   *     responses:
   *       200:
   *         description: "Estado del servidor y almacenamiento."
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
      
      // 1. Verificar si la categoría existe para evitar el error de Foreign Key
      const [catExists] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, tourData.category));

      if (!catExists) {
        return res.status(400).json({ 
          message: `La categoría '${tourData.category}' no existe en la base de datos.`,
          details: "Por favor, selecciona una categoría válida o asegúrate de que el sistema esté inicializado."
        });
      }

      const toInsert = {
        id: tourData.id,
        name: tourData.name || "",
        category: tourData.category,
        price: tourData.price || 0,
        duration: tourData.duration || "4 horas",
        maxPax: tourData.maxPax || 1,
        description: tourData.description || "",
        shortDescription: tourData.shortDescription || "",
        image: tourData.image || "/images/placeholder.png",
        difficulty: tourData.difficulty || "Fácil",
        available: tourData.available || "Todo el año",
        meetingPoint: tourData.meetingPoint || "",
        includes: JSON.stringify(tourData.includes || []),
        notIncludes: JSON.stringify(tourData.notIncludes || []),
        whatToBring: JSON.stringify(tourData.whatToBring || []),
        quote: tourData.quote || "",
        gallery: JSON.stringify(tourData.gallery || []),
      };
      
      const results = await db.insert(tours).values(toInsert).returning();
      
      if (!results || results.length === 0) {
        throw new Error("No se devolvió ningún registro después del insert.");
      }
      
      res.json(results[0]);
    } catch (err: any) {
      console.error("[CRITICAL] Error en POST /api/admin/tours:", err);
      res.status(500).json({ 
        message: "Error al crear el tour",
        details: err?.message || "Internal Error"
      });
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
      
      const toUpdate: any = {};
      
      // Validar categoría
      if (tourData.category !== undefined) {
        const [catExists] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, tourData.category));

        if (!catExists) {
          return res.status(400).json({ 
            message: `La categoría '${tourData.category}' no es válida.`,
            details: "Asegúrate de seleccionar una categoría de la lista."
          });
        }
        toUpdate.category = tourData.category;
      }
      if (tourData.price !== undefined) toUpdate.price = tourData.price;
      if (tourData.duration !== undefined) toUpdate.duration = tourData.duration;
      if (tourData.maxPax !== undefined) toUpdate.maxPax = tourData.maxPax;
      if (tourData.description !== undefined) toUpdate.description = tourData.description;
      if (tourData.shortDescription !== undefined) toUpdate.shortDescription = tourData.shortDescription;
      if (tourData.image !== undefined) toUpdate.image = tourData.image;
      if (tourData.difficulty !== undefined) toUpdate.difficulty = tourData.difficulty;
      if (tourData.available !== undefined) toUpdate.available = tourData.available;
      if (tourData.meetingPoint !== undefined) toUpdate.meetingPoint = tourData.meetingPoint;
      
      if (tourData.includes) toUpdate.includes = JSON.stringify(tourData.includes);
      if (tourData.notIncludes) toUpdate.notIncludes = JSON.stringify(tourData.notIncludes);
      if (tourData.whatToBring) toUpdate.whatToBring = JSON.stringify(tourData.whatToBring);

      if (tourData.quote !== undefined) toUpdate.quote = tourData.quote;
      if (tourData.gallery !== undefined) toUpdate.gallery = JSON.stringify(tourData.gallery);

      const results = await db
        .update(tours)
        .set(toUpdate)
        .where(eq(tours.id, id))
        .returning();

      if (!results || results.length === 0) {
        throw new Error(`No se encontró el tour con ID: ${id} para actualizar.`);
      }

      res.json(results[0]);
    } catch (err: any) {
      console.error(`[CRITICAL] Error en PATCH /api/admin/tours/${req.params.id}:`, err);
      res.status(500).json({ 
        message: "Error al actualizar el tour",
        details: err?.message || "Internal Error"
      });
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
