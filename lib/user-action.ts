"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache"; // Nên thêm revalidate

// Cấu hình Cloudinary (giống trong blog action)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadToCloudinary(
  base64DataUri: string, // Đổi tên biến cho rõ nghĩa
  folder: string,
  userId: string
) {
  const result = await cloudinary.uploader.upload(base64DataUri, {
    // Dùng Data URI
    folder,
    public_id: userId, // Dùng userId làm public_id để ghi đè
    overwrite: true,
    invalidate: true,
    resource_type: "image", // Chỉ định rõ là image
  });
  return result.secure_url;
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined = undefined;

    if (avatarFile && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // ✅ SỬA LỖI: Thêm "data:"
      const base64DataUri = `data:${avatarFile.type};base64,${buffer.toString("base64")}`;

      avatarUrl = await uploadToCloudinary(
        base64DataUri,
        "user/avatars",
        userId
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        addressLine1,
        ...(avatarUrl && { avatarUrl }), // Chỉ cập nhật avatar nếu có
      },
    });

    revalidatePath("/account/profile"); // Thông báo cho Next.js cập nhật cache

    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi cập nhật profile:", error);
    return { success: false, error: error.message || "Cập nhật thất bại" };
  }
}
