"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBlogPost } from "@/lib/action/blog"; // Import action mới
import { toast } from "sonner";

interface DeleteBlogPostButtonProps {
  postId: string;
}

export function DeleteBlogPostButton({ postId }: DeleteBlogPostButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // 1. Hiển thị xác nhận
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      return;
    }

    // 2. Gọi Server Action
    startTransition(async () => {
      const result = await deleteBlogPost(postId);

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
      aria-label="Xóa bài viết"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
