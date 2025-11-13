"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/action/admin";
// Giả sử bạn dùng 'sonner' để hiển thị thông báo (toast)
// Nếu không, bạn có thể dùng alert()
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // 1. Hiển thị xác nhận
    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
      return;
    }

    // 2. Gọi Server Action
    startTransition(async () => {
      const result = await deleteUser(userId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
      aria-label="Xóa khách hàng"
    >
      {isPending ? (
        <span className="animate-spin text-sm">...</span> // Hoặc một icon loading
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
