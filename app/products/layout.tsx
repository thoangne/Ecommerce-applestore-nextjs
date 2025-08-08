import { CategorySidebar } from "@/components/category-sidebar";
import SortingControls from "@/components/sorting-controls";
import { prisma } from "@/lib/prisma";
import React, { Suspense } from "react";

async function CategorySidebarServerWrapper() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <CategorySidebar categories={categories} />;
}
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto p-4">
      <div className="flex gap-8">
        <div className="w-[125px] hidden lg:block flex-none">
          <Suspense fallback={<div className="w-[125px]">Loading...</div>}>
            <CategorySidebarServerWrapper />
          </Suspense>
        </div>
        <div className="flex-1">{children}</div>
        <div className="w-[125px] hidden lg:block flex-none">
          <Suspense fallback={<div className="w-[125px]">Loading...</div>}>
            <SortingControls />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
