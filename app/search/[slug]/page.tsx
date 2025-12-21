import { ProductCardSkeleton } from "@/app/products/ProductCardSkeleton";
import Breadcrumbs from "@/components/breadscums";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
import { getCategoryBySlug } from "@/lib/action";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return {};
  }
  return {
    title: category.name + " - Ecommerce Store",
    description: `Shop ${category.name} products at Ecommerce Store`,
    openGraph: {
      title: `${category.slug} - Ecommerce Store`,
      description: `Shop ${category.slug} products at Ecommerce Store`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/search/${category.slug}`,
      siteName: "Ecommerce Store",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en-US",
      type: "website",
    },
  };
}

export default async function CategoryPage(props: CategoryPageProps) {
  const { slug } = await props.params;
  const searchParams = (await props.searchParams) ?? {};
  const sort = searchParams.sort;

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
      <Breadcrumbs items={breadScrumbs} />
      <Suspense
        key={`${category.slug}-${sort}`}
        fallback={<ProductCardSkeleton />}
      >
        <ProductListServerWrapper params={{ slug, sort }} />
      </Suspense>
    </div>
  );
}
//search/[slug]/page.tsx
