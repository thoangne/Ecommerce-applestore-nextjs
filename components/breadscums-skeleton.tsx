import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function BreadcrumbsSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="h-4 w-[50px]" />
      <Skeleton className="h-4 w-[50px]" />
    </div>
  );
}
