"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toogle";
import MobileNav from "./mobileNav";
import SearchInput from "./search-input";
import { CartIndicator } from "./cart-indicator";
import AuthStatus from "./auth-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Notification from "./notification";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

export default function NavBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          <Link
            className="text-2xl font-bold hidden md:block tracking-tight"
            href="/"
          >
            ICorner
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* ✅ Loading skeleton UI */}
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-16 h-5 rounded-md bg-muted-foreground/20"
                  />
                ))
              : categories.map((cat) => (
                  <DropdownMenu
                    key={cat.id}
                    onOpenChange={(isOpen) =>
                      setOpenMenu(isOpen ? cat.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`
                          relative flex items-center gap-1 px-1 py-2
                          text-sm font-medium transition-all duration-200
                          hover:text-foreground text-muted-foreground
                          ${openMenu === cat.id ? "text-foreground" : ""}
                        `}
                      >
                        <span className="whitespace-nowrap">{cat.name}</span>

                        <motion.span
                          animate={{ rotate: openMenu === cat.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-[10px] mt-[1px]"
                        >
                          <ChevronDown size={12} />
                        </motion.span>

                        {openMenu === cat.id && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground rounded-full"
                          />
                        )}
                      </button>
                    </DropdownMenuTrigger>

                    {cat.subcategories.length > 0 && (
                      <DropdownMenuContent
                        align="start"
                        sideOffset={8}
                        className="
                          rounded-xl shadow-lg border border-border/40 bg-background/95
                          min-w-[180px] p-2
                          backdrop-blur-sm animate-in fade-in-0 zoom-in-95
                        "
                      >
                        {cat.subcategories.map((sub) => (
                          <DropdownMenuItem key={sub.id} asChild>
                            <Link
                              href={`/search/${sub.slug}`}
                              className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-all"
                            >
                              {sub.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                ))}
          </nav>

          <MobileNav />
        </div>

        {/* CENTER - SEARCH */}
        <div className="w-full max-w-sm mx-4 hidden md:block">
          <SearchInput />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:gap-4">
          <Notification />
          <AuthStatus />
          <CartIndicator />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
