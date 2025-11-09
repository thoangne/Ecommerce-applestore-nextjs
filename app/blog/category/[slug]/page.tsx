import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import LikeButton from "@/components/blog/LikeButton";
import { UserCircle } from "lucide-react";

/**
 * HÀM FETCH DỮ LIỆU
 * (Giữ nguyên)
 */
async function getCategoryData(slug: string, userId?: string) {
  const category = await prisma.blogCategory.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        include: {
          author: { select: { name: true, avatarUrl: true } },
          category: { select: { name: true } },
          likes: { select: { userId: true } },
        },
      },
    },
  });

  if (!category) {
    return null;
  }

  // Xử lý dữ liệu bài viết (enrich posts)
  const enrichedPosts = category.posts.map((post) => ({
    ...post,
    likeCount: post.likes.length,
    userHasLiked: userId
      ? post.likes.some((like) => like.userId === userId)
      : false,
  }));

  return {
    categoryName: category.name,
    posts: enrichedPosts,
  };
}

// Kiểu dữ liệu cho bài viết đã xử lý
type EnrichedPost = NonNullable<
  Awaited<ReturnType<typeof getCategoryData>>
>["posts"][0];

/**
 * COMPONENT CARD (Tái sử dụng từ Slider cho đồng nhất)
 * (Giữ nguyên)
 */
function BlogCard({ post }: { post: EnrichedPost }) {
  return (
    <article
      className="group relative flex flex-col bg-white dark:bg-gray-900 
                 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-500/20 
                 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1"
    >
      {/* Ảnh bìa */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative w-full overflow-hidden"
      >
        <Image
          src={
            post.thumbnail ||
            "https://placehold.co/400x225/e2e8f0/94a3b8?text=Blog"
          }
          alt={post.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </Link>

      {/* Nội dung text */}
      <div className="flex flex-col flex-1 p-5">
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
          {post.title}
        </h2>

        {/* Excerpt (Mô tả ngắn) */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-2">
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

          {/* Link Đọc tiếp */}
          <Link
            href={`/blog/${post.slug}`}
            className="relative z-10 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Đọc tiếp &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * TRANG CHÍNH
 */
export default async function BlogCategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { params } = props;
  const { slug } = await params; // Giữ nguyên cách fix của bạn
  const session = await auth();
  const currentUserId = session?.user?.id;
  const data = await getCategoryData(slug, currentUserId);

  if (!data) {
    notFound();
  }

  const { categoryName, posts } = data;

  return (
    <section className="bg-gray-50 dark:bg-black min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* --- HEADER MỚI (Đã sửa UI) --- */}
        <div className="mb-12 md:mb-16 text-center">
          {/* Thẻ "pill" cho danh mục */}

          {/* Tiêu đề chính (Tên danh mục) với Gradient */}
          <h1
            className="text-4xl md:text-5xl font-extrabold mt-6 mb-4
                         bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700
                         dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500
                         bg-clip-text text-transparent py-2"
          >
            {categoryName}
          </h1>

          {/* Subtitle (Tổng số bài viết) */}
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tổng cộng {posts.length} bài viết được tìm thấy trong danh mục này.
          </p>

          {/* Dải phân cách gradient */}
          <div className="mt-12 h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-blue-700"></div>
        </div>
        {/* --- KẾT THÚC HEADER MỚI --- */}

        {/* Lưới các bài viết */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post as EnrichedPost} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Không tìm thấy bài viết nào trong danh mục này.
          </div>
        )}
      </div>
    </section>
  );
}
