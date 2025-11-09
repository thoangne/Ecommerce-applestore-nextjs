import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

//
// ✅ Helpers
//
function readJSON(filename: string) {
  const filePath = path.join(__dirname, filename);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

//
// ✅ Generate subcategory slug for DB
//
function detectSubSlug(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("macbook")) {
    if (lower.includes("air")) return "mac-macbook-air";
    return "mac-macbook-pro";
  }

  if (lower.includes("ipad")) {
    if (lower.includes("pro")) return "ipad-ipad-pro";
    if (lower.includes("air")) return "ipad-ipad-air";
    return "ipad-ipad";
  }

  if (lower.includes("iphone")) {
    if (lower.includes("pro max")) return "iphone-iphone-pro-max";
    if (lower.includes("pro")) return "iphone-iphone-pro";
    return "iphone-iphone";
  }

  return "misc";
}

//
// ✅ Auto-fix duplicated slug → add -1, -2 …
//
async function getUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;

  while (true) {
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

//
// ✅ Clear DB safely
//
async function clearDB() {
  console.log("🧹 Clearing old data...");

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
}

//
// ✅ Main
//
async function main() {
  await clearDB();

  console.log("🌱 Seeding categories...");

  const categories = [
    {
      name: "Mac",
      slug: "mac",
      sub: ["MacBook Air", "MacBook Pro"],
    },
    {
      name: "iPad",
      slug: "ipad",
      sub: ["iPad", "iPad Air", "iPad Pro"],
    },
    {
      name: "iPhone",
      slug: "iphone",
      sub: ["iPhone", "iPhone Pro", "iPhone Pro Max"],
    },
  ];

  const subMap: Record<string, string> = {};

  for (const cat of categories) {
    const parent = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug },
    });

    for (const sub of cat.sub) {
      const subSlug = `${cat.slug}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

      const subCat = await prisma.category.create({
        data: {
          name: sub,
          slug: subSlug,
          parentId: parent.id,
        },
      });

      subMap[subSlug] = subCat.id;
    }
  }

  console.log("✅ Category seeded!");

  console.log("📦 Reading products...");
  const products = readJSON("apple_products.json");

  console.log("🌱 Seeding products...");

  for (const p of products) {
    const subSlug = detectSubSlug(p.name);

    const category = await prisma.category.findUnique({
      where: { slug: subSlug },
    });

    if (!category) {
      console.warn(`⚠️ No subcategory found → skip: ${p.name}`);
      continue;
    }

    const fixedSlug = await getUniqueSlug(p.slug);

    await prisma.product.create({
      data: {
        name: p.name,
        slug: fixedSlug,
        description: p.description,
        price: Math.floor(p.price),
        color: p.color,
        storage: p.storage,
        specs: p.specs,
        releasedAt: new Date(p.releasedAt),
        images: p.images,
        inventory: p.inventory,
        categoryId: category.id,
      },
    });
  }

  console.log("✅ Products seeded!");
  console.log("🎉 Seeding completed!");
}

//
// ✅ Initialize
//
main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
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

