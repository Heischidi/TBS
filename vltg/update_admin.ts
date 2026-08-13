import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("TBSADMIN123", 12);
  
  // Create or update the admin with the new email
  const newAdmin = await db.user.upsert({
    where: { email: "TBSMAIN@theblacksheep.com" },
    update: {
      password: hashedPassword,
      name: "TBSMAIN",
      role: "SUPER_ADMIN",
    },
    create: {
      email: "TBSMAIN@theblacksheep.com",
      password: hashedPassword,
      name: "TBSMAIN",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Updated admin user:", newAdmin.email);
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
