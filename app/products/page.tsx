import Breadcrumbs from "@/components/breadscums";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React, { Suspense } from "react";
import { getProductsCountCached } from "@/lib/action";

export default async function ProductsPage(props: {
  searchParams: { page?: string };
}) {
  // 🔹 Lấy query params từ URL
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 9;

  // 🔹 Lấy tổng số sản phẩm (dùng cache hoặc query DB)
  const totalProducts = await getProductsCountCached();
  const totalPages = Math.ceil(totalProducts / pageSize);

  // 🔹 Breadcrumb
  const breadScrumbs = [{ label: "All Products", href: "/products" }];

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={breadScrumbs} />

      {/* ==== Danh sách sản phẩm ==== */}
      <Suspense key={page} fallback={<ProductCardSkeleton />}>
        <ProductListServerWrapper params={{ page, pageSize }} />
      </Suspense>

      {/* ==== Phân trang ==== */}
      <Pagination className="mt-8">
        <PaginationContent>
          {/* Nút lùi */}
          {page > 1 ? (
            <PaginationPrevious href={`/products?page=${page - 1}`} />
          ) : (
            <span className="text-gray-400 px-3 py-1">Prev</span>
          )}

          {/* Trang đầu */}
          {page > 3 && (
            <>
              <PaginationItem>
                <PaginationLink href={`/products?page=1`}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/products?page=2`}>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <span>...</span>
              </PaginationItem>
            </>
          )}

          {/* Các trang xung quanh trang hiện tại */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (pageNumber >= page - 1 && pageNumber <= page + 1) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={`/products?page=${pageNumber}`}
                    className={`${
                      page === pageNumber
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                        : ""
                    }`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}

          {/* Trang cuối */}
          {page < totalPages - 2 && (
            <>
              <PaginationItem>
                <span>...</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/products?page=${totalPages}`}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Nút tiến */}
          {page < totalPages ? (
            <PaginationNext href={`/products?page=${page + 1}`} />
          ) : (
            <span className="text-gray-400 px-3 py-1">Next</span>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
