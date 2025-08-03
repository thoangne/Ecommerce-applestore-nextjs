import { Menu } from "lucide-react";
import React from "react";
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
  { name: "Electronics", href: "/products/electronics" },
  { name: "Books", href: "/products/books" },
  { name: "Clothing", href: "/products/clothing" },
];

export default function MobileNav() {
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

        <nav className="flex flex-col gap-4 mt-4">
          <SheetClose asChild>
            <Link href="/">Home</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/products">Products</Link>
          </SheetClose>
          <div>
            <h3 className="text-xs font-medium mb-2 text-muted-foreground">
              Category
            </h3>
            {Category.map((category) => (
              <SheetClose asChild key={category.name}>
                <Link
                  className="text-sm font-medium text-muted-foreground hover-text-foreground/80 transition-colors duration-200"
                  href={category.href}
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
