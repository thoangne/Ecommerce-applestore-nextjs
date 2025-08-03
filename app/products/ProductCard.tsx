import { Button } from "@/components/ui/button";
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

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.slug}`} className="no-underline">
      <Card key={product?.id} className="border rounded-lg shadow-md  ">
        <CardContent>
          <div className=" relative aspect-video rounded-lg overflow-hidden">
            <Image
              alt={product?.name}
              src={product?.image || ""}
              className=" object-cover "
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              fill
            />
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>{product?.name}</CardTitle>
          <CardDescription>{product?.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
          <span className="text-lg font-semibold">
            {formatPrice(product?.price)}
          </span>
          <CardAction>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
              Add to Cart
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
