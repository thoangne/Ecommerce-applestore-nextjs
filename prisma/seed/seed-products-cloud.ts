import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. CẤU HÌNH ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// --- 2. LOGIC TỰ ĐỘNG PHÂN LOẠI (QUAN TRỌNG) ---
// Hàm này sẽ đưa sản phẩm về đúng danh mục con (khớp với Navbar)
function detectCategorySlug(productName: string): string {
  const lower = productName.toLowerCase();

  // MAC
  if (lower.includes("macbook")) {
    if (lower.includes("air")) return "mac-macbook-air";
    return "mac-macbook-pro"; // Mặc định là Pro nếu không có chữ Air
  }

  // IPAD
  if (lower.includes("ipad")) {
    if (lower.includes("pro")) return "ipad-ipad-pro";
    if (lower.includes("air")) return "ipad-ipad-air";
    if (lower.includes("mini")) return "ipad-ipad-mini";
    return "ipad-ipad-gen"; // iPad thường
  }

  // IPHONE
  if (lower.includes("iphone")) {
    if (lower.includes("pro max")) return "iphone-iphone-pro-max";
    if (lower.includes("pro")) return "iphone-iphone-pro";
    return "iphone-iphone"; // iPhone thường (Plus/Mini)
  }

  return "misc"; // Không xác định
}

// --- 3. HÀM UPLOAD ẢNH ---
async function uploadToCloudinary(url: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: folder,
      overwrite: false,
      resource_type: "image",
      timeout: 120000,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Lỗi upload ảnh: ${url}`);
    return "https://via.placeholder.com/800x800?text=Image+Error";
  }
}

// --- 4. KHO ẢNH NGUỒN (UNSPLASH) ---
function getSourceImageByName(name: string): string {
  const lowerName = name.toLowerCase();

  // Ảnh iPhone
  if (lowerName.includes("iphone 15"))
    return "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80";
  if (lowerName.includes("iphone 14") || lowerName.includes("iphone 13"))
    return "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&q=80";
  if (lowerName.includes("iphone"))
    return "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80";

  // Ảnh Mac (Link MacBook Air đã sửa)
  if (lowerName.includes("macbook air"))
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80";
  if (lowerName.includes("macbook pro"))
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80";

  // Ảnh iPad
  if (lowerName.includes("ipad pro"))
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80";
  if (lowerName.includes("ipad"))
    return "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80";

  return "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80";
}

// Hàm tạo Slug sản phẩm không trùng
async function getUniqueProductSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

async function main() {
  console.log("🚀 Bắt đầu Seed Sản phẩm (Phiên bản Fix Danh mục)...");

  // 1. Đọc file JSON
  let rawProducts;
  try {
    const jsonPath = path.join(__dirname, "apple_products.json");
    const jsonContent = fs.readFileSync(jsonPath, "utf8");
    rawProducts = JSON.parse(jsonContent);
  } catch (e) {
    console.error("❌ Không tìm thấy file 'apple_products.json'!");
    return;
  }

  // 2. Dọn dẹp dữ liệu cũ
  console.log("🧹 Đang xóa dữ liệu cũ...");
  try {
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});
    // Không xóa Category để giữ ID cho các quan hệ khác nếu có
  } catch (err) {}

  // 3. TẠO CẤU TRÚC DANH MỤC CHUẨN (Cha - Con)
  console.log("🌱 Đang xây dựng lại hệ thống danh mục...");

  const hierarchy = [
    {
      name: "Mac",
      slug: "mac",
      subs: [
        { name: "MacBook Air", slug: "mac-macbook-air" },
        { name: "MacBook Pro", slug: "mac-macbook-pro" },
      ],
    },
    {
      name: "iPad",
      slug: "ipad",
      subs: [
        { name: "iPad Gen", slug: "ipad-ipad-gen" },
        { name: "iPad Air", slug: "ipad-ipad-air" },
        { name: "iPad Pro", slug: "ipad-ipad-pro" },
        { name: "iPad Mini", slug: "ipad-ipad-mini" },
      ],
    },
    {
      name: "iPhone",
      slug: "iphone",
      subs: [
        { name: "iPhone", slug: "iphone-iphone" },
        { name: "iPhone Pro", slug: "iphone-iphone-pro" },
        { name: "iPhone Pro Max", slug: "iphone-iphone-pro-max" },
      ],
    },
  ];

  // Map Slug -> ID để dùng khi tạo sản phẩm
  const slugToIdMap: Record<string, string> = {};

  for (const parent of hierarchy) {
    // Tạo cha
    const p = await prisma.category.upsert({
      where: { slug: parent.slug },
      update: { name: parent.name },
      create: { name: parent.name, slug: parent.slug },
    });
    slugToIdMap[parent.slug] = p.id;

    // Tạo con
    for (const sub of parent.subs) {
      const s = await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, parentId: p.id },
        create: { name: sub.name, slug: sub.slug, parentId: p.id },
      });
      slugToIdMap[sub.slug] = s.id;
    }
  }

  // 4. Xử lý sản phẩm
  console.log(`📦 Tìm thấy ${rawProducts.length} sản phẩm. Đang xử lý...`);

  for (const p of rawProducts) {
    console.log(`⏳ Đang xử lý: ${p.name}`);

    // A. Lấy ảnh mẫu
    const sourceImageUrl = getSourceImageByName(p.name);
    const cloudUrl = await uploadToCloudinary(sourceImageUrl, "products");
    const productImages = [cloudUrl, cloudUrl, cloudUrl];

    // B. Tự động xác định danh mục con chuẩn
    const targetCategorySlug = detectCategorySlug(p.name); // Ví dụ: 'mac-macbook-air'
    const realCategoryId = slugToIdMap[targetCategorySlug];

    if (!realCategoryId) {
      console.warn(
        `⚠️ Không tìm thấy danh mục cho ${p.name} (Slug: ${targetCategorySlug}). Bỏ qua.`
      );
      continue;
    }

    // C. Xử lý Slug sản phẩm
    const cleanSlug =
      p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const uniqueSlug = await getUniqueProductSlug(cleanSlug);

    // D. Lưu vào DB
    await prisma.product.create({
      data: {
        name: p.name,
        slug: uniqueSlug,
        description: p.description,
        price: p.price,
        inventory: p.inventory,
        images: productImages,
        categoryId: realCategoryId, // ✅ Đã gắn vào danh mục con chuẩn

        color: p.color,
        storage: p.storage,
        specs: p.specs,
        releasedAt: p.releasedAt ? new Date(p.releasedAt) : new Date(),
      },
    });
  }

  console.log("✅ Hoàn tất! Sản phẩm đã về đúng nhà.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
