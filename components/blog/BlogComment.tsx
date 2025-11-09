"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UserCircle, Send } from "lucide-react";
import { createComment } from "@/lib/action/blog"; // Import action mới

// Định nghĩa kiểu dữ liệu
type CommentAuthor = {
  name: string | null;
  avatarUrl: string | null;
  id: string | null;
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentAuthor | null;
};

type BlogCommentsProps = {
  postId: string;
  postSlug: string; // Cần để revalidate đúng trang
  initialComments: Comment[];
  currentUser: {
    name: string;
    avatarUrl?: string;
  } | null;
};

// Component con cho Form
function CommentForm({
  postId,
  postSlug,
  currentUser,
}: Pick<BlogCommentsProps, "postId" | "postSlug" | "currentUser">) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Bạn phải đăng nhập để bình luận.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createComment(formData); // Gọi Server Action
      if (result && result.error) {
        throw new Error(result.error);
      }
      formRef.current?.reset(); // Reset form thành công
    } catch (err: any) {
      setError(err.message || "Không thể gửi bình luận.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex items-start gap-3 mt-4"
    >
      {/* Avatar người dùng hiện tại */}
      {currentUser?.avatarUrl ? (
        <Image
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          width={32}
          height={32}
          className="rounded-full mt-1"
        />
      ) : (
        <UserCircle className="w-8 h-8 text-gray-400 mt-1 flex-shrink-0" />
      )}

      {/* Input và các trường ẩn */}
      <div className="flex-1">
        <input
          type="text"
          name="content"
          placeholder="Viết bình luận..."
          required
          disabled={isSubmitting}
          className="w-full bg-gray-100 dark:bg-gray-700 border border-transparent dark:border-gray-600 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="postSlug" value={postSlug} />

        {/* Nút gửi ẩn (enter để gửi), hoặc bạn có thể hiện nó */}
        <button type="submit" disabled={isSubmitting} className="hidden">
          Gửi
        </button>
        {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
      </div>

      {/* Nút Gửi (hiển thị) */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}

// Component chính
export default function BlogComments({
  postId,
  postSlug,
  initialComments,
  currentUser,
}: BlogCommentsProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Bình luận
      </h3>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {initialComments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}

        {initialComments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            {/* Avatar người bình luận */}
            {comment.user?.avatarUrl ? (
              <Image
                src={comment.user.avatarUrl}
                alt={comment.user.name ?? "Avatar"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-400 flex-shrink-0" />
            )}

            {/* Nội dung bình luận */}
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {comment.user?.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {comment.content}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
                {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Form viết bình luận */}
      <CommentForm
        postId={postId}
        postSlug={postSlug}
        currentUser={currentUser}
      />
    </div>
  );
}
