"use client";
import { Product } from "@prisma/client";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/action";
import { useState } from "react";
import { mutate } from "swr";
import { toast } from "sonner";

export function AddToCartButton({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdded(true);
      await addToCart(product.id);
      toast.success("Product added to cart!");
      mutate("/api/cart");
    } catch {
      console.error("Error adding to cart");
      toast.error("Error adding to cart");
    } finally {
      setIsAdded(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.inventory === 0 || isAdded}
      className="w-full hover:cursor-pointer sm:w-auto"
    >
      <ShoppingCart className="mr-2 w-4 h-4" />
      {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
