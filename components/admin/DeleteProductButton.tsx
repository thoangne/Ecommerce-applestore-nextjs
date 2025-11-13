"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/lib/action/product"; // Import Server Action
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

/**
 * Nút Xóa (Client Component)
 * Gọi Server Action 'deleteProduct'
 */
export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // Hỏi xác nhận trước khi xóa
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      startTransition(async () => {
        const result = await deleteProduct(productId);

        if (result.success) {
          toast.success(result.success);
        } else if (result.error) {
          toast.error(result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
