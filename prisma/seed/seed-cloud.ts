import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Cấu hình để đọc __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load biến môi trường từ file .env gốc (quan trọng để lấy API Key Cloudinary)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// 2. Import hàm upload bằng đường dẫn tương đối (Fix lỗi @/lib)
// Lưu ý: Đảm bảo file lib/cloudinary.ts không chứa import nào dùng alias '@/'
import { uploadToCloudinary } from "../../lib/cloudinary.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Bắt đầu Seed với Cloudinary...");

  // Dữ liệu mẫu dùng Link ảnh từ Internet
  const posts = [
    {
      title: "Review iPhone 15 Pro Max (Cloudinary)",
      slug: "review-iphone-15-pro-max-cloud",
      externalImage:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      content: "Nội dung bài viết review iPhone...",
      categoryId: "cat-iphone",
      excerpt: "Đánh giá chi tiết iPhone 15 Pro Max.",
      readTime: "5 min",
    },
    {
      title: "MacBook Pro M3 Max (Cloudinary)",
      slug: "macbook-pro-m3-max-cloud",
      externalImage:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      content: "Nội dung bài viết review MacBook...",
      categoryId: "cat-macbook",
      excerpt: "Sức mạnh kinh khủng của chip M3 Max.",
      readTime: "7 min",
    },
  ];

  for (const post of posts) {
    console.log(`⏳ Đang xử lý: ${post.title}`);
    let finalThumbnail = "";

    try {
      // Upload ảnh từ URL lên Cloudinary
      if (post.externalImage) {
        // Hàm này của bạn đã viết sẵn logic upload trong lib/cloudinary.ts
        finalThumbnail = await uploadToCloudinary(
          post.externalImage,
          "blog/thumbnails"
        );
        console.log(`   ☁️ Đã upload: ${finalThumbnail}`);
      }
    } catch (error) {
      console.error(`   ❌ Lỗi upload ảnh:`, error);
      finalThumbnail = "https://via.placeholder.com/800x400";
    }

    // Lưu vào DB
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        thumbnail: finalThumbnail,
        content: post.content,
        categoryId: post.categoryId,
        excerpt: post.excerpt,
        readTime: post.readTime,
      },
      create: {
        title: post.title,
        slug: post.slug,
        thumbnail: finalThumbnail,
        content: post.content,
        excerpt: post.excerpt,
        readTime: post.readTime,
        published: true,
        publishedAt: new Date(),
        categoryId: post.categoryId,
        // Nếu schema User bắt buộc authorId, bạn cần hardcode 1 ID admin hoặc tạo user trước
        // authorId: "user-id-cua-admin",
      },
    });
  }

  console.log("✅ Hoàn tất Seed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
