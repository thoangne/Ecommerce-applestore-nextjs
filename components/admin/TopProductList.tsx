"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, ShoppingBag } from "lucide-react";

// Định nghĩa kiểu cho data (lấy từ type của Server Action)
type ProductData = {
  id: string;
  name: string;
  thumbnail: string | null;
  sold: number | null;
};

type TopProductsListProps = {
  data: ProductData[];
};

export default function TopProductsList({ data }: TopProductsListProps) {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-10">
        Không có dữ liệu sản phẩm bán chạy.
      </p>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
      {data.map((product, index) => (
        <li
          key={product.id}
          className="flex items-center py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
        >
          {/* Ảnh thumbnail */}
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <Image
              src={
                product.thumbnail ||
                "https://placehold.co/48x48/e2e8f0/94a3b8?text=Img"
              }
              alt={product.name}
              width={48}
              height={48}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Tên sản phẩm */}
          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                <Link
                  href={`/dashboard/products/${product.id}`} // (Giả sử bạn có trang edit sản phẩm)
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {product.name}
                </Link>
              </h3>
            </div>
            <div className="flex flex-1 items-center justify-between text-xs mt-1">
              {/* Số lượng đã bán */}
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <ShoppingBag className="w-3 h-3 mr-1.5" />
                Đã bán:{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200 ml-1">
                  {product.sold}
                </span>
              </p>
            </div>
          </div>

          {/* Huy hiệu Top (nếu có) */}
          {index === 0 && (
            <span className="ml-2 flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              Top 1
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
