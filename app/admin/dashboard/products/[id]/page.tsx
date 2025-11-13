import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface EditProductPageProps {
  params: {
    id: string; // [id] từ URL
  };
}

/**
 * Trang "Sửa sản phẩm"
 * Đây là Server Component, nó fetch sản phẩm hiện tại và danh mục
 */
export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = params;

  // Lấy dữ liệu song song
  const [product, categories] = await Promise.all([
    // 1. Lấy sản phẩm cần sửa
    prisma.product.findUnique({
      where: { id },
    }),

    // ✅ SỬA LỖI: Chỉ lấy danh mục CON
    prisma.category.findMany({
      where: {
        parentId: {
          not: null, // Chỉ lấy danh mục con
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  // Nếu không tìm thấy sản phẩm, trả về 404
  if (!product) {
    notFound();
  }

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
            Sửa sản phẩm
          </h1>
          <p className="text-gray-500 dark:text-gray-400 truncate max-w-lg">
            {product.name}
          </p>
        </div>
      </header>

      {/* Form (Client Component) */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg dark:border dark:border-gray-800">
        <ProductForm
          categories={categories}
          product={product} // Truyền dữ liệu sản phẩm hiện tại vào form
        />
      </div>
    </div>
  );
}
