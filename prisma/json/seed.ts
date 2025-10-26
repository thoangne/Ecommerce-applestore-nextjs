import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 👉 Tạo lại __dirname tương thích với ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Hàm đọc JSON an toàn
const readJSON = (filename: string) => {
  const filePath = path.join(__dirname, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Đọc dữ liệu JSON
const macbookPro = readJSON("macbook.json");
const ip = readJSON("ip.json");
const ipad = readJSON("ipad.json");

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
