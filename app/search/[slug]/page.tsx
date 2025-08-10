import { ProductCardSkeleton } from "@/app/products/ProductCardSkeleton";
import Breadcrumbs from "@/components/breadscums";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type CategoryPageProps = {
  params: { slug: string };
  searchParams?: { sort?: string };
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = params;
  const sort = searchParams?.sort;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
    },
  });

  if (!category) {
    notFound();
  }

  const breadScrumbs = [
    { label: "Home", href: "/" },
    {
      label: category.name,
      href: `/search/${encodeURIComponent(category.slug)}`,
    },
  ];
  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={breadScrumbs}></Breadcrumbs>
      <Suspense
        key={`${category.slug}-${sort}`}
        fallback={<ProductCardSkeleton />}
      >
        <ProductListServerWrapper params={{ slug, sort }} />
      </Suspense>
    </div>
  );
}
