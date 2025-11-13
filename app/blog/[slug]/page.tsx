import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Lấy session
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, MessageCircle, ThumbsUp, UserCircle } from "lucide-react";
import LikeButton from "@/components/blog/LikeButton";
import BlogComments from "@/components/blog/BlogComment"; // Sửa lại đường dẫn
import Breadcrumbs from "@/components/breadscums";

// Định nghĩa kiểu cho props
interface BlogPostPageProps {
  params: Promise<{ slug: string }>; // <-- Promise!
}

async function getPost(slug: string, userId?: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatarUrl: true, id: true },
        },
        category: {
          select: { name: true, slug: true, id: true }, // Lấy cả 'id'
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          include: {
            user: {
              select: { name: true, avatarUrl: true, id: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return null;
    }

    const likeCount = post.likes.length;
    const userHasLiked = userId
      ? post.likes.some((like) => like.userId === userId)
      : false;

    return {
      ...post,
      likeCount,
      userHasLiked,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
interface User {
  name: string;
  avatarUrl?: string;
}
// Trang Server Component

/**
 * HÀM 2: Lấy các bài viết liên quan (MỚI)
 */
async function getRelatedPosts(categoryId: string, currentPostId: string) {
  try {
    return await prisma.blogPost.findMany({
      where: {
        categoryId: categoryId, // Cùng danh mục
        id: { not: currentPostId }, // Trừ bài hiện tại
        published: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 4, // Lấy 4 bài
      select: {
        title: true,
        slug: true,
        thumbnail: true,
        publishedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
}

// Kiểu dữ liệu cho bài viết liên quan
type RelatedPost = {
  title: string;
  slug: string;
  thumbnail: string | null;
  publishedAt: Date | null;
};

/**

 * Component con để hiển thị các bài viết liên quan
 */

function RelatedPostsSidebar({ posts }: { posts: RelatedPost[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Bài viết liên quan
      </h3>
      {posts.length > 0 ? (
        <div className="space-y-5">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="group flex items-center gap-4 transform transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={
                    post.thumbnail ||
                    "https://placehold.co/80x80/e2e8f0/94a3b8?text=Blog"
                  }
                  alt={post.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                    : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Không có bài viết liên quan.
        </p>
      )}
    </div>
  );
}

/**
 * TRANG CHÍNH (Đã cập nhật layout)
 */
export default async function BlogPostPage(props: BlogPostPageProps) {
  const { params } = props;
  const { slug } = await params; // <-- await trước khi dùng

  const session = await auth();
  const currentUserId = session?.user?.id;

  const post = await getPost(slug, currentUserId); // <-- dùng slug đã await

  if (!post) {
    notFound();
  }

  const relatedPosts = post.category
    ? await getRelatedPosts(post.category.id, post.id)
    : [];

  const currentUser = session?.user
    ? {
        name: session.user.name ?? "User",
        // ✅ ĐÃ SỬA: Lấy avatarUrl từ session, khớp với `user-action.ts`
        // Dùng 'as any' để truy cập trường đã được custom trong session
        avatarUrl: (session.user as User).avatarUrl ?? undefined,
      }
    : null;

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen py-8 md:py-12">
      {/* THAY ĐỔI LAYOUT: Chuyển sang max-w-7xl (rộng hơn) */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Nút quay lại (giữ nguyên) */}
        <div className="max-w-4xl ">
          <Link
            href="/blog"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-6 inline-block"
          >
            &larr; Quay lại Blog
          </Link>
        </div>

        {/* THAY ĐỔI LAYOUT: Grid 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* === CỘT NỘI DUNG CHÍNH (TRÁI) === */}
          <div className="lg:col-span-2">
            {/* Khung bài viết chính */}
            <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
              {/* 1. Header (Category, Title, Metadata) */}
              <header className="mb-8">
                {post.category && (
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">
                    {post.category.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-4 mb-5 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {post.author?.avatarUrl ? (
                      <Image
                        src={post.author.avatarUrl}
                        alt={post.author.name ?? "Avatar"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {post.author?.name ?? "Anonymous"}
                    </span>
                  </div>
                  <span className="hidden md:inline">•</span>
                  <time dateTime={post.publishedAt?.toISOString()}>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Chưa công bố"}
                  </time>
                  {post.readTime && (
                    <>
                      <span className="hidden md:inline">•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </>
                  )}
                </div>
              </header>

              {/* 2. Ảnh bìa (Thumbnail) */}
              {post.thumbnail && (
                <div className="my-8 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              )}

              {/* 3. Nội dung bài viết */}
              <div className="text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-wrap leading-relaxed prose prose-lg dark:prose-invert max-w-none">
                <p>{post.content}</p>
              </div>

              {/* 4. Thống kê & Nút Like (Cuối bài viết) */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" />
                    {post.likeCount} {post.likeCount === 1 ? "Like" : "Likes"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments.length}{" "}
                    {post.comments.length === 1 ? "Bình luận" : "Bình luận"}
                  </span>
                </div>
                <LikeButton
                  postId={post.id}
                  initialLikeCount={post.likeCount}
                  userHasLiked={post.userHasLiked}
                  className="flex items-center gap-2 py-2 px-4 rounded-full font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                />
              </div>
            </article>

            {/* 5. Khu vực Bình luận (Tách biệt) */}
            <div
              id="comment-section"
              className="mt-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 lg:p-10"
            >
              <BlogComments
                postId={post.id}
                postSlug={post.slug}
                initialComments={post.comments}
                currentUser={currentUser}
              />
            </div>
          </div>

          {/* === CỘT SIDEBAR (PHẢI) (MỚI) === */}
          <aside className="lg:col-span-1">
            {/* Thêm 'sticky' để sidebar đi theo khi cuộn */}
            <div className="lg:sticky lg:top-24 space-y-8">
              {/* Component Bài viết liên quan */}
              <RelatedPostsSidebar posts={relatedPosts} />

              {/* Bạn có thể thêm các widget khác ở đây */}
              {/* <NewsletterSignup /> */}
              {/* <PopularTags /> */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
