import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

/**
 * Trang "Quản lý Sản phẩm" (Server Component)
 * Tự động fetch và hiển thị danh sách sản phẩm
 */
export default async function AdminProductsPage() {
  // 1. Fetch dữ liệu sản phẩm từ CSDL
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      Category: {
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
            Sản phẩm
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Quản lý tất cả sản phẩm trong cửa hàng của bạn.
          </p>
        </div>
        <Link
          href="/admin/dashboard/products/new" // Link đến trang "Tạo mới"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </header>

      {/* Bảng Hiển thị Sản phẩm */}
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
                      Sản phẩm
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
                      Giá
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Tồn kho
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
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Tên sản phẩm & Ảnh */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              className="h-10 w-10 rounded-md object-cover"
                              src={
                                product.images[0] ||
                                "https://placehold.co/40x40/e2e8f0/94a3b8?text=Img"
                              }
                              alt={product.name}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Danh mục */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {product.Category?.name || "N/A"}
                      </td>
                      {/* Giá */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </td>
                      {/* Tồn kho */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {product.inventory}
                      </td>
                      {/* Hành động (Edit/Delete) */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            // ✅ SỬA LỖI: Thêm /admin/ vào trước href
                            href={`/admin/dashboard/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {/* Component Nút Xóa (Client) */}
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Hiển thị nếu không có sản phẩm */}
              {products.length === 0 && (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Không tìm thấy sản phẩm nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//admin/dashboard/products/page.tsx
