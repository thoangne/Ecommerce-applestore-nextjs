"use server";
import Breadcrumbs from "@/components/breadscums";
import React, { Suspense } from "react";
import { ProductCardSkeleton } from "../products/ProductCardSkeleton";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
type SearchPageProps = {
  searchParams: Promise<{ query?: string; sort?: string }>;
};
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const sort = params.sort;
  const breadScrumbs = [
    { label: "Home", href: "/" },
    {
      label: `Search for ${query}`,
      href: `/search?query=${encodeURIComponent(query)}`,
    },
  ];
  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={breadScrumbs}></Breadcrumbs>
      <Suspense key={`${query}-${sort}`} fallback={<ProductCardSkeleton />}>
        <ProductListServerWrapper params={{ query, sort }} />
      </Suspense>
    </div>
  );
}
