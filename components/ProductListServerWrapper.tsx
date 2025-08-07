import { GetProductParams, getProducts } from "@/lib/action";
import { delay } from "@/lib/utils";
import React from "react";
import { ProductList } from "./product-list";

interface ProductListServerWrapperProps {
  params: GetProductParams;
}
export async function ProductListServerWrapper({
  params,
}: ProductListServerWrapperProps) {
  await delay(1000);
  const products = await getProducts(params);
  return <ProductList products={products} />;
}
