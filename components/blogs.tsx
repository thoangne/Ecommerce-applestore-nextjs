"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./styles/blogs.css";
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Macbook Air 13",
    excerpt:
      "Trang bị chip Apple M4 với 10 nhân CPU và GPU 8–10 nhân, hiệu năng tăng khoảng 30% so với đời trước, cho khả năng xử lý nhanh và mượt. Máy có bộ nhớ hợp nhất 16–32 GB, SSD từ 256 GB đến 2 TB, màn hình Liquid Retina 13.6″ sắc nét chuẩn màu P3.",
    image:
      "https://i.pinimg.com/1200x/8c/5b/e3/8c5be396d6ae5b0d7c024f5dbdd0840e.jpg",
    category: "Mac",
    date: "25 Tháng 10, 2025",
    readTime: "5 phút đọc",
    author: {
      name: "Minh Anh",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: "2",
    title: "MacBook Pro M3",
    excerpt:
      "M3 chip mang đến khả năng render video 4K nhanh hơn 40% so với thế hệ trước, hoàn hảo cho công việc sáng tạo chuyên nghiệp. Hiệu suất đột phá cho mọi tác vụ.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80",
    category: "Mac",
    date: "22 Tháng 10, 2025",
    readTime: "7 phút đọc",
    author: {
      name: "Tuấn Kiệt",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: "3",
    title: "AirPods Pro 2",
    excerpt:
      "Công nghệ khử tiếng ồn chủ động được cải tiến giúp loại bỏ gấp đôi tiếng ồn môi trường so với phiên bản trước. Âm thanh không gian và trải nghiệm nghe đỉnh cao.",
    image:
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=1200&q=80",
    category: "Audio",
    date: "18 Tháng 10, 2025",
    readTime: "4 phút đọc",
    author: {
      name: "Phương Linh",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  },
  {
    id: "4",
    title: "Vision Pro",
    excerpt:
      "Apple Vision Pro mở ra kỷ nguyên mới của điện toán không gian với màn hình micro-OLED độ phân giải 4K cho mỗi mắt. Tương lai của thực tế hỗn hợp đã đến.",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&q=80",
    category: "Innovation",
    date: "15 Tháng 10, 2025",
    readTime: "6 phút đọc",
    author: {
      name: "Hoàng Nam",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  },
];

const InteractiveBlogSlider: React.FC = () => {
  const [activeBlog, setActiveBlog] = useState(0);

  const handlePrevious = () => {
    setActiveBlog((prev) => (prev === 0 ? blogPosts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveBlog((prev) => (prev === blogPosts.length - 1 ? 0 : prev + 1));
  };

  const activePost = blogPosts[activeBlog];

  return (
    <section>
      <h1
        className="text-4xl font-bold text-center text-white mb-8 mt-0 bg-gradient-to-r from-[#000000] via-[#555555] to-[#aaaaaa]
            dark:from-[#ffffff] dark:via-[#cccccc] dark:to-[#777777]
            bg-[length:200%_auto] bg-clip-text text-transparent
            animate-gradient-flow
            tracking-tight leading-tight
            drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]
            hover:scale-[1.05] transition-transform duration-700 ease-in-out
            animate-fade-in"
      >
        Blog công nghệ
      </h1>
      <div className="relative min-h-screen bg-black overflow-hidden rounded-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            key={activeBlog}
            src={activePost.image}
            alt={activePost.title}
            className="background-image w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-screen flex flex-col justify-between py-8">
          {/* Header */}

          {/* Main Content Area */}
          <div className="flex flex-col gap-8">
            {/* Left Content */}
            <div className=" content-animate max-w-2xl mt-[50px]">
              <div className="mb-4">
                <span className="text-gray-400 text-xs tracking-wider uppercase">
                  {activePost.category}
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight uppercase tracking-tight">
                {activePost.title}
              </h1>

              <p className="text-gray-300 text-base mb-6 max-w-xl leading-relaxed">
                {activePost.excerpt}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={activePost.author.avatar}
                    alt={activePost.author.name}
                    className="w-10 h-10 rounded-full ring-2 ring-white/20"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {activePost.author.name}
                    </p>
                    <p className="text-gray-400 text-xs">{activePost.date}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-700" />
                <div className="text-gray-400 text-xs">
                  {activePost.readTime}
                </div>
              </div>

              <Link
                href={`/blog/${activePost.id}`}
                className="mt-[20px] explore-button inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-all duration-300 relative z-10"
              >
                <span>KHÁM PHÁ NGAY</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Thumbnail Cards - Moved Below */}
            <div className="ml-[500px]  cards-animate flex items-center gap-4">
              {blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  onClick={() => setActiveBlog(index)}
                  className={`card-thumbnail cursor-pointer rounded-xl overflow-hidden flex-shrink-0 ${
                    index === activeBlog
                      ? "active"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    width: "160px",
                    height: "220px",
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-xs mb-1">
                        {post.title}
                      </p>
                      <p className="text-gray-300 text-xs uppercase tracking-wide">
                        {post.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-start mb-[40px]">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                className="nav-button w-10 h-10 rounded-full flex items-center justify-center text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="nav-button w-10 h-10 rounded-full flex items-center justify-center text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Progress Bar */}
              <div className="w-20 h-0.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="progress-bar h-full"
                  style={{
                    width: `${((activeBlog + 1) / blogPosts.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveBlogSlider;
