"use client";
import { Product } from "@prisma/client";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/action";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdded(true);
      await addToCart(product.id);
    } catch {
      console.log("Error adding to cart");
    } finally {
      setIsAdded(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.inventory === 0 || isAdded}
      className="w-full hover:cursor-pointer"
    >
      <ShoppingCart className="mr-2 w-4 h-4" />
      {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
