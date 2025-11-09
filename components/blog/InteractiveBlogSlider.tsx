import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import LikeButton from "./LikeButton";
import Image from "next/image";
import { Clock, UserCircle } from "lucide-react";

// 1. Interface (giữ nguyên, đảm bảo 'excerpt' có trong query)
interface EnrichedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null; // <-- Đảm bảo bạn đã query trường này
  thumbnail: string | null;
  category: { name: string } | null;
  publishedAt: Date | null;
  readTime: string | null;
  author: { name: string | null; avatarUrl: string | null } | null;
  likeCount: number;
  userHasLiked: boolean;
}

// 2. Component Card (Tái sử dụng)
// Chúng ta tạo một component card nội bộ để tái sử dụng
function BlogCard({
  post,
  variant = "default",
}: {
  post: EnrichedBlogPost;
  variant?: "default" | "featured"; // 2 kiểu: nổi bật (to) và mặc định (nhỏ)
}) {
  const isFeatured = variant === "featured";

  return (
    <Link href={`/blog/${post.slug}`} className="stretched-link">
      <article
        key={post.id}
        className="group relative flex flex-col bg-white dark:bg-gray-900 
                 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-500/20 
                 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1"
      >
        {/* Ảnh bìa */}
        {post.thumbnail && (
          <div className="relative w-full overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={isFeatured ? 800 : 400}
              height={isFeatured ? 450 : 225}
              className={`w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 
                        ${isFeatured ? "h-64 md:h-96" : "h-48"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        )}

        {/* Nội dung text */}
        <div className="flex flex-col flex-1 p-5">
          {/* Category & Ngày đăng */}
          <div className="flex justify-between items-center text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {post.category?.name || "Blog"}
            </span>
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                : "Chưa công bố"}
            </span>
          </div>

          {/* Tiêu đề */}
          <h2
            className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors 
                      ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}`}
          >
            {post.title}
          </h2>

          {/* Excerpt (Mô tả ngắn) */}
          <p
            className={`mt-3 text-sm text-gray-600 dark:text-gray-300 flex-grow 
                      ${isFeatured ? "line-clamp-3" : "line-clamp-2"}`}
          >
            {post.excerpt}
          </p>

          {/* Footer (Author & Like) */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            {/* Tác giả */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {post.author?.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name ?? "Author"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <UserCircle className="w-5 h-5" />
              )}
              <span>{post.author?.name ?? "Anonymous"}</span>
            </div>

            {/* Nút Like (z-10 để nó bấm được, vì 'stretched-link' của title) */}
            <div className="relative z-10">
              <LikeButton
                postId={post.id}
                initialLikeCount={post.likeCount}
                userHasLiked={post.userHasLiked}
                className="flex items-center gap-1.5 text-xs px-2 py-1"
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// 3. Component Slider Chính (Layout 1 + 3)
export default async function InteractiveBlogSlider() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Query (Thêm 'excerpt' và 'readTime' vào query)
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      // ✅ SỬA LỖI: Chỉ dùng 'select' và di chuyển logic 'include' vào đây
      id: true,
      title: true,
      slug: true,
      excerpt: true, // <-- Thêm trường này
      thumbnail: true,
      publishedAt: true,
      readTime: true, // <-- Thêm trường này
      author: {
        // Lấy thông tin tác giả
        select: { name: true, avatarUrl: true },
      },
      category: {
        // Lấy thông tin danh mục
        select: { name: true },
      },
      likes: {
        // Lấy thông tin like
        select: { userId: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 4, // Lấy 4 bài (1 nổi bật, 3 bài nhỏ)
  });

  const enrichedPosts: EnrichedBlogPost[] = posts.map((post) => ({
    ...post,
    likeCount: post.likes.length,
    userHasLiked: currentUserId
      ? post.likes.some((like) => like.userId === currentUserId)
      : false,
  }));

  if (enrichedPosts.length === 0) {
    return (
      <div className="text-center py-10 dark:text-white">
        Chưa có bài viết nào.
      </div>
    );
  }

  // Tách bài viết
  const featuredPost = enrichedPosts[0];
  const otherPosts = enrichedPosts.slice(1);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tiêu đề Section */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Bài viết mới nhất
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Cập nhật tin tức, thủ thuật và đánh giá mới nhất từ chúng tôi.
          </p>
        </div>

        {/* Layout Grid 1 + 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Trái: Bài viết Nổi bật */}
          <div className="lg:col-span-2">
            <BlogCard post={featuredPost} variant="featured" />
          </div>

          {/* Cột Phải: 3 Bài viết nhỏ */}
          <div className="flex flex-col gap-8">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
