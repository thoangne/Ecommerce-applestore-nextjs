import { v2 as cloudinary } from "cloudinary";

// (Giữ nguyên cấu hình cloudinary của bạn)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// (Giữ nguyên hàm uploadToCloudinary của bạn)
export async function uploadToCloudinary(
  dataUri: string,
  folder: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: folder,
  });
  return result.secure_url;
}

/**
 * ✅ HÀM MỚI: Xóa ảnh khỏi Cloudinary
 * Cần lấy public_id từ URL
 */
export async function deleteFromCloudinary(url: string): Promise<boolean> {
  try {
    // URL có dạng: .../upload/folder/public_id.jpg
    // 1. Lấy phần sau /upload/
    const parts = url.split("/upload/");
    if (parts.length < 2) return false;

    // 2. Lấy phần public_id (bỏ .jpg, .png...)
    const publicIdWithFolder = parts[1].substring(0, parts[1].lastIndexOf("."));

    if (!publicIdWithFolder) return false;

    // 3. Xóa
    const result = await cloudinary.uploader.destroy(publicIdWithFolder);

    return result.result === "ok";
  } catch (error) {
    console.error("Lỗi khi xóa ảnh Cloudinary:", error);
    return false;
  }
}
// lib/cloudinary.ts
