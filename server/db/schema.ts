import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(), // e.g. 'surf-kite'
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  color: text("color").notNull(),
});

export const tours = sqliteTable("tours", {
  id: text("id").primaryKey(), // e.g. 'surf-101'
  name: text("name").notNull(),
  category: text("category_id").notNull().references(() => categories.id),
  price: real("price").notNull(),
  duration: text("duration").notNull(),
  maxPax: integer("max_pax").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  image: text("image").notNull(),
  difficulty: text("difficulty"),
  available: text("available").notNull().default("Todo el año"),
  meetingPoint: text("meeting_point"),
  // Drizzle doesn't have a native JSON type for SQLite, we'll store as text and parse
  includes: text("includes").notNull(), // JSON array
  notIncludes: text("not_includes").notNull(), // JSON array
  whatToBring: text("what_to_bring"), // JSON array
  quote: text("quote"), // Cita inspiradora por tour
  gallery: text("gallery"), // JSON array de 6 URLs de imágenes de detalle
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const insertTourSchema = createInsertSchema(tours);
export const selectTourSchema = createSelectSchema(tours);

export type Tour = z.infer<typeof selectTourSchema>;
export type Category = z.infer<typeof selectCategorySchema>;
export type User = z.infer<typeof selectUserSchema>;
