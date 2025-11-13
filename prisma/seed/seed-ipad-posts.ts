import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedIpadPosts() {
  try {
    console.log("Seeding iPad Blog Posts...");

    const ipadPosts = [
      {
        title: "iPad Pro M4 – Sức mạnh vượt xa laptop truyền thống",
        slug: "ipad-pro-m4-suc-manh-vuot-laptop",
        categoryId: "cat-ipad",
        excerpt:
          "iPad Pro M4 là chiếc tablet mạnh nhất Apple từng tạo ra, với màn hình OLED và chip M4 cực khủng.",
        readTime: "6 min",
        thumbnail: "/blog/ipad-pro-m4.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPad Pro M4 – Sự nâng cấp đột phá năm 2025

iPad Pro M4 mang lại hiệu năng vượt trội, thậm chí vượt qua nhiều laptop truyền thống hiện nay.

### 🔥 Chip Apple M4 – Hiệu năng không đối thủ
- CPU nhanh hơn 30% so với M3
- GPU hỗ trợ Ray Tracing
- Tối ưu cho Photoshop, Figma, LumaFusion

### 🌈 Màn hình OLED Ultra Retina XDR
- Độ tương phản cực sâu
- Màu sắc sống động
- Hỗ trợ ProMotion 120Hz

### 🖊 Apple Pencil Pro
- Nhận diện nghiêng & lực tốt hơn
- Phản hồi rung tự nhiên
- Độ trễ cực thấp

**iPad Pro M4 phù hợp nhất cho designer, editor và người dùng chuyên nghiệp.**
        `,
      },

      {
        title: "iPad Air M2 – Lựa chọn lý tưởng cho sinh viên",
        slug: "ipad-air-m2-cho-sinh-vien",
        categoryId: "cat-ipad",
        excerpt:
          "iPad Air M2 mang lại hiệu năng mạnh, trọng lượng nhẹ và mức giá hợp lý cho học sinh – sinh viên.",
        readTime: "4 min",
        thumbnail: "/blog/ipad-air-m2.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPad Air M2 – Chiếc máy hoàn hảo cho sinh viên

### 🎓 Vì sao sinh viên nên chọn Air M2?
- Mạnh gần bằng iPad Pro
- Hỗ trợ Apple Pencil 2
- Màn hình đẹp 10.9 inch
- Pin dùng cả ngày

### 📝 Dùng để học:
- GoodNotes, Notability cực mượt
- Làm bài tập, tra cứu, Zoom call
- Tương thích bàn phím rời

iPad Air M2 là lựa chọn tốt nhất trong tầm giá 15–18 triệu.
        `,
      },

      {
        title: "iPad Gen 10 – Có còn đáng mua trong năm 2025?",
        slug: "ipad-gen10-2025-review",
        categoryId: "cat-ipad",
        excerpt:
          "iPad Gen 10 có thiết kế mới, USB-C và hiệu năng ổn định – liệu có còn đáng mua?",
        readTime: "3 min",
        thumbnail: "/blog/ipad-gen10.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPad Gen 10 – Thiết kế mới, giá tốt

### ⭐ Điểm mạnh:
- Thiết kế vuông giống iPad Air
- USB-C tiện lợi
- Hiệu năng đủ cho học online & giải trí

### ⚠️ Điểm yếu:
- Không hỗ trợ Apple Pencil 2
- Màn hình không laminated

**Ai nên mua?**
- Học sinh – phụ huynh
- Người dùng phổ thông
- Người chỉ cần một chiếc máy rẻ – bền – ổn
        `,
      },

      {
        title: "So sánh iPad Pro M4 và iPad Air M2 – Nên chọn cái nào?",
        slug: "so-sanh-ipad-pro-m4-vs-air-m2",
        categoryId: "cat-ipad",
        excerpt:
          "Nên chọn iPad Pro cực mạnh hay iPad Air giá rẻ? Bài so sánh chi tiết dành cho bạn.",
        readTime: "5 min",
        thumbnail: "/blog/ipad-compare.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPad Pro M4 vs iPad Air M2 – Đâu là lựa chọn hợp lý?

### 📌 Hiệu năng:
- **Pro M4:** mạnh nhất, dành cho designer
- **Air M2:** mạnh nhưng tiết kiệm

### 📌 Màn hình:
- **Pro:** OLED Ultra Retina XDR (đẹp nhất)
- **Air:** LCD thường

### 📌 Giá:
- Pro M4 gần gấp đôi Air M2

**Kết luận:**
- Làm việc sáng tạo → Chọn **Pro M4**
- Học tập – văn phòng → Chọn **Air M2**
        `,
      },

      {
        title: "Cách chọn iPad phù hợp theo nhu cầu",
        slug: "cach-chon-ipad-theo-nhu-cau",
        categoryId: "cat-ipad",
        excerpt:
          "Tư vấn chọn iPad theo từng nhu cầu: học tập, thiết kế, giải trí, làm việc.",
        readTime: "4 min",
        thumbnail: "/blog/ipad-choice.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## Chọn iPad phù hợp – Đơn giản hơn bạn nghĩ

### 📘 Học sinh – sinh viên
- iPad Gen 10
- iPad Air M2

### 🎨 Designer – Artist
- iPad Pro M2 / M4

### 💼 Văn phòng
- iPad Air M2

### 🎮 Giải trí
- iPad Mini (nhỏ gọn)

Đừng mua quá mạnh nếu bạn không dùng hết tính năng!
        `,
      },

      {
        title: "iPad Mini – Nhỏ gọn nhưng cực kỳ mạnh mẽ",
        slug: "ipad-mini-co-nen-mua",
        categoryId: "cat-ipad",
        excerpt:
          "iPad Mini là chiếc iPad nhỏ nhất nhưng mạnh mẽ và cực kỳ linh hoạt.",
        readTime: "3 min",
        thumbnail: "/blog/ipad-mini.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPad Mini – Nhỏ mà có võ

### Phù hợp cho ai?
- Người thích sự nhỏ gọn
- Game thủ mobile
- Người cần ghi chú nhanh bằng Pencil

### Điểm mạnh:
- Chip mạnh
- 8.3 inch dễ cầm
- Rất nhẹ

iPad Mini là chiếc máy thú vị nhất trong dòng iPad.
        `,
      },

      {
        title: "Top ứng dụng ghi chú tốt nhất cho iPad trong năm 2025",
        slug: "top-ung-dung-ghi-chu-ipad",
        categoryId: "cat-ipad",
        excerpt:
          "GoodNotes, Notability, OneNote – đâu là ứng dụng ghi chú tốt nhất?",
        readTime: "4 min",
        thumbnail: "/blog/ipad-noteapps.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## 5 ứng dụng ghi chú tuyệt nhất trên iPad

### 📝 GoodNotes 6
- Tương thích Pencil tốt
- Giao diện đẹp

### 📝 Notability
- Thu âm + ghi chú mạnh

### 📝 OneNote
- Miễn phí 100%
- Đồng bộ tốt

### 📝 Nebo
- Chuyển chữ viết tay sang text

### 📝 Apple Notes
- Miễn phí, nhẹ, dễ dùng

Mỗi app phù hợp với một kiểu người dùng khác nhau.
        `,
      },

      {
        title: "iPad có thay thế được laptop không?",
        slug: "ipad-co-thay-the-laptop-khong",
        categoryId: "cat-ipad",
        excerpt:
          "Nhiều người băn khoăn liệu iPad đã đủ mạnh để thay thế laptop chưa.",
        readTime: "5 min",
        thumbnail: "/blog/ipad-vs-laptop.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## iPad có thể thay thế laptop?

### Khi nào thay thế được?
- Làm việc văn phòng nhẹ
- Mail, Zoom, note-taking
- Xài Magic Keyboard

### Khi nào KHÔNG?
- Lập trình
- Render video nặng
- Dùng phần mềm 3D chuyên nghiệp

Kết luận: iPad đáp ứng được 60% nhu cầu của người dùng laptop phổ thông.
        `,
      },
    ];

    for (const post of ipadPosts) {
      await prisma.blogPost.create({
        data: post,
      });
    }

    console.log("iPad Blog Posts seeded successfully!");
  } catch (err) {
    console.error("Error seeding iPad Blog Posts:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedIpadPosts();
