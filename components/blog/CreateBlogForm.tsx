"use client";

import { useRef, useState } from "react"; // (useRef đã có sẵn)
import { createBlogPost } from "@/lib/action/blog";

export default function CreateBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Tạo một ref cho form
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createBlogPost(formData);

      // 2. Xử lý lỗi do server action trả về (cải thiện)
      if (result && result.error) {
        throw new Error(result.error);
      }

      if (result && result.success) {
        alert("Tạo bài viết thành công!");

        // 3. Sử dụng ref để reset form (SỬA LỖI)
        // e.currentTarget.reset(); // <-- Dòng cũ gây lỗi
        formRef.current?.reset(); // <-- Dòng mới, an toàn
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 4. Gắn ref vào thẻ form
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Tiêu đề *</label>
        <input
          name="title"
          required
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Mô tả ngắn</label>
        <textarea
          name="excerpt"
          rows={2}
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Nội dung *</label>
        <textarea
          name="content"
          required
          rows={10}
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Ảnh thumbnail</label>
        <input
          name="thumbnail"
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">Thời gian đọc (VD: 5 phút đọc)</label>
        <input
          name="readTime"
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1">ID danh mục (nếu có)</label>
        <input
          name="categoryId"
          placeholder="cuid của BlogCategory"
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {isSubmitting ? "Đang tạo..." : "Tạo bài viết"}
      </button>
    </form>
  );
}
