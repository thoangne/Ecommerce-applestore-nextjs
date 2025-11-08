// components/blog/InteractiveBlogSlider.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // ✅ Sửa đường dẫn
import Link from "next/link";
import LikeButton from "./LikeButton"; // ✅ Đảm bảo file tồn tại

interface EnrichedBlogPost {
  id: string;
  title: string;
  slug: string; // ✅ Thêm slug
  excerpt: string | null;
  thumbnail: string | null;
  category: { name: string } | null;
  publishedAt: Date | null; // ✅ Cho phép null
  readTime: string | null;
  author: { name: string | null; avatarUrl: string | null } | null;
  likeCount: number;
  userHasLiked: boolean;
}

export default async function InteractiveBlogSlider() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true, avatarUrl: true } },
      category: { select: { name: true } },
      likes: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  const enrichedPosts: EnrichedBlogPost[] = posts.map((post) => ({
    ...post,
    likeCount: post.likes.length,
    userHasLiked: currentUserId
      ? post.likes.some((like) => like.userId === currentUserId)
      : false,
  }));

  if (enrichedPosts.length === 0) {
    return <div className="text-center py-10">Chưa có bài viết nào.</div>;
  }

  return (
    <section className="py-12">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
        Blog công nghệ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {enrichedPosts.map((post) => (
          <div
            key={post.id}
            className="border rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900"
          >
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {post.category?.name || "Blog"}
              </span>
              <h2 className="text-xl font-bold mt-2 mb-2">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                    : "Chưa công bố"}
                </span>
                <span>{post.readTime}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <LikeButton
                  postId={post.id}
                  initialLikeCount={post.likeCount}
                  userHasLiked={post.userHasLiked}
                />
                <Link
                  href={`/blog/${post.slug}`} // ✅ slug đã có trong interface
                  className="text-black dark:text-white hover:underline"
                >
                  Đọc tiếp →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//interactiveblogslider.tsx
