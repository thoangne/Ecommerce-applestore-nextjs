import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- CẤU HÌNH ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const prisma = new PrismaClient();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Hàm upload ảnh
async function uploadToCloudinary(url: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: folder,
      overwrite: true,
      resource_type: "image",
      timeout: 60000,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Lỗi upload ảnh: ${url}`);
    return "https://via.placeholder.com/800x400?text=Image+Error";
  }
}

async function main() {
  console.log("🧹 Đang dọn dẹp dữ liệu Blog cũ...");

  try {
    await prisma.blogLike.deleteMany({});
    await prisma.blogComment.deleteMany({});
  } catch (e) {
    /* Bỏ qua */
  }

  await prisma.blogPost.deleteMany({});

  // Xóa luôn danh mục Blog cũ để tạo lại cho đồng bộ
  try {
    await prisma.blogCategory.deleteMany({});
  } catch (e) {}

  console.log("✅ Đã xóa sạch Blog cũ!");

  // --- BƯỚC SỬA LỖI: TẠO DANH MỤC TRONG BẢNG BLOG CATEGORY ---
  // Thay vì dùng prisma.category (Sản phẩm), ta dùng prisma.blogCategory (Bài viết)

  console.log("🌱 Đang tạo danh mục cho Blog...");

  const macCat = await prisma.blogCategory.create({
    data: { name: "Tin tức MacBook", slug: "tin-tuc-macbook" },
  });

  const iphoneCat = await prisma.blogCategory.create({
    data: { name: "Tin tức iPhone", slug: "tin-tuc-iphone" },
  });

  const ipadCat = await prisma.blogCategory.create({
    data: { name: "Tin tức iPad", slug: "tin-tuc-ipad" },
  });

  console.log(
    `🔍 Đã tạo BlogCategory: Mac(${macCat.id}), iPhone(${iphoneCat.id}), iPad(${ipadCat.id})`
  );

  // 2. Danh sách bài viết (Sử dụng ID từ BlogCategory)
  const posts = [
    // --- MACBOOK ---
    {
      title: "Review MacBook Pro M3 Max - Quái Vật Hiệu Năng",
      slug: "review-macbook-pro-m3-max",
      categoryId: macCat.id, // ✅ ID chuẩn bảng BlogCategory
      imgUrl:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80",
      excerpt:
        "Đánh giá chi tiết sức mạnh của chip M3 Max trên dòng MacBook Pro mới.",
      readTime: "7 min",
      content:
        "## Sức mạnh M3 Max\n\nApple đã thực sự tạo ra một con quái vật...",
    },
    {
      title: "MacBook Air 15 inch - Mỏng nhẹ nhưng màn hình lớn",
      slug: "danh-gia-macbook-air-15-inch",
      categoryId: macCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80",
      excerpt:
        "Lựa chọn hoàn hảo cho dân văn phòng cần không gian làm việc rộng rãi.",
      readTime: "5 min",
      content: "## Thiết kế\n\nVẫn giữ nguyên độ mỏng ấn tượng...",
    },
    {
      title: "Cách vệ sinh màn hình MacBook đúng chuẩn Apple",
      slug: "cach-ve-sinh-man-hinh-macbook",
      categoryId: macCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1000&q=80",
      excerpt:
        "Đừng dùng cồn hay nước lau kính! Hướng dẫn vệ sinh để không làm bong lớp chống lóa.",
      readTime: "3 min",
      content: "## Dụng cụ cần thiết\n\nChỉ cần khăn microfiber và nước...",
    },
    {
      title: "Top 5 Ứng dụng không thể thiếu cho macOS",
      slug: "top-ung-dung-macos-2025",
      categoryId: macCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&q=80",
      excerpt:
        "Nâng cao hiệu suất làm việc với Raycast, Magnet, và CleanMyMac.",
      readTime: "6 min",
      content: "## 1. Raycast\n\nThay thế Spotlight hoàn hảo...",
    },
    {
      title: "MacBook nóng máy? Nguyên nhân và cách khắc phục",
      slug: "khac-phuc-macbook-nong",
      categoryId: macCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1531297461136-82lw8fca3a7c?w=1000&q=80",
      excerpt: "Tại sao quạt MacBook kêu to? Chrome có phải là thủ phạm?",
      readTime: "4 min",
      content:
        "## Kiểm tra Activity Monitor\n\nXem ứng dụng nào đang ngốn CPU...",
    },

    // --- IPHONE ---
    {
      title: "iPhone 15 Pro Max - Titan sang trọng",
      slug: "iphone-15-pro-max-titan",
      categoryId: iphoneCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&q=80",
      excerpt:
        "Trải nghiệm thực tế khung viền Titan và nút Action Button mới sau 3 tháng sử dụng.",
      readTime: "6 min",
      content: "## Vật liệu mới\n\nTitan giúp máy nhẹ hơn đáng kể...",
    },
    {
      title: "5 Mẹo chụp ảnh đêm cực đẹp trên iPhone",
      slug: "meo-chup-anh-dem-iphone",
      categoryId: iphoneCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1000&q=80",
      excerpt:
        "Tận dụng Night Mode và ProRAW để có những bức ảnh thiếu sáng để đời.",
      readTime: "4 min",
      content: "## Giữ chắc tay\n\nThời gian phơi sáng quan trọng...",
    },
    {
      title: "Bí kíp bảo vệ Pin iPhone luôn ở mức 100%",
      slug: "bi-kip-bao-ve-pin-iphone",
      categoryId: iphoneCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1603539278913-909795cf6550?w=1000&q=80",
      excerpt:
        "Có nên sạc qua đêm? Dùng sạc nhanh có hại pin không? Giải đáp tất cả.",
      readTime: "5 min",
      content: "## Quy tắc 20-80\n\nĐừng để pin xuống dưới 20%...",
    },
    {
      title: "So sánh iPhone 15 và iPhone 14 Pro: Kẻ tám lạng người nửa cân",
      slug: "so-sanh-iphone-15-vs-14-pro",
      categoryId: iphoneCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1678911820864-e2c567c6fb67?w=1000&q=80",
      excerpt:
        "Nên mua máy mới thường hay máy Pro đời cũ? Câu hỏi đau đầu của nhiều người.",
      readTime: "6 min",
      content: "## Màn hình\n\n120Hz trên dòng Pro là sự khác biệt lớn...",
    },
    {
      title: "Những tính năng ẩn trên iOS 18 bạn chưa biết",
      slug: "tinh-nang-an-ios-18",
      categoryId: iphoneCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1000&q=80",
      excerpt:
        "Khám phá những tiện ích thú vị mà Apple không công bố trong sự kiện ra mắt.",
      readTime: "4 min",
      content: "## StandBy Mode nâng cao\n\nTùy biến widget...",
    },
    {
      title: "iPhone bị vô nước? Xử lý ngay kẻo hối hận",
      slug: "xu-ly-iphone-vo-nuoc",
      categoryId: iphoneCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1519923834699-ef0b7cde4712?w=1000&q=80",
      excerpt:
        "Đừng bỏ vào thùng gạo! Đây là cách sơ cứu iPhone đúng chuẩn kỹ thuật.",
      readTime: "3 min",
      content: "## Tắt nguồn ngay lập tức\n\nKhông cố gắng sạc pin...",
    },

    // --- IPAD ---
    {
      title: "iPad Pro M4 - Màn hình OLED đỉnh cao",
      slug: "ipad-pro-m4-oled-review",
      categoryId: ipadCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80",
      excerpt:
        "Lần đầu tiên iPad được trang bị màn hình OLED hai lớp. Trải nghiệm thị giác tuyệt vời.",
      readTime: "5 min",
      content: "## Màn hình Tandem OLED\n\nĐộ sáng và tương phản tuyệt đối...",
    },
    {
      title: "Biến iPad thành Laptop: Cần những phụ kiện gì?",
      slug: "bien-ipad-thanh-laptop",
      categoryId: ipadCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=1000&q=80",
      excerpt:
        "Magic Keyboard, chuột Bluetooth và Hub chuyển đổi. Combo hoàn hảo cho công việc.",
      readTime: "5 min",
      content: "## Magic Keyboard\n\nTrải nghiệm gõ phím như MacBook...",
    },
    {
      title: "iPad Gen 10 vs iPad Air 5: Chênh lệch 3 triệu có đáng?",
      slug: "so-sanh-ipad-gen-10-vs-air-5",
      categoryId: ipadCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=1000&q=80",
      excerpt: "Phân tích chi tiết về hiệu năng chip M1 so với A14 Bionic.",
      readTime: "5 min",
      content: "## Hiệu năng\n\nChip M1 vượt trội hoàn toàn...",
    },
    {
      title: "Top 5 Game đồ họa khủng nên chơi trên iPad Pro",
      slug: "top-game-ipad-pro",
      categoryId: ipadCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80",
      excerpt:
        "Genshin Impact, Resident Evil Village... Trải nghiệm gaming console ngay trên tablet.",
      readTime: "4 min",
      content: "## Genshin Impact\n\nMax setting 120fps mượt mà...",
    },
    {
      title: "Học vẽ trên iPad: Nên chọn Procreate hay Illustrator?",
      slug: "hoc-ve-ipad-procreate",
      categoryId: ipadCat.id,
      imgUrl:
        "https://images.unsplash.com/photo-1510832842230-87253f48d74f?w=1000&q=80",
      excerpt:
        "So sánh hai ứng dụng đồ họa phổ biến nhất dành cho Digital Artist.",
      readTime: "6 min",
      content: "## Giao diện người dùng\n\nProcreate tối ưu cho cảm ứng...",
    },
  ];

  console.log(`🚀 Bắt đầu Seed ${posts.length} bài viết...`);

  for (const post of posts) {
    console.log(`⏳ Đang xử lý: ${post.title}`);

    // 1. Upload ảnh
    const cloudUrl = await uploadToCloudinary(post.imgUrl, "blog/thumbnails");
    console.log(`   ☁️ Link ảnh: ${cloudUrl}`);

    // 2. Lưu DB
    await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        thumbnail: cloudUrl,
        content: post.content,
        excerpt: post.excerpt,
        readTime: post.readTime,
        categoryId: post.categoryId, // Đảm bảo đúng Foreign Key
        published: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log("🎉 Hoàn tất! Đã thêm 16 bài viết mới.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
