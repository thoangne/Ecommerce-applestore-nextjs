import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedMacbookPosts() {
  try {
    console.log("Seeding MacBook Blog Posts...");

    const macbookPosts = [
      {
        title: "MacBook Pro M3 – Chiếc laptop mạnh nhất hiện nay?",
        slug: "macbook-pro-m3-review",
        categoryId: "cat-macbook",
        excerpt:
          "MacBook Pro M3 mang đến hiệu năng vượt trội, màn hình đẹp và thời lượng pin cực khủng.",
        readTime: "6 min",
        thumbnail: "/blog/macbook-pro-m3.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook Pro M3 – Hiệu năng dẫn đầu

MacBook Pro M3 là một trong những chiếc laptop mạnh nhất thế giới hiện nay với nhiều nâng cấp đáng giá.

### 🌈 Màn hình Liquid Retina XDR
- Độ sáng 1600 nits
- HDR siêu đẹp
- Tỷ lệ tương phản tuyệt vời

### ⚙️ Chip M3 – GPU mạnh hơn 30%
- Render video nhanh gấp đôi M1
- Chạy mượt Final Cut Pro, DaVinci Resolve

### 🔋 Pin lên đến 22 tiếng
- Một trong những laptop pin trâu nhất của Apple 
        `,
      },

      {
        title: "So sánh MacBook Air M2 và MacBook Air M3 – Nên chọn mẫu nào?",
        slug: "so-sanh-air-m2-va-air-m3",
        categoryId: "cat-macbook",
        excerpt:
          "Nên mua MacBook Air M2 giá tốt hay MacBook Air M3 mới nhất? Đây là so sánh chi tiết.",
        readTime: "5 min",
        thumbnail: "/blog/macbook-air-m3.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook Air M2 vs Air M3 – Đâu là lựa chọn tốt nhất?

### 💨 Hiệu năng
- **Air M3:** tăng khoảng 18–25% so với M2
- **Air M2:** vẫn rất mạnh và tiết kiệm điện

### 🌤 Màn hình & thiết kế
- Giống nhau 100%
- Mỏng – nhẹ – sang trọng

### 💰 Giá
- M2 rẻ hơn M3 từ 3–5 triệu

### 🎯 Kết luận
- Cần hiệu năng cao → **Air M3**
- Muốn tiết kiệm → **Air M2** vẫn rất đáng mua 
        `,
      },

      {
        title: "MacBook có phù hợp cho lập trình viên không?",
        slug: "macbook-cho-lap-trinh",
        categoryId: "cat-macbook",
        excerpt:
          "Tại sao đa số lập trình viên chọn MacBook? Ưu điểm & hạn chế là gì?",
        readTime: "4 min",
        thumbnail: "/blog/macbook-developer.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook & Lập trình viên – Bộ đôi hoàn hảo

### ⭐ Ưu điểm:
- macOS chạy ổn định, ít lỗi
- Terminal mạnh, hỗ trợ tốt cho dev web/mobile
- Cài Docker, Node, Java dễ dàng
- Trackpad & bàn phím cực tốt

### ⚠️ Hạn chế:
- Giá cao
- Chơi game không tốt

Nếu bạn làm Web, Mobile, AI cơ bản → MacBook là lựa chọn số 1. 
        `,
      },

      {
        title: "Nên chọn MacBook Air hay MacBook Pro?",
        slug: "nen-chon-air-hay-pro",
        categoryId: "cat-macbook",
        excerpt:
          "Air nhẹ – Pro mạnh. Nhưng nên chọn cái nào theo nhu cầu thực tế?",
        readTime: "4 min",
        thumbnail: "/blog/macbook-air-vs-pro.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook Air vs MacBook Pro – Cách chọn đơn giản

### 📘 Chọn MacBook Air nếu:
- Bạn học sinh – sinh viên
- Chỉ làm Office, code, giải trí
- Muốn máy nhẹ, pin trâu

### 🚀 Chọn MacBook Pro nếu:
- Làm đồ họa nặng
- Render video
- Chạy nhiều VM cùng lúc

Chỉ cần nhớ: 
**Air → nhẹ & rẻ, Pro → mạnh & bền** `,
      },

      {
        title: "MacBook Pro 14 inch có đáng mua trong năm 2025?",
        slug: "macbook-pro-14-2025",
        categoryId: "cat-macbook",
        excerpt:
          "Đánh giá MacBook Pro 14 inch – kích thước hoàn hảo cho người dùng chuyên nghiệp.",
        readTime: "5 min",
        thumbnail: "/blog/macbook-pro-14.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook Pro 14 inch – Lựa chọn vàng

### Ưu điểm:
- Màn hình XDR siêu đẹp
- Chip mạnh (M3/M4)
- Loa cực hay
- Pin tốt

### Nhược điểm:
- Giá cao

Nếu bạn cần một chiếc máy Pro mà không quá to → 14 inch là hoàn hảo. 
        `,
      },

      {
        title: "MacBook Air có phù hợp để học online không?",
        slug: "macbook-air-hoc-online",
        categoryId: "cat-macbook",
        excerpt:
          "MacBook Air là laptop cực mạnh – nhưng liệu có phù hợp cho học online?",
        readTime: "3 min",
        thumbnail: "/blog/macbook-air-online.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook Air & học online

### Ưu điểm:
- Camera 1080p rõ nét
- Micro tốt
- Pin lâu
- Không nóng khi gọi Zoom

### Nhược điểm:
- Màn 60Hz (không quan trọng lắm)

Kết luận: 
**MacBook Air là máy học online tốt nhất hiện nay.** `,
      },

      {
        title: "Top 5 ứng dụng cần có trên MacBook cho người mới",
        slug: "top-ung-dung-cho-macbook",
        categoryId: "cat-macbook",
        excerpt:
          "Tổng hợp ứng dụng cần thiết giúp bạn dùng MacBook hiệu quả hơn.",
        readTime: "4 min",
        thumbnail: "/blog/macbook-apps.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## Top ứng dụng nên cài trên MacBook

- **Raycast:** công cụ tìm kiếm mạnh hơn Spotlight 
- **Magnet:** chia cửa sổ nhanh 
- **iStat Menus:** theo dõi nhiệt độ & hiệu năng 
- **Notion:** ghi chú & quản lý công việc 
- **Warp Terminal:** terminal hiện đại cho dev 

Dùng MacBook hiệu quả hơn rất nhiều với các app này. 
        `,
      },

      {
        title: "MacBook Air 15 inch – Ai nên mua?",
        slug: "macbook-air-15-inch",
        categoryId: "cat-macbook",
        excerpt:
          "MacBook Air 15 inch là lựa chọn mới cho người thích màn hình lớn nhưng vẫn cần sự nhẹ nhàng.",
        readTime: "4 min",
        thumbnail: "/blog/macbook-air-15.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## MacBook Air 15 inch – Nhẹ nhưng rộng rãi

### Hợp với:
- Sinh viên cần màn lớn
- Làm việc văn phòng
- Người thích xem phim

### Ưu điểm:
- Màn hình lớn
- Pin trâu
- Chạy mát

**Air 15 inch = Rộng như Pro nhưng nhẹ như Air.** `,
      },

      {
        title: "Cách bảo quản MacBook để sử dụng bền 5–7 năm",
        slug: "cach-bao-quan-macbook-ben",
        categoryId: "cat-macbook",
        excerpt: "Mẹo giúp MacBook bền hơn, pin tốt hơn và hạn chế hỏng vặt.",
        readTime: "3 min",
        thumbnail: "/blog/macbook-care.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## Giữ MacBook bền & khỏe

### 1) Không sạc quá nóng 
### 2) Vệ sinh bàn phím & màn hình định kỳ 
### 3) Dùng case mỏng để tránh móp 
### 4) Không để máy trong balo bí hơi 
### 5) Cập nhật macOS thường xuyên

Bảo quản tốt giúp MacBook dùng bền 5–7 năm không lỗi vặt. 
        `,
      },

      {
        title: "Top MacBook đáng mua nhất 2025",
        slug: "top-macbook-2025",
        categoryId: "cat-macbook",
        excerpt: "Danh sách MacBook đáng mua nhất theo từng ngân sách.",
        readTime: "4 min",
        thumbnail: "/blog/macbook-top2025.jpg",
        published: true,
        publishedAt: new Date(),
        content: `
## Top MacBook 2025

### 💰 Dưới 20 triệu
- MacBook Air M1 (vẫn quá mạnh)

### 💰 20–30 triệu
- MacBook Air M2
- MacBook Air M3

### 💰 Trên 30 triệu
- MacBook Pro 14 M3
- MacBook Pro 16 M3/M4

Tùy ngân sách mà chọn đúng dòng MacBook phù hợp. 
        `,
      },
    ];

    // Sử dụng vòng lặp với upsert để tránh lỗi trùng lặp
    for (const post of macbookPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug }, // Tìm bài viết theo slug
        update: post, // Nếu tìm thấy thì cập nhật lại nội dung
        create: post, // Nếu không tìm thấy thì tạo mới
      });
      console.log(`✅ Upserted post: ${post.slug}`);
    }

    console.log("MacBook Blog Posts seeded successfully!");
  } catch (err) {
    console.error("Error seeding MacBook Blog Posts:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedMacbookPosts();
