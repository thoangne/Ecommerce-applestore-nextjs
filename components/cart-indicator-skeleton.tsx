import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function CartIndicatorSkeleton() {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      asChild
      className="relative opacity-50"
      disabled
    >
      <Link href="/cart">
        <ShoppingCart className="w-4 h-4" />
      </Link>
    </Button>
  );
}
