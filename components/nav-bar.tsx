import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toogle";
import { Button } from "./ui/button";
import { Search, ShoppingCart } from "lucide-react";
import MobileNav from "./mobileNav";
import SearchInput from "./search-input";

const Category = [
  { name: "All", href: "/products" },
  { name: "Electronics", href: "/search/electronics" },
  { name: "Apple", href: "/search/apple" },
  { name: "Furniture", href: "/search/furniture" },
];

export default function NavBar() {
  return (
    <div className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div>
          <div className="flex items-center gap-6">
            <Link
              className="text-2xl font-bold hidden md:block lg:block"
              href="/"
            >
              Store
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {Category.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground/80 transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
            <MobileNav />
          </div>
        </div>
        <div className="w-full mx-4 md:mx-8 md:block lg:mx-16 hidden ">
          <SearchInput />
        </div>
        <div className="flex items-center gap-4">
          {/* <Button variant={"ghost"} size={"icon"}>
            <Link href="/search">
              <Search className="w-4 h-4" />
            </Link>
          </Button> */}
          <Button variant={"ghost"} size={"icon"}>
            <Link href="/cart">
              <ShoppingCart className="w-4 h-4" />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
