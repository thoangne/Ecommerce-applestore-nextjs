"use client";
import { Product } from "@prisma/client";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/action";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles adding a product to the cart.
   * Sets the `isAdded` state to true while the add to cart operation is in progress.
   * Calls the `addToCart` function with the product ID.
   * Logs an error message if the operation fails.
   * Resets the `isAdded` state to false once the operation is complete.
   */

  /*******  69bd5c9c-7eac-4881-a768-84c1f9187e36  *******/ const handleAddToCart =
    async () => {
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
