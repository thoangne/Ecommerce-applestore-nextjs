"use client";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useCart } from "@/lib/use-cart";

function CartButton({ children }: { children: React.ReactNode }) {
  return (
    <Button variant={"ghost"} size={"icon"} asChild className="relative">
      <Link href="/cart">{children}</Link>
    </Button>
  );
}

export function CartIndicator() {
  const { itemCount, isLoading } = useCart();

  if (isLoading) {
    return (
      <CartButton>
        <ShoppingCart className="w-4 h-4" />
      </CartButton>
    );
  }

  return (
    <CartButton>
      <ShoppingCart className="w-4 h-4" />
      {itemCount > 0 && (
        <span
          className="absolute top-0 right-0 
          inline-flex items-center justify-center w-4
           h-4 text-xs font-semibold text-white bg-red-500
            rounded-full"
        >
          {itemCount}
        </span>
      )}
    </CartButton>
  );
}
