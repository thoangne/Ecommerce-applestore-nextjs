import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// Đọc JSON an toàn
const readJSON = (filename: string) => {
  const filePath = path.join(__dirname, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

async function main() {
  console.log("🧹 Xóa toàn bộ dữ liệu cũ...");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("✅ Đã xóa toàn bộ sản phẩm và danh mục cũ.");

  console.log("🌱 Tạo lại các danh mục...");
  await prisma.category.createMany({
    data: [
      { id: "macbook", name: "MacBook", slug: "macbook" },
      { id: "ipad", name: "iPad", slug: "ipad" },
      { id: "iphone", name: "iPhone", slug: "iphone" },
    ],
  });
  console.log("✅ Đã tạo danh mục Apple (MacBook, iPad, iPhone).");

  console.log("📦 Đang đọc file JSON...");
  const appleProducts = readJSON("apple_products.json");

  console.log("🌱 Seed sản phẩm Apple...");
  await prisma.product.createMany({
    data: appleProducts,
    skipDuplicates: true,
  });

  console.log("🎉 Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
