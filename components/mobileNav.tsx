"use client";

import { Menu, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";

const Category = [
  { name: "All", href: "/products" },
  { name: "Iphone", href: "/search/iphone " },
  { name: "Ipad", href: "/search/ipad" },
  { name: "Macbook", href: "/search/macbook" },
  { name: "Apple Watch", href: "/search/apple-watch" },
  { name: "Airpods", href: "/search/airpods" },
];

export default function MobileNav() {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-2   text-muted-foreground hover:text-foreground font-medium">
          <SheetClose asChild>
            <Link className="px-1 py-2" href="/">
              Home
            </Link>
          </SheetClose>

          {/* Trigger for product dropdown */}
          <button
            className="flex items-center justify-between text-left w-full px-1 py-2 font-medium text-muted-foreground hover:text-foreground transition-all duration-200"
            onClick={() => setShowCategories(!showCategories)}
          >
            <span>Products</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showCategories ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Category list */}
          <div
            className={`pl-4 flex flex-col gap-1 ease-in-out transition-all duration-200 ${
              showCategories
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            {showCategories &&
              Category.map((category) => (
                <SheetClose asChild key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {category.name}
                  </Link>
                </SheetClose>
              ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
