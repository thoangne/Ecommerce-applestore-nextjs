import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
// __dirname bây giờ trỏ đến 'prisma/json'
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// Đọc JSON an toàn (Đường dẫn này bây giờ là tương đối với 'prisma/json')
const readJSON = (filename: string) => {
  const filePath = path.join(__dirname, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

/**
 * LOGIC 1: SEED SẢN PHẨM (Code cũ của bạn)
 */
async function seedProducts() {
  console.log("🧹 Xóa toàn bộ dữ liệu Sản phẩm và Danh mục Sản phẩm...");
  // Xóa theo thứ tự (Sản phẩm trước, Danh mục sau)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("✅ Đã xóa toàn bộ sản phẩm và danh mục sản phẩm cũ.");

  console.log("🌱 Tạo lại các danh mục sản phẩm...");
  await prisma.category.createMany({
    data: [
      { id: "macbook", name: "MacBook", slug: "macbook" },
      { id: "ipad", name: "iPad", slug: "ipad" },
      { id: "iphone", name: "iPhone", slug: "iphone" },
    ],
  });
  console.log("✅ Đã tạo danh mục Apple (MacBook, iPad, iPhone).");

  console.log("📦 Đang đọc file apple_products.json...");
  const appleProducts = readJSON("apple_products.json");

  console.log("🌱 Seed sản phẩm Apple...");
  await prisma.product.createMany({
    data: appleProducts,
    skipDuplicates: true,
  });

  console.log("✅ Seed sản phẩm hoàn tất!");
}

/**
 * LOGIC 2: SEED DANH MỤC BLOG (Code mới)
 */
async function seedBlogCategories() {
  console.log("🌱 Bắt đầu seeding danh mục Blog...");

  const blogCategories = [
    { name: "Tin tức & Sự kiện", slug: "tin-tuc-su-kien" },
    { name: "Đánh giá sản phẩm", slug: "danh-gia-san-pham" },
    { name: "Thủ thuật & Hướng dẫn", slug: "thu-thuat-huong-dan" },
    { name: "So sánh & Tư vấn", slug: "so-sanh-tu-van" },
    { name: "Khuyến mãi", slug: "khuyen-mai" },
  ];

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    console.log(`Đã tạo/cập nhật danh mục Blog: ${cat.name}`);
  }

  console.log("✅ Seed danh mục Blog hoàn tất.");
}

/**
 * HÀM MAIN: Chạy cả hai
 */
async function main() {
  await seedProducts();
  await seedBlogCategories();
}

// --- Chạy hàm main ---
main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Đã ngắt kết nối Prisma Client.");
  });
