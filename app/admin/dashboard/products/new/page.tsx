import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Trang "Tạo sản phẩm mới"
 * Đây là Server Component, nó sẽ fetch danh mục
 * và truyền xuống cho Form (Client Component)
 */
export default async function NewProductPage() {
  // ✅ SỬA LỖI: Chỉ lấy danh mục SẢN PHẨM (Category),
  // và chỉ lấy danh mục CON (parentId != null)
  const categories = await prisma.category.findMany({
    where: {
      parentId: {
        not: null, // Chỉ lấy danh mục con (MacBook Air, iPad Pro...)
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/products" // Cập nhật href
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tạo sản phẩm mới
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Điền thông tin chi tiết cho sản phẩm.
          </p>
        </div>
      </header>

      {/* Form (Client Component) */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg dark:border dark:border-gray-800">
        {/* Truyền 'categories' (danh mục con) xuống form */}
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
