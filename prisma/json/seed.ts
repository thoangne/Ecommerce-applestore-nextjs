import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// Helper để đọc JSON file
const readJSON = (path: string) => {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
};

// Đọc dữ liệu
const macbookPro = readJSON("./macbook.json");
const ip = readJSON("./ip.json");
const ipad = readJSON("./ipad.json");

async function main() {
  console.log("🌱 Seeding Apple products...");

  await prisma.product.createMany({ data: macbookPro, skipDuplicates: true });
  console.log("✅ Seeded MacBook Pro");

  await prisma.product.createMany({ data: ip, skipDuplicates: true });
  console.log("✅ Seeded iPhone");

  await prisma.product.createMany({ data: ipad, skipDuplicates: true });
  console.log("✅ Seeded iPad");

  console.log("🎉 All Apple products seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
