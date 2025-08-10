import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { getCart } from "@/lib/action";
import Link from "next/link";

export async function CartIndicator() {
  const cart = await getCart();
  const cartSize = cart?.size ?? 0;
  return (
    <Button variant={"ghost"} size={"icon"} asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="w-4 h-4" />
        {cartSize > 0 && (
          <span
            className="absolute top-0 right-0 
          inline-flex items-center justify-center w-4
           h-4 text-xs font-semibold text-white bg-red-500
            rounded-full"
          >
            {cartSize}
          </span>
        )}
      </Link>
    </Button>
  );
}
