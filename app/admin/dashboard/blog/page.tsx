import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { DeleteBlogPostButton } from "@/components/admin/DeleteBlogPostButton"; // (Sẽ tạo ở Bước 4)

/**
 * Trang "Quản lý Blog" (Server Component)
 */
export default async function AdminBlogPage() {
  // 1. Fetch dữ liệu bài viết
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: {
      category: {
        // Lấy thông tin danh mục liên quan
        select: { name: true },
      },
    },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header (Tiêu đề và Nút "Add") */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Quản lý tất cả bài viết trên trang của bạn.
          </p>
        </div>
      </header>

      {/* Bảng Hiển thị Bài viết */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:border dark:border-gray-800 overflow-hidden">
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Header Bảng */}
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Bài viết
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Danh mục
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Ngày đăng
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>

                {/* Body Bảng */}
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Tiêu đề & Ảnh */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              className="h-10 w-10 rounded-md object-cover"
                              src={
                                post.thumbnail ||
                                "https://placehold.co/40x40/e2e8f0/94a3b8?text=Img"
                              }
                              alt={post.title}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Danh mục */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {post.category?.name || "N/A"}
                      </td>
                      {/* Ngày đăng */}
                      {/* Ngày đăng */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {post.publishedAt
                          ? format(new Date(post.publishedAt), "dd/MM/yyyy")
                          : "N/A"}
                      </td>
                      {/* Hành động (View/Delete) */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/blog/${post.slug}`} // Link đến trang public
                            target="_blank" // Mở tab mới
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem bài viết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {/* Component Nút Xóa (Client) */}
                          <DeleteBlogPostButton postId={post.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Hiển thị nếu không có bài viết */}
              {posts.length === 0 && (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Không tìm thấy bài viết nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
