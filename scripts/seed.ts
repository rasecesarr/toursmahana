import { db } from "../server/db";
import { users, categories, tours } from "../server/db/schema";
import { CATEGORIES, ALL_TOURS } from "../client/src/lib/data";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding started...");

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    username: "admin",
    password: hashedPassword,
    isAdmin: true,
  }).onConflictDoNothing();
  console.log("Admin user created.");

  // 2. Insert Categories
  for (const cat of CATEGORIES) {
    await db.insert(categories).values({
      id: cat.id,
      name: cat.name,
      shortName: cat.shortName,
      icon: cat.icon,
      description: cat.description,
      image: cat.image,
      color: cat.color,
    }).onConflictDoNothing();
  }
  console.log("Categories seeded.");

  // 3. Insert Tours
  for (const tour of ALL_TOURS) {
    await db.insert(tours).values({
      id: tour.id,
      name: tour.name,
      category: tour.category,
      price: tour.price,
      duration: tour.duration,
      maxPax: tour.maxPax,
      description: tour.description,
      shortDescription: tour.shortDescription,
      image: tour.image,
      difficulty: tour.difficulty,
      available: tour.available,
      meetingPoint: tour.meetingPoint,
      includes: JSON.stringify(tour.includes || []),
      notIncludes: JSON.stringify(tour.notIncludes || []),
      whatToBring: JSON.stringify(tour.whatToBring || []),
    }).onConflictDoNothing();
  }
  console.log("Tours seeded.");

  console.log("Seeding completed successfully.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
