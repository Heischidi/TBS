import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Seeding TBS database...");

  // ── Admin User ──────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("tbs@admin2025", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@theblacksheep.com" },
    update: {},
    create: {
      email: "admin@theblacksheep.com",
      password: hashedPassword,
      name: "TBS Admin",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ── Categories ──────────────────────────────────────────────────
  const categories = [
    { name: "T-Shirts",     slug: "t-shirts",     description: "Graphic tees, oversized fits, and statement pieces" },
    { name: "Hoodies",      slug: "hoodies",       description: "Premium heavyweight hoodies and sweatshirts" },
    { name: "Shorts",       slug: "shorts",        description: "Cargo shorts, jogger shorts, and streetwear cuts" },
    { name: "Trousers",     slug: "trousers",      description: "Joggers, cargos, and structured pants" },
    { name: "Jackets",      slug: "jackets",       description: "Bombers, coaches, and outerwear" },
    { name: "Accessories",  slug: "accessories",   description: "Caps, bags, socks, and more" },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log("✅ Category:", cat.name);
  }

  // ── Collections ─────────────────────────────────────────────────
  const collections = [
    { name: "SS25 Drop",       slug: "ss25-drop",       description: "Spring/Summer 2025 debut collection", isActive: true },
    { name: "Core Essentials", slug: "core-essentials", description: "Timeless wardrobe staples",           isActive: true },
    { name: "Limited Edition", slug: "limited-edition", description: "Exclusive drops — never restocked",   isActive: true },
    { name: "The Lookbook",    slug: "the-lookbook",    description: "Editorial capsule pieces",            isActive: true },
  ];

  for (const col of collections) {
    await db.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col,
    });
    console.log("✅ Collection:", col.name);
  }

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────");
  console.log("Admin login details:");
  console.log("  Email:    admin@theblacksheep.com");
  console.log("  Password: tbs@admin2025");
  console.log("  URL:      http://localhost:3000/admin/login");
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); await pool.end(); });

