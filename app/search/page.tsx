"use server";
import Breadcrumbs from "@/components/breadscums";
import { prisma } from "@/lib/prisma";
import React, { Suspense } from "react";
import ProductCard from "../products/ProductCard";
import { ProductCardSkeleton } from "../products/ProductCardSkeleton";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";

type SearchPageProps = {
  searchParams: Promise<{ query?: string; sort?: string }>;
};

async function Products({ query, sort }: { query?: string; sort?: string }) {
  let orderBy: Record<string, "asc" | "desc" | undefined> = {};

  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    ...(orderBy ? { orderBy } : {}),
    take: 18,
  });
  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No products found for <span className="font-semibold">{query}</span>.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

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
