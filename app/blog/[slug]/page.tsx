import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Lấy session
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, MessageCircle, ThumbsUp, UserCircle } from "lucide-react";
import LikeButton from "@/components/blog/LikeButton"; // Import LikeButton của bạn
import BlogComments from "@/components/blog/BlogComment"; // Component Client mới

// Định nghĩa kiểu cho params
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Hàm fetch dữ liệu
async function getPost(slug: string, userId?: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatarUrl: true, id: true },
        },
        category: {
          select: { name: true, slug: true },
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
          orderBy: { createdAt: "asc" }, // Sắp xếp bình luận
        },
      },
    });

    if (!post) {
      return null;
    }

    // Xử lý dữ liệu
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

// Trang Server Component
export default async function BlogPostPage(props: BlogPostPageProps) {
  const session = await auth();
  const { params } = props;
  const currentUserId = session?.user?.id;

  const post = await getPost(params.slug, currentUserId);

  if (!post) {
    notFound(); // Trả về 404 nếu không tìm thấy bài viết
  }

  // Lấy thông tin user hiện tại (để truyền cho component comment)
  const currentUser = session?.user
    ? {
        name: session.user.name ?? "User",
        // ✅ ĐÃ SỬA: Lấy avatarUrl từ session, khớp với `user-action.ts`
        // Dùng 'as any' để truy cập trường đã được custom trong session
        avatarUrl: (session.user as any).avatarUrl ?? undefined,
      }
    : null;

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Nút quay lại */}
        <Link
          href="/blog"
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-4 inline-block px-4 md:px-0"
        >
          &larr; Quay lại Blog
        </Link>

        {/* Khung bài post kiểu Facebook */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          {/* 1. Header bài post */}
          <div className="p-4 flex items-center gap-3">
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name ?? "Avatar"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-400" />
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {post.author?.name ?? "Anonymous"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Chưa công bố"}
              </p>
            </div>
          </div>

          {/* 2. Nội dung bài post */}
          <div className="px-4 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {post.title}
            </h1>
            {/* Thẻ tag */}
            {post.category && (
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2.5 py-0.5 rounded-full">
                {post.category.name}
              </span>
            )}
            {/* Thêm thời gian đọc */}
            {post.readTime && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-3">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            )}

            {/* Nội dung chính */}
            <p className="text-gray-700 dark:text-gray-300 mt-4 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* 3. Ảnh thumbnail (nếu có) */}
          {post.thumbnail && (
            <div className="w-full bg-gray-200 dark:bg-gray-700">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={720}
                height={405}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {/* 4. Thống kê (Like/Comment) */}
          <div className="px-4 py-3 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4 text-blue-500" />
              {post.likeCount}
            </span>
            <span>{post.comments.length} bình luận</span>
          </div>

          {/* 5. Hàng Nút Action (Like / Comment) */}
          <div className="border-t border-b border-gray-200 dark:border-gray-700 grid grid-cols-2">
            {/* Nút Like (Client Component) */}
            <LikeButton
              postId={post.id}
              initialLikeCount={post.likeCount}
              userHasLiked={post.userHasLiked}
              // Tùy chỉnh class cho nút to hơn
              className={`flex items-center justify-center gap-2 py-2 text-base font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                post.userHasLiked
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            />
            {/* Nút Bình luận (chỉ là anchor) */}
            <a
              href="#comment-section"
              className="flex items-center justify-center gap-2 py-2 text-base font-semibold text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MessageCircle className="w-5 h-5" />
              Bình luận
            </a>
          </div>

          {/* 6. Khu vực Bình luận (Client Component mới) */}
          <div id="comment-section" className="p-4">
            <BlogComments
              postId={post.id}
              postSlug={post.slug}
              initialComments={post.comments}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
