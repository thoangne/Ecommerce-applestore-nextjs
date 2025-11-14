"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, updateProduct } from "@/lib/action/product";
import { toast } from "sonner"; // Giả sử bạn dùng Sonner
import { X, Loader2 } from "lucide-react";

// Định nghĩa kiểu dữ liệu (Bạn nên định nghĩa ở file riêng, vd: types.ts)
type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  inventory: number;
  images: string[];
  categoryId: string | null;
  color: string | null;
  storage: string | null;
  specs: any; // Kiểu JSON
  releasedAt: Date | null;
};

interface ProductFormProps {
  categories: Category[];
  product?: Product | null; // Dữ liệu sản phẩm (nếu là edit)
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Kiểm tra chế độ Edit hay Create
  const isEditMode = Boolean(product);

  // State cho các trường
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [inventory, setInventory] = useState(product?.inventory || 0);
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [color, setColor] = useState(product?.color || "");
  const [storage, setStorage] = useState(product?.storage || "");
  // Specs (JSON) cần stringify
  const [specs, setSpecs] = useState(
    product?.specs ? JSON.stringify(product.specs, null, 2) : ""
  );
  // ReleasedAt (Date) cần format cho input[type=date]
  const [releasedAt, setReleasedAt] = useState(
    product?.releasedAt
      ? new Date(product.releasedAt).toISOString().split("T")[0]
      : ""
  );

  // State cho hình ảnh
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Xử lý khi chọn file mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  // Xử lý khi xóa ảnh ĐÃ TỒN TẠI (existing)
  const handleDeleteExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((imgUrl) => imgUrl !== url));
    setImagesToDelete([...imagesToDelete, url]);
  };

  // Xử lý khi xóa ảnh MỚI CHỌN (new)
  const handleDeleteNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Xử lý Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    // Thêm các trường text
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("inventory", String(inventory));
    formData.append("categoryId", categoryId);
    formData.append("color", color);
    formData.append("storage", storage);
    formData.append("specs", specs);
    formData.append("releasedAt", releasedAt);

    // Thêm các ảnh cần xóa
    imagesToDelete.forEach((url) => {
      formData.append("imagesToDelete", url);
    });

    // Thêm các ảnh mới cần upload
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    startTransition(async () => {
      let result;
      if (isEditMode) {
        result = await updateProduct(product!.id, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result.error) {
        toast.error(result.error, {
          description: result.fieldErrors
            ? Object.values(result.fieldErrors).flat().join(", ")
            : undefined,
        });
      } else {
        toast.success(result.success);
        // Chuyển hướng về trang danh sách
        router.push("/admin/dashboard/products");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
    >
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {isEditMode ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái (Thông tin chính) */}
        <div className="md:col-span-2 space-y-6">
          {/* Tên SP */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Tên sản phẩm
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
            />
          </div>

          {/* Giá và Tồn kho */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
              >
                Giá (VND)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
                required
              />
            </div>
            <div>
              <label
                htmlFor="inventory"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
              >
                Tồn kho
              </label>
              <input
                type="number"
                id="inventory"
                name="inventory"
                min="0"
                value={inventory}
                onChange={(e) => setInventory(Number(e.target.value))}
                className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
                required
              />
            </div>
          </div>

          {/* Thông số (Specs) - Dạng JSON */}
          <div>
            <label
              htmlFor="specs"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Thông số kỹ thuật (JSON)
            </label>
            <textarea
              id="specs"
              name="specs"
              rows={8}
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2 font-mono"
              placeholder={`{\n  "display": "6.7 inch",\n  "cpu": "A17 Pro"\n}`}
            />
          </div>
        </div>

        {/* Cột phải (Thuộc tính & Ảnh) */}
        <div className="space-y-6">
          {/* Danh mục */}
          <div>
            <label
              htmlFor="categoryId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Danh mục
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Màu & Dung lượng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="color"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
              >
                Màu sắc
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
                placeholder="Titan Tự nhiên"
              />
            </div>
            <div>
              <label
                htmlFor="storage"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
              >
                Dung lượng
              </label>
              <input
                type="text"
                id="storage"
                name="storage"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
                placeholder="256GB"
              />
            </div>
          </div>

          {/* Ngày ra mắt */}
          <div>
            <label
              htmlFor="releasedAt"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Ngày ra mắt
            </label>
            <input
              type="date"
              id="releasedAt"
              name="releasedAt"
              value={releasedAt}
              onChange={(e) => setReleasedAt(e.target.value)}
              className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50">
              Hình ảnh
            </label>

            {/* Vùng xem trước ảnh (Hiện có + Mới) */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Ảnh hiện có */}
              {existingImages.map((url, index) => (
                <div key={`${url}-${index}`} className="relative">
                  <Image
                    src={url}
                    alt="Ảnh sản phẩm"
                    width={100}
                    height={100}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(url)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {/* Ảnh mới (preview) */}
              {newImages.map((file, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Ảnh xem trước"
                    width={100}
                    height={100}
                    className="w-full h-24 object-cover rounded-md"
                    onLoad={(e) =>
                      URL.revokeObjectURL((e.target as HTMLImageElement).src)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input file */}
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleFileChange}
              className="block w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 focus:outline-2 focus:outline-blue-600 focus:outline-offset-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Nút Submit */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang xử lý...
            </>
          ) : isEditMode ? (
            "Cập nhật sản phẩm"
          ) : (
            "Tạo sản phẩm"
          )}
        </button>
      </div>
    </form>
  );
}
