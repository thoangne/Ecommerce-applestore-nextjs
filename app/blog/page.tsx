import { BlogCard } from "@/components/blog-card";
import Link from "next/link";

const blogs = [
  {
    title: "Trải nghiệm iPhone 16 Pro – đỉnh cao thiết kế và hiệu năng",
    date: "03/11/2025",
    author: "Ngụy Ngọc Thoáng",
    image: "/images/blog/iphone16pro.jpg",
    slug: "trai-nghiem-iphone-16-pro",
    excerpt:
      "Khám phá hiệu năng vượt trội, camera đột phá và thiết kế titan tinh tế của iPhone 16 Pro – chiếc flagship định hình tương lai.",
  },
  {
    title: "Top 5 phụ kiện Apple đáng mua nhất 2025",
    date: "25/10/2025",
    author: "Ngụy Ngọc Thoáng",
    image: "/images/blog/phu-kien-apple.jpg",
    slug: "top-5-phu-kien-apple-2025",
    excerpt:
      "Tổng hợp 5 phụ kiện Apple hữu ích giúp nâng cao trải nghiệm người dùng – từ AirPods, MagSafe đến Apple Watch.",
  },
];

export default function BlogPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Blog – Tin tức & Cảm nhận
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
