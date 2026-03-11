import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@docproof.io";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const superAdminHash = await bcrypt.hash(adminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: superAdminHash,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: "docproof" },
    update: {},
    create: {
      name: "DOC PROOF Inc",
      slug: "docproof",
      description: "Main organization",
      isActive: true,
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: "maintenance" },
    update: {},
    create: {
      key: "maintenance",
      value: false,
      description: "Maintenance mode enabled",
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: "default_theme" },
    update: {},
    create: {
      key: "default_theme",
      value: "dark",
      description: "Default UI theme",
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: "supported_languages" },
    update: {},
    create: {
      key: "supported_languages",
      value: ["en", "fr", "de", "zh", "ar", "es"],
      description: "Supported locales",
    },
  });

  console.log("Seed complete:", { superAdmin: superAdmin.email, org: org.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
