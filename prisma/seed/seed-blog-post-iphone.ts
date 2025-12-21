import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedIphonePosts() {
  try {
    console.log("Seeding iPhone Blog Posts...");

    const iphonePosts = [
      {
        title: "iPhone 16 – Những nâng cấp đáng chú ý trong năm nay",
        slug: "iphone-16-nhung-nang-cap-dang-chu-y",
        categoryId: "cat-iphone",
        excerpt:
          "iPhone 16 mang đến chip A18 mạnh nhất, camera tốt hơn, pin lớn hơn và thiết kế mới tinh tế.",
        readTime: "4 min",
        thumbnail: "/blog/iphone16.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPhone 16 – Flagship dẫn đầu xu hướng 2025

Năm nay, Apple đã nâng cấp mạnh mẽ dòng iPhone 16, tập trung vào **hiệu năng**, **camera**, và **thời lượng pin**.

### 🔥 Chip A18 – sức mạnh AI vượt trội
- Xử lý hình ảnh nhanh hơn
- GPU tăng 20%
- Tối ưu hoá AI trên máy

### 📸 Camera cảm biến lớn 48MP
- Chụp đêm đẹp hơn
- HDR sống động
- Video chống rung cực mượt

### 🔋 Pin lớn hơn 12%
- Sử dụng thoải mái cả ngày
- Hỗ trợ USB-C Power Delivery

### 🎨 Màu sắc mới sang trọng
- Midnight Black
- Silver Frost
- Blue Ice

**iPhone 16** là lựa chọn lý tưởng cho người dùng muốn hiệu năng bền bỉ và camera đỉnh cao.
        `,
      },

      {
        title: "Có nên nâng cấp từ iPhone 14 lên iPhone 15?",
        slug: "co-nen-nang-cap-iphone-14-len-iphone-15",
        categoryId: "cat-iphone",
        excerpt:
          "So sánh chi tiết iPhone 14 và iPhone 15 giúp bạn đưa ra lựa chọn hợp lý.",
        readTime: "5 min",
        thumbnail: "/blog/iphone15-compare.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPhone 14 vs iPhone 15 – Sự khác biệt thực sự

Nếu bạn đang băn khoăn có nên nâng cấp lên iPhone 15, đây là bài phân tích dành cho bạn.

### ⭐ Thiết kế mới với Dynamic Island
- Thay thế notch cũ
- Hiển thị thông tin thông minh

### ⭐ Camera 48MP
- Ảnh sắc nét hơn
- Zoom 2x chất lượng cao

### ⭐ USB-C cuối cùng đã có mặt
- Sạc nhanh hơn
- Dùng chung cáp với iPad, MacBook

### Kết luận:
- **Đang dùng iPhone 12–13 → NÊN nâng cấp**
- **Đang dùng iPhone 14 → Nâng cấp nếu cần camera tốt hơn**
        `,
      },

      {
        title: "Mẹo chụp ảnh đẹp hơn trên iPhone mà bạn nên biết",
        slug: "meo-chup-anh-dep-tren-iphone",
        categoryId: "cat-iphone",
        excerpt:
          "Bí quyết giúp bạn chụp ảnh đẹp, sắc nét và sáng tạo hơn bằng iPhone.",
        readTime: "3 min",
        thumbnail: "/blog/iphone-camera-tips.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## 5 mẹo giúp chụp ảnh bằng iPhone đẹp hơn

Chỉ với vài thay đổi nhỏ, bạn có thể nâng tầm ảnh chụp trên iPhone.

### 1) Dùng Photographic Styles
Tạo tông màu riêng biệt và chuyên nghiệp.

### 2) Sử dụng lưới Grid
Canh bố cục theo quy tắc 1/3.

### 3) Giảm độ sáng (Exposure)
Ảnh sẽ trong và nhiều chi tiết hơn.

### 4) Dùng chế độ chân dung (Portrait)
Tạo hiệu ứng xoá phông mịn.

### 5) Lau camera
Nghe đơn giản nhưng cực kỳ hiệu quả.

Áp dụng những mẹo này chắc chắn sẽ giúp bạn chụp ảnh đẹp hơn.
        `,
      },

      {
        title: "So sánh iPhone 15 Pro và 15 Pro Max – Nên chọn bản nào?",
        slug: "so-sanh-iphone-15-pro-va-15-pro-max",
        categoryId: "cat-iphone",
        excerpt:
          "Phân tích chi tiết sự khác biệt giữa iPhone 15 Pro và 15 Pro Max.",
        readTime: "6 min",
        thumbnail: "/blog/iphone15pro.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## Chọn iPhone 15 Pro hay 15 Pro Max?

Apple mang đến nhiều sự khác biệt giữa hai mẫu Pro.

### 📌 Kích thước & Màn hình
- 15 Pro: 6.1 inch
- 15 Pro Max: 6.7 inch

### 📌 Camera telephoto độc quyền (Pro Max)
- Zoom quang học 5x
- Khung hình rộng hơn

### 📌 Pin
- Pro Max mạnh hơn 20%

### 📌 Giá
- Chênh lệch khoảng 3–4 triệu

### Kết luận:
- **Thích nhỏ gọn → Chọn Pro**
- **Thích camera & pin → Chọn Pro Max**
        `,
      },

      {
        title: "Tổng hợp những tin đồn về iPhone 17",
        slug: "tin-don-iphone-17",
        categoryId: "cat-iphone",
        excerpt:
          "Những tin đồn đáng tin cậy nhất về iPhone 17 dự kiến ra mắt năm sau.",
        readTime: "4 min",
        thumbnail: "/blog/iphone17-rumor.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPhone 17 – Những tin đồn mới nhất

Những nguồn leak uy tín cho biết iPhone 17 sẽ có:

### 🔥 Viền siêu mỏng hơn nữa
Công nghệ Border Reduction Structure.

### 🔥 Camera trước 24MP
Selfie sắc nét hơn.

### 🔥 Face ID dưới màn hình
Không còn notch hay Dynamic Island.

### 🔥 Chip A19 tối ưu AI

Nếu những tin đồn này thành sự thật, iPhone 17 hứa hẹn đột phá lớn.
        `,
      },

      {
        title: "Cách tối ưu pin iPhone để dùng lâu hơn",
        slug: "cach-toi-uu-pin-iphone",
        categoryId: "cat-iphone",
        excerpt: "Hướng dẫn cách tiết kiệm pin và kéo dài tuổi thọ cho iPhone.",
        readTime: "3 min",
        thumbnail: "/blog/iphone-battery.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## Tips tiết kiệm pin iPhone hiệu quả

### 1) Bật Optimized Battery Charging 
Giảm chai pin về lâu dài.

### 2) Tắt Background App Refresh 
Tiết kiệm 5–10% pin mỗi ngày.

### 3) Giảm Animation
iPhone chạy mượt hơn, tiết kiệm pin.

### 4) Đặt chế độ Low Power Mode 
Khi pin dưới 20%.

### 5) Kiểm tra ứng dụng tốn pin 
Settings → Battery.

Áp dụng những tip này để pin iPhone bền và lâu hơn.
        `,
      },
    ];

    // Sử dụng upsert để update nếu đã tồn tại, create nếu chưa có
    for (const post of iphonePosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: post,
        create: post,
      });
      console.log(`✅ Upserted post: ${post.slug}`);
    }

    console.log("iPhone Blog Posts seeded successfully!");
  } catch (err) {
    console.error("Error seeding iPhone Blog Posts:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedIphonePosts();
