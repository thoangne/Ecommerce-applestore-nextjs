"use client";

import { useRef, useState, useEffect } from "react";
import { createBlogPost, getBlogCategories } from "@/lib/action/blog"; // Import cả 2 actions

// Định nghĩa kiểu cho danh mục
type BlogCategory = {
  id: string;
  name: string;
};

export default function CreateBlogForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State để lưu danh sách danh mục
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Dùng useEffect để tải danh mục khi component mount
  useEffect(() => {
    async function loadCategories() {
      const result = await getBlogCategories();
      if (result.categories) {
        setCategories(result.categories);
      } else {
        console.error(result.error);
        setError("Không thể tải danh mục blog.");
      }
    }
    loadCategories();
  }, []); // Chạy 1 lần

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await createBlogPost(formData);

      if (result && result.error) {
        throw new Error(result.error);
      }

      if (result && result.success) {
        alert("Tạo bài viết thành công!");
        formRef.current?.reset();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Tiêu đề *</label>
        <input
          name="title"
          required
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        />
      </div>

      {/* --- PHẦN CHỌN DANH MỤC --- */}
      <div>
        <label className="block mb-1">Danh mục *</label>
        <select
          name="categoryId"
          required
          defaultValue=""
          className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
        >
          <option value="" disabled>
            -- Chọn một danh mục --
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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
