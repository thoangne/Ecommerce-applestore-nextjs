import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedBlogCategories() {
  try {
    console.log("Seeding Blog Categories...");

    const categories = [
      {
        id: "cat-iphone",
        name: "iPhone",
        slug: "iphone",
      },
      {
        id: "cat-ipad",
        name: "iPad",
        slug: "ipad",
      },
      {
        id: "cat-macbook",
        name: "MacBook",
        slug: "macbook",
      },
      {
        id: "cat-apple-watch",
        name: "Apple Watch",
        slug: "apple-watch",
      },
      {
        id: "cat-airpods",
        name: "AirPods & Âm thanh",
        slug: "airpods",
      },
      {
        id: "cat-accessories",
        name: "Phụ kiện",
        slug: "phu-kien",
      },
      {
        id: "cat-review",
        name: "Đánh giá sản phẩm",
        slug: "review",
      },
      {
        id: "cat-news",
        name: "Tin tức Apple",
        slug: "tin-tuc-apple",
      },
    ];

    for (const cate of categories) {
      await prisma.blogCategory.upsert({
        where: { id: cate.id },
        update: {},
        create: cate,
      });
    }

    console.log("Blog Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding Blog Categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBlogCategories();
