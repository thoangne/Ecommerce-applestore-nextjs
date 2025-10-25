import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Apple Store categories...");

  // --- CẤU TRÚC DANH MỤC APPLE ---
  const categories = [
    {
      name: "Mac",
      slug: "mac",
      subcategories: [
        "MacBook Air",
        "MacBook Pro",
        "iMac",
        "Mac mini",
        "Mac Studio",
        "Mac Pro",
        "Displays",
      ],
    },
    {
      name: "iPad",
      slug: "ipad",
      subcategories: ["iPad (10th Gen)", "iPad mini", "iPad Air", "iPad Pro"],
    },
    {
      name: "iPhone",
      slug: "iphone",
      subcategories: [
        "iPhone 15",
        "iPhone 16",
        "iPhone 17",
        "iPhone 14",
        "iPhone 13",
        "iPhone 12",
        "iPhone 11",
      ],
    },
    {
      name: "Apple Watch",
      slug: "apple-watch",
      subcategories: ["Series ", "Ultra ", "SE"],
    },
    {
      name: "AirPods",
      slug: "airpods",
      subcategories: [
        "AirPods 1",
        "AirPods 2",
        "AirPods 3",
        "AirPods Pro",
        "AirPods Max",
      ],
    },
  ];

  // --- TẠO CATEGORY CHA + SUBCATEGORY ---
  for (const cat of categories) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
      },
    });

    for (const sub of cat.subcategories) {
      await prisma.category.create({
        data: {
          name: sub,
          slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          parentId: parent.id,
        },
      });
    }
  }

  console.log("✅ Seeded Apple categories successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
//category.ts
