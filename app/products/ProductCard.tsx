import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
//TODO: FIX ADDCART BUTTON TO WORK WITH SERVER ACTION
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card
      key={product?.id}
      className="border rounded-lg shadow-md transition duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      <CardContent>
        <Link href={`/products/${product.slug}`} className="no-underline">
          <div className=" relative aspect-video rounded-lg overflow-hidden">
            {product.image && (
              <Image
                alt={product.name}
                src={product.image}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                fill
              />
            )}
          </div>
        </Link>
      </CardContent>

      <CardHeader>
        <Link href={`/products/${product.slug}`} className="no-underline">
          <CardTitle>{product?.name}</CardTitle>
        </Link>
        <CardDescription>{product?.description}</CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-semibold">
          {formatPrice(product?.price)}
        </span>
        <CardAction>
          <AddToCartButton product={product} />
        </CardAction>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
