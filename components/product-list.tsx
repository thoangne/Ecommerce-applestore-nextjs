"use client";

import ProductCard from "@/app/products/ProductCard";
import { Product } from "@prisma/client";

export type ProductListProps = {
  products: Product[];
};
export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products found</p>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
