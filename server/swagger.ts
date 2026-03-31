import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tours Mahana API (AI-Ready Pro)",
      version: "1.0.0",
      description: "API para la administración de tours y categorías de Tours Mahana. Optimizada para agentes de IA.",
    },
    servers: [
      {
        url: "/api",
        description: "Servidor Principal",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Clave de administrador para acceso mediante agentes de IA.",
        },
      },
      schemas: {
        TourInsert: {
          type: "object",
          required: ["id", "name", "category", "price", "duration", "maxPax", "description", "shortDescription", "image", "includes", "notIncludes"],
          properties: {
            id: { type: "string", example: "kite-surf-advanced" },
            name: { type: "string" },
            category: { type: "string", description: "ID de la categoría" },
            price: { type: "number" },
            duration: { type: "string" },
            maxPax: { type: "integer" },
            description: { type: "string" },
            shortDescription: { type: "string" },
            image: { type: "string", description: "Path de la imagen /uploads/..." },
            difficulty: { type: "string" },
            available: { type: "string" },
            meetingPoint: { type: "string" },
            includes: { type: "array", items: { type: "string" } },
            notIncludes: { type: "array", items: { type: "string" } },
            whatToBring: { type: "array", items: { type: "string" } },
          },
        },
        CategoryInsert: {
          type: "object",
          required: ["id", "name", "shortName", "icon", "description", "image", "color"],
          properties: {
            id: { type: "string", example: "surf" },
            name: { type: "string" },
            shortName: { type: "string" },
            icon: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            color: { type: "string", example: "#FF5733" },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./server/routes.ts", "./server/auth.ts"], // Rutas a escanear para anotaciones JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
