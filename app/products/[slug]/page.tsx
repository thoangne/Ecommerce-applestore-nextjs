import Breadcrumbs from "@/components/breadscums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug } from "@/lib/action";
import { delay, formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
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
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  console.log("Product:", product);
  if (!product) {
    return notFound();
  }
  const breadcrumbItems = [
    { label: "Products", href: "/products", active: false },
    {
      label: product.Category?.name,
      href: `/category/${product.slug}`,
      active: true,
    },
    { label: product.name, href: `/products/${product.slug}`, active: true },
  ];
  // await delay(3000); // Simulate loading delay
  return (
    <main className="container mx-auto p-4">
      <Breadcrumbs items={breadcrumbItems} />

      <Card className="">
        <CardContent className="p-6 grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <div className=" relative aspect-[6/3] rounded-lg overflow-hidden mb-4">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  priority
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover "
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
              <Badge variant={"outline"}>{product.Category?.name}</Badge>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h2 className="font-medium">Description</h2>
              <p>{product.description} </p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h2 className="font-medium">Availability</h2>
              <div className="flex items-center gap-2">
                {product.inventory > 0 ? (
                  <Badge variant={"outline"} className="text-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant={"outline"} className="text-red-600">
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
              <Button
                disabled={product.inventory === 0}
                className="w-full hover:cursor-pointer"
              >
                <ShoppingCart className="mr-2 w-4 h-4" />
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default page;
