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

// async function Products({ slug, sort }: { slug: string; sort?: string }) {
//   let orderBy: Record<string, "asc" | "desc" | undefined> = {};

//   if (sort === "price-asc") {
//     orderBy = { price: "asc" };
//   } else if (sort === "price-desc") {
//     orderBy = { price: "desc" };
//   }

//   const products = await prisma.product.findMany({
//     where: {
//       Category: {
//         slug: slug,
//       },
//     },
//     ...(orderBy ? { orderBy } : {}),
//     skip: 0,
//     take: 18,
//   });
//   await delay(1000);
//   if (products.length === 0) {
//     return (
//       <p className="text-center text-gray-500">
//         No products found for <span className="font-semibold">{slug}</span>.
//       </p>
//     );
//   }
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }

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
