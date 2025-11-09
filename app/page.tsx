import React from "react";
import Breadcrumbs from "@/components/breadscums";
import { getProductsByCategory } from "@/lib/action";
import Carousel from "../components/carousel";
import ExpandableGallery from "../components/gallery";
import AppleBanner from "../components/banner";
import ProductCarouselGallery from "@/components/ProductCarouselGallery";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const ipad = await getProductsByCategory("Ipad");
  const macbook = await getProductsByCategory("Macbook");
  console.log("ipad", ipad);
  console.log("macbook", macbook);
  return (
    <main className="container mx-auto p-4">
      <Breadcrumbs items={[{ label: "Home", href: "/" }]} />
      <AppleBanner />
      <Carousel />
      <ExpandableGallery />
      <ProductCarouselGallery products={ipad} title="Ipad" />
      <ProductCarouselGallery products={macbook} title="Macbook" />
      <ProductCarouselGallery
        products={macbook}
        title="Có thể bạn cũng thích"
      />
    </main>
  );
}
// page.tsx
