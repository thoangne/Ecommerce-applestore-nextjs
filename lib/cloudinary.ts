"use server";

import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary (chỉ cần ở 1 nơi)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Tải một file (dưới dạng Data URI) lên Cloudinary
 * @param base64DataUri Chuỗi Data URI (data:image/png;base64,...)
 * @param folder Thư mục trên Cloudinary (ví dụ: 'products' hoặc 'avatars')
 * @returns Promise<string> URL an toàn của ảnh đã tải lên
 */
export async function uploadToCloudinary(
  base64DataUri: string,
  folder: string
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64DataUri, {
      folder: folder,
      resource_type: "image",
      overwrite: false,
      invalidate: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
    throw new Error("Tải ảnh thất bại.");
  }
}
