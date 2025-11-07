import { AddToCartButton } from "@/components/add-to-cart-button";
import Breadcrumbs from "@/components/breadscums";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug } from "@/lib/action";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const ogImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "";

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export const revalidate = 15;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const breadcrumbItems = [
    { label: "Products", href: "/products", active: false },
    {
      label: product.Category?.name ?? "Category",
      href: `/category/${product.Category?.slug ?? ""}`,
      active: true,
    },
    { label: product.name, href: `/products/${product.slug}`, active: true },
  ];

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: Array.isArray(product.images) ? product.images : [product.images],
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price?.toString(),
      availability: product.inventory > 0 ? "InStock" : "OutOfStock",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}`,
    },
  };

  return (
    <main className="container mx-auto p-4">
      <Breadcrumbs items={breadcrumbItems} />

      <Card>
        <CardContent className="p-6 grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <div className="relative aspect-[6/3] rounded-lg overflow-hidden mb-4">
              {product.images && product.images.length > 0 && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4 gap-2">
              <span className="font-semibold text-lg">
                {formatPrice(product.price)}
              </span>

              <Badge variant="outline">{product.Category?.name}</Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h2 className="font-medium">Description</h2>
              <p>{product.description}</p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h2 className="font-medium">Availability</h2>
              <div className="flex items-center gap-2">
                {product.inventory > 0 ? (
                  <Badge variant="outline" className="text-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600">
                    Out of Stock
                  </Badge>
                )}

                {product.inventory > 0 && (
                  <span className="text-gray-500">
                    {product.inventory} in stock
                  </span>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </CardContent>
      </Card>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="product-jsonld"
      ></script>
    </main>
  );
};

export default page;
