"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
type Category = {
  name: string;
  slug: string;
};
type Props = {
  categories: Category[];
};
export function CategorySidebar({ categories }: Props) {
  const params = useParams();
  const activeCategory = (params.slug as string) || "";
  return (
    <div className="w-[125px] flex-none mt-4">
      <h3 className="text-sm text-muted-foreground mb-2">Collection</h3>
      <ul className="flex flex-col gap-2">
        {categories.map((category) => (
          <li
            key={category.slug}
            className={`text-sm font-medium hover:text-primary ${
              activeCategory === category.slug
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Link href={`/search/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
