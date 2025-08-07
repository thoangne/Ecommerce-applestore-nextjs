"use client";
// components/search-input.tsx
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
export default function SearchInput() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    const params = new URLSearchParams();
    if (trimmedQuery) {
      params.set("query", trimmedQuery);
      router.push(`/search?${params.toString()}`);
    } else {
      router.push("/search");
    }
  };
  return (
    <form action="" className="relative w-full" onSubmit={handleSearch}>
      <SearchIcon className="-translate-y-1/2 w-4 h-4 absolute text-muted-foreground left-2 top-1/2" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
