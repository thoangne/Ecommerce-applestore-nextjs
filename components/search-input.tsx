"use client";
import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
type ProductSearchResult = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  Category?: {
    name: string;
  };
};

export default function SearchInput() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);

      const res = await fetch(`/api/search?query=${query}`, {
        signal: controller.signal,
      });

      const data = await res.json();
      setResults(data);
      setOpen(true);
      setLoading(false);
      setHighlight(0);
    }

    const timeout = setTimeout(fetchData, 350); // debounce
    return () => {
      clearTimeout(timeout);
      try {
        controller.abort();
      } catch {}
    };
  }, [query]);

  // click outside → hide
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?query=${trimmedQuery}`);
    } else {
      router.push("/search");
    }
    setOpen(false);
  };

  // keyboard ↑↓ + enter
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((prev) => (prev + 1) % results.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((prev) => (prev - 1 + results.length) % results.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/products/${results[highlight].slug}`);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form className="relative w-full" onSubmit={handleSearch}>
        <SearchIcon className="-translate-y-1/2 w-4 h-4 absolute text-muted-foreground left-2 top-1/2" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-10"
          value={query}
          onKeyDown={onKeyDown}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
        />
      </form>

      {open && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {/* Loading Skeleton */}
          {loading && (
            <div className="p-3 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
                    <div className="w-1/4 h-4 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query.trim() !== "" && (
            <div className="p-4 text-sm text-muted-foreground">
              No results found
            </div>
          )}

          {/* Results */}
          {!loading &&
            results.length > 0 &&
            results.map((item, index) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className={clsx(
                  "flex gap-3 p-2 items-center cursor-pointer transition",
                  index === highlight
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setOpen(false)}
              >
                <Image
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                  width={100}
                  height={50}
                />
                <div className="flex flex-col text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.Category?.name}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
