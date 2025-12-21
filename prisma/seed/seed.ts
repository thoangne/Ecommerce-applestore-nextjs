import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//
// ✅ Helper: Xóa DB an toàn (ĐÃ SỬA)
//
async function clearDB() {
  console.log("🧹 Clearing data...");

  // ⚠️ QUAN TRỌNG: Tôi đã comment dòng này lại để KHÔNG xóa sản phẩm bạn vừa tạo
  // await prisma.product.deleteMany();

  // Lưu ý: Nếu bạn xóa Category thì Product sẽ bị lỗi khóa ngoại (Foreign Key).
  // Nên tốt nhất ở giai đoạn này ta chỉ seed thêm những thứ còn thiếu (BlogCategory).

  // await prisma.category.deleteMany(); // Tạm tắt để không mất danh mục cũ

  await prisma.blogCategory.deleteMany(); // ✅ Có thể xóa và tạo lại danh mục Blog
}

//
// ✅ Seed Blog Categories (Cái này bạn đang thiếu)
//
async function seedBlogCategories() {
  console.log("🌱 Seeding Blog Categories...");

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
    console.log(`✅ Blog category: ${cat.name}`);
  }

  console.log("✅ Seed Blog Categories completed");
}

//
// ✅ Seed Product Categories Hierarchy (Cấu trúc phân cấp)
//
async function seedCategoryHierarchy() {
  console.log("🌱 Seeding Category Hierarchy (Mac, iPad, iPhone)...");

  const categories = [
    {
      name: "Mac",
      slug: "mac",
      sub: ["MacBook Air", "MacBook Pro"],
    },
    {
      name: "iPad",
      slug: "ipad", // Lưu ý: Slug này có thể trùng với file trước, upsert sẽ xử lý
      sub: ["iPad Gen", "iPad Air", "iPad Pro"],
    },
    {
      name: "iPhone",
      slug: "iphone",
      sub: ["iPhone", "iPhone Pro", "iPhone Pro Max"],
    },
  ];

  for (const cat of categories) {
    // 1. Tạo hoặc update danh mục Cha
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });

    // 2. Tạo danh mục Con và nối vào Cha
    for (const sub of cat.sub) {
      const subSlug = `${cat.slug}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

      await prisma.category.upsert({
        where: { slug: subSlug },
        update: {
          name: sub,
          parentId: parent.id, // Cập nhật mối quan hệ cha-con
        },
        create: {
          name: sub,
          slug: subSlug,
          parentId: parent.id,
        },
      });
    }
  }
  console.log("✅ Category Hierarchy seeded!");
}

//
// ✅ Main
//
async function main() {
  // 1. Dọn dẹp (Nhưng không xóa Product)
  await clearDB();

  // 2. Tạo danh mục phân cấp (Cha - Con)
  await seedCategoryHierarchy();

  // 3. Tạo danh mục Blog
  await seedBlogCategories();

  console.log("🎉 All additional seeding completed!");
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
