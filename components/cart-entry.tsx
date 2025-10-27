"use client";
import { CartItemWithProduct, setProductQuantity } from "@/lib/action";
import Image from "next/image";
import { Button } from "./ui/button";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/use-cart";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
}

export default function CartEntry({ cartItem }: CartEntryProps) {
  const [loading, setLoading] = useState(false);
  const { revalidateCart } = useCart();
  const handleSetProductQuantity = async (quantity: number) => {
    setLoading(true);
    try {
      await setProductQuantity(cartItem.product.id, quantity);
      revalidateCart();
    } catch (error) {
      console.error("Failed to set item quantity", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="border-b border-muted flex py-4 justify-between relative">
      {/* Xóa sản phẩm */}
      <div className="absolute top-2 right-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full w-8 h-8 hover:cursor-pointer bg-muted"
          disabled={loading}
          onClick={() => handleSetProductQuantity(0)}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin  text-muted-foreground" />
          ) : (
            <X className="h-4 w-4 text-muted-foreground " />
          )}
        </Button>
      </div>

      {/* Hình ảnh + thông tin */}
      <div className="flex space-x-4">
        <div className="overflow-hidden rounded-md border border-muted w-28 h-28 flex-shrink-0">
          {cartItem.product.images && (
            <Image
              src={cartItem.product.images[0] ?? "/placeholder.png"}
              alt={cartItem.product.name}
              className="object-cover w-full h-full"
              width={112}
              height={112}
              priority
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold">{cartItem.product.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {cartItem.product.description}
          </p>
          <span className="text-base font-bold mt-2">
            ${cartItem.product.price}
          </span>
        </div>
      </div>

      {/* Số lượng */}
      <div className="flex flex-col items-end justify-center gap-2">
        <div className="flex items-center border border-muted rounded-full overflow-hidden">
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9 hover:bg-gray-100"
            onClick={() => handleSetProductQuantity(cartItem.quantity - 1)}
            disabled={loading || cartItem.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">
            {cartItem.quantity}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9 hover:bg-gray-100"
            onClick={() => handleSetProductQuantity(cartItem.quantity + 1)}
            disabled={
              loading || cartItem.quantity >= cartItem.product.inventory
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}
