import Breadcrumbs from "@/components/breadscums";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
import React, { Suspense } from "react";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

const page = () => {
  const breadScrumbs = [{ label: "All", href: "/products" }];

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={breadScrumbs}></Breadcrumbs>
      <Suspense key={``} fallback={<ProductCardSkeleton />}>
        <ProductListServerWrapper params={{}} />
      </Suspense>
    </div>
  );
};

export default page;
