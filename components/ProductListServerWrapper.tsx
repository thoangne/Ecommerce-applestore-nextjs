import { getProductCached, GetProductParams } from "@/lib/action";
import React from "react";
import { ProductList } from "./product-list";

interface ProductListServerWrapperProps {
  params: GetProductParams;
}
export async function ProductListServerWrapper({
  params,
}: ProductListServerWrapperProps) {
  const products = await getProductCached(params);
  return <ProductList products={products} />;
}
