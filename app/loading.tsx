import BreadcrumbsSkeleton from "@/components/breadscums-skeleton";
import ProductSkeleton from "./products/ProductSkeleton";
export default function Loading() {
  return (
    <main className="container mx-auto py-4">
      <BreadcrumbsSkeleton />
      <ProductSkeleton />
    </main>
  );
}
