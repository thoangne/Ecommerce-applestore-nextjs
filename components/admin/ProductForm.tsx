"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/action/product";
import { toast } from "sonner";
import { Category, Product } from "@prisma/client";
import { ProductSchema } from "@/lib/schemas";
import { z } from "zod";
import Image from "next/image";
import { Prisma } from "@prisma/client"; // Import kiểu JsonValue

// Định nghĩa kiểu cho lỗi validation
type FieldErrors = z.inferFlattenedErrors<typeof ProductSchema>["fieldErrors"];

// ✅ THÊM: Định nghĩa kiểu trả về của Action
type FormResult = {
  success?: string;
  error?: string;
  fieldErrors?: FieldErrors;
  newProductId?: string; // Sẽ dùng để redirect
};

type ProductFormProps = {
  categories: Category[];
  product?: Product | null;
};

// Hàm trợ giúp để format ngày (YYYY-MM-DD)
const formatDateForInput = (date: Date | null | undefined) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

// Hàm trợ giúp để format JSON
const formatJsonForInput = (json: Prisma.JsonValue | null | undefined) => {
  if (!json) return "";
  try {
    // Chuyển JSON thành string, thụt lề 2 dấu cách
    return JSON.stringify(json, null, 2);
  } catch {
    return String(json); // Fallback nếu nó không phải JSON
  }
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images || []
  );

  const isEditMode = Boolean(product);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ SỬA LỖI 1: Thêm dòng này để ngăn GET
    setErrors(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        let result: FormResult; // ✅ Sửa: Dùng kiểu FormResult
        if (isEditMode) {
          result = await updateProduct(product!.id, formData); // Dùng ! vì isEditMode đã check
        } else {
          result = await createProduct(formData);
        }

        // ✅ SỬA LỖI 2: Đảo ngược logic. Kiểm tra 'success' TRƯỚC.
        if (result?.success) {
          toast.success(result.success);

          // ✅ SỬA LỖI: Client xử lý redirect
          if (!isEditMode && result.newProductId) {
            // Dùng router.push để chuyển trang
            router.push(`/admin/dashboard/products/${result.newProductId}`);
          }
        }
        // Nếu không success, THÌ MỚI kiểm tra 'error'
        else if (result?.error) {
          if (result.fieldErrors) {
            setErrors(result.fieldErrors);
          } else {
            toast.error(result.error);
          }
        }
      } catch (err) {
        toast.error("Đã xảy ra lỗi không mong muốn.");
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... (Toàn bộ phần JSX của form giữ nguyên) ... */}
      {/* ... (Tên sản phẩm) ... */}
      {/* ... (Mô tả) ... */}
      {/* ... (Thông số Specs) ... */}
      {/* ... (Giá, Tồn kho, Màu, Dung lượng) ... */}
      {/* ... (Cột phải: Danh mục, Ngày ra mắt, Upload Ảnh) ... */}
      {/* ... (Nút Submit) ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái (Thông tin chính) */}
        <div className="md:col-span-2 space-y-6">
          {/* Tên sản phẩm */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={product?.name || ""}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
            {errors?.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mô tả
            </label>
            <textarea
              name="description"
              id="description"
              rows={4} // Giảm số dòng
              defaultValue={product?.description || ""}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* --- THÊM TRƯỜNG MỚI: Thông số (Specs) --- */}
          <div>
            <label
              htmlFor="specs"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Thông số (Specs) - (Viết dưới dạng JSON)
            </label>
            <textarea
              name="specs"
              id="specs"
              rows={6}
              defaultValue={formatJsonForInput(product?.specs)}
              placeholder='{ "chip": "M4", "ram": "16GB" }'
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {/* Giá, Tồn kho, Màu, Dung lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Giá (VND) *
              </label>
              <input
                type="number"
                name="price"
                id="price"
                defaultValue={product?.price || 0}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              />
              {errors?.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price[0]}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="inventory"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Tồn kho *
              </label>
              <input
                type="number"
                name="inventory"
                id="inventory"
                defaultValue={product?.inventory || 0}
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              />
              {errors?.inventory && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.inventory[0]}
                </p>
              )}
            </div>

            {/* --- THÊM TRƯỜNG MỚI: Màu sắc --- */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Màu sắc
              </label>
              <input
                type="text"
                name="color"
                id="color"
                defaultValue={product?.color || ""}
                placeholder="VD: Space Gray, Midnight"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* --- THÊM TRƯỜNG MỚI: Dung lượng --- */}
            <div>
              <label
                htmlFor="storage"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Dung lượng (Storage)
              </label>
              <input
                type="text"
                name="storage"
                id="storage"
                defaultValue={product?.storage || ""}
                placeholder="VD: 256GB, 1TB"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Cột phải (Danh mục & Ảnh) */}
        <div className="md:col-span-1 space-y-6">
          {/* Danh mục */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Danh mục
            </label>
            <select
              name="categoryId"
              id="categoryId"
              // SỬA LỖI: Dùng `product?.categoryId` (là ID)
              defaultValue={product?.categoryId || ""}
              // Sửa: không 'required' vì schema là optional
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">-- Không có danh mục --</option>
              {categories.map((cat) => (
                // SỬA LỖI: Gửi `cat.id` (CUID) thay vì `cat.slug`
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors?.categoryId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.categoryId[0]}
              </p>
            )}
          </div>

          {/* --- THÊM TRƯỜNG MỚI: Ngày ra mắt --- */}
          <div>
            <label
              htmlFor="releasedAt"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Ngày ra mắt
            </label>
            <input
              type="date"
              name="releasedAt"
              id="releasedAt"
              defaultValue={formatDateForInput(product?.releasedAt)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Upload Ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Ảnh sản phẩm
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         dark:file:bg-blue-900/50 dark:file:text-blue-300
                         hover:file:bg-blue-100 dark:hover:file:bg-blue-800/50"
            />
          </div>

          {/* Xem trước ảnh */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nút Submit */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isPending
            ? isEditMode
              ? "Đang cập nhật..."
              : "Đang tạo..."
            : isEditMode
              ? "Lưu thay đổi"
              : "Tạo sản phẩm"}
        </button>
      </div>
    </form>
  );
}
