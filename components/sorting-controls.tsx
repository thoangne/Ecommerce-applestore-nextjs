"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export default function SortingControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");

  const createSortUrl = (sortValue: string | null): string => {
    const params = new URLSearchParams(searchParams);
    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }
    const queryString = params.toString();
    return `${pathname}?${queryString ? queryString : ""}`;
  };
  return (
    <div>
      <h3 className="text-sm text-muted-foreground mb-2">Sorting</h3>
      <ul>
        <li>
          <Link
            href={createSortUrl("price-asc")}
            className={cn(
              "text-sm hover:text-primary",
              currentSort === "price-asc" ? "underline" : ""
            )}
          >
            {" "}
            Price: Low to High{" "}
          </Link>
        </li>
        <li>
          <Link
            href={createSortUrl("price-desc")}
            className={cn(
              "text-sm hover:text-primary",
              currentSort === "price-desc" ? "underline" : ""
            )}
          >
            Price: High to Low
          </Link>
        </li>
      </ul>
    </div>
  );
}
