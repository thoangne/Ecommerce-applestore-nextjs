"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ProductSchema } from "@/lib/schemas"; // Zod schema đã được cập nhật
import { z } from "zod";

/**
 * ACTION 1: Tạo sản phẩm mới
 */
export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }

  // 1. Lấy dữ liệu thô từ form (bao gồm cả các trường mới)
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    categoryId: formData.get("categoryId"),
    color: formData.get("color"),
    storage: formData.get("storage"),
    specs: formData.get("specs"),
    // Xử lý releasedAt: nếu chuỗi rỗng thì là 'undefined' để Zod
    releasedAt: formData.get("releasedAt") || undefined,
  };

  // 2. Validate dữ liệu text (dùng Zod schema đã cập nhật)
  const validatedFields = ProductSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(
      "Lỗi Validation:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error: "Dữ liệu không hợp lệ.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Lấy dữ liệu đã được validate (và ép kiểu)
  const {
    name,
    description,
    price,
    inventory,
    categoryId,
    color,
    storage,
    specs,
    releasedAt,
  } = validatedFields.data;

  // 3. Xử lý Upload nhiều ảnh (Giữ nguyên)
  const images = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  if (images.length > 0) {
    try {
      const uploadPromises = images
        .filter((file) => file.size > 0)
        .map(async (file) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const dataUri = `data:${
            file.type
          };base64,${buffer.toString("base64")}`;
          return uploadToCloudinary(dataUri, "products");
        });

      const uploadedUrls = await Promise.all(uploadPromises);
      imageUrls.push(...uploadedUrls);
    } catch (uploadError) {
      return { error: "Tải ảnh thất bại." };
    }
  }

  // 4. Tạo sản phẩm trong CSDL (Đã cập nhật)
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        inventory,
        images: imageUrls,
        slug: name.toLowerCase().replace(/[\s\W-]+/g, "-"), // Tạo slug

        // ✅ SỬA LỖI: Gán CUID của danh mục con, hoặc null
        categoryId: categoryId || null,

        // THÊM TRƯỜNG MỚI
        color: color || null,
        storage: storage || null,
        // ✅ SỬA LỖI JSON: Kiểm tra chuỗi rỗng trước khi parse
        specs: specs && specs.trim() !== "" ? JSON.parse(specs) : null,
        releasedAt: releasedAt || null,
      },
    });

    revalidatePath("/admin/dashboard/products"); // Sửa đường dẫn nếu cần

    // ✅ SỬA LỖI: Xóa 'redirect' và 'return' success + ID
    return {
      success: "Đã tạo sản phẩm thành công!",
      newProductId: newProduct.id, // Trả về ID để client redirect
    };
  } catch (dbError: any) {
    console.error("Lỗi CSDL:", dbError);
    // Xử lý lỗi nếu JSON không hợp lệ
    if (dbError instanceof SyntaxError && dbError.message.includes("JSON")) {
      return { error: "Lỗi cú pháp JSON trong trường 'Thông số (Specs)'." };
    }
    return { error: "Không thể tạo sản phẩm." };
  }
}

/**
 * ACTION 2: Cập nhật sản phẩm
 */
export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }

  // 1. Validate (giống hệt create)
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    categoryId: formData.get("categoryId"),
    color: formData.get("color"),
    storage: formData.get("storage"),
    specs: formData.get("specs"),
    releasedAt: formData.get("releasedAt") || undefined,
  };

  const validatedFields = ProductSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Dữ liệu không hợp lệ.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    description,
    price,
    inventory,
    categoryId,
    color,
    storage,
    specs,
    releasedAt,
  } = validatedFields.data;

  // (Chúng ta sẽ cập nhật logic upload ảnh cho 'update' sau)

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        inventory,
        // ✅ SỬA LỖI: Gán CUID của danh mục con, hoặc null
        categoryId: categoryId || null,

        // THÊM TRƯỜNG MỚI
        color: color || null,
        storage: storage || null,
        // ✅ SỬA LỖI JSON: Kiểm tra chuỗi rỗng trước khi parse
        specs: specs && specs.trim() !== "" ? JSON.parse(specs) : null,
        releasedAt: releasedAt || null,
      },
    });

    revalidatePath("/admin/dashboard/products"); // Sửa đường dẫn nếu cần
    revalidatePath(`/admin/dashboard/products/${productId}`); // Sửa đường dẫn nếu cần
    return { success: "Đã cập nhật sản phẩm." }; // ✅ Trả về success
  } catch (dbError: any) {
    console.error("Lỗi CSDL:", dbError);
    if (dbError instanceof SyntaxError && dbError.message.includes("JSON")) {
      return { error: "Lỗi cú pháp JSON trong trường 'Thông số (Specs)'." };
    }
    return { error: "Không thể cập nhật sản phẩm." };
  }
}

/**
 * ACTION 3: Xóa một sản phẩm
 */
export async function deleteProduct(productId: string) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }
  if (!productId) {
    return { error: "Không tìm thấy sản phẩm." };
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/dashboard/products"); // Sửa đường dẫn nếu cần

    return { success: "Đã xóa sản phẩm thành công." };
  } catch (error: any) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    if (error.code === "P2003") {
      return {
        error:
          "Không thể xóa sản phẩm này vì nó đang được liên kết với các đơn hàng.",
      };
    }
    return { error: "Đã xảy ra lỗi không xác định." };
  }
}
//product.ts
