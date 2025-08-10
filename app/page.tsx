import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductSkeleton from "./products/ProductSkeleton";
import Breadcrumbs from "@/components/breadscums";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 8;
  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <main className="container mx-auto p-4">
      <Breadcrumbs items={[{ label: "Home", href: "/" }]} />
      <Suspense key={page} fallback={<ProductSkeleton />}>
        <ProductListServerWrapper params={{ page, pageSize }} />
      </Suspense>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationPrevious href={`?page=${page - 1}`} />

          {page > 3 && (
            <>
              <PaginationItem key={0}>
                <PaginationLink href={`?page=1`}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem key={1}>
                <PaginationLink href={`?page=2`}>2</PaginationLink>
              </PaginationItem>
              <PaginationItem key={2}>
                <span>...</span>
              </PaginationItem>
            </>
          )}

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (pageNumber >= page - 1 && pageNumber <= page + 1) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    href={`?page=${pageNumber}`}
                    className={page === pageNumber ? "active" : ""}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return null;
          })}

          {page < totalPages - 2 && (
            <>
              <PaginationItem key={totalPages - 1}>
                <span>...</span>
              </PaginationItem>
              <PaginationItem key={totalPages}>
                <PaginationLink href={`?page=${totalPages}`}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationNext href={`?page=${page + 1}`} />
        </PaginationContent>
      </Pagination>
    </main>
  );
}
