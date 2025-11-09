"use client";

import { useState, useTransition } from "react";
import { toggleBlogLike } from "@/lib/action/blog"; // Đảm bảo đường dẫn này đúng
import { ThumbsUp } from "lucide-react";

// 1. Định nghĩa props interface rõ ràng
interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  userHasLiked: boolean;
  className?: string; // 2. Thêm 'className' làm prop tùy chọn
}

export default function LikeButton({
  postId,
  initialLikeCount,
  userHasLiked,
  className, // 3. Lấy 'className' từ props
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [hasLiked, setHasLiked] = useState(userHasLiked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Dùng useTransition để cập nhật UI mượt mà
    startTransition(async () => {
      // 4. Logic cập nhật UI ngay lập tức (Optimistic Update)
      const newLiked = !hasLiked;
      setHasLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

      try {
        const result = await toggleBlogLike(postId);
        // 5. Xử lý lỗi nếu server action trả về { error: "..." }
        if (result && result.error) {
          throw new Error(result.error);
        }
      } catch (err: any) {
        // 6. Hoàn tác lại UI nếu có lỗi
        setHasLiked(!newLiked);
        setLikeCount((prev) => (newLiked ? prev - 1 : prev + 1));
        // Dùng alert hoặc toast để báo lỗi
        alert(err.message || "Vui lòng đăng nhập để like bài viết");
      }
    });
  };

  // 7. Xác định class màu dựa trên state nội bộ (hasLiked)
  const colorClasses = hasLiked
    ? "text-blue-600 dark:text-blue-400"
    : "text-gray-600 dark:text-gray-400";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      // 8. Kết hợp 'className' truyền vào (layout) và class màu nội bộ (state)
      className={`${className} ${colorClasses}`}
    >
      <ThumbsUp className="w-5 h-5" />
      <span>{likeCount}</span>
    </button>
  );
}
