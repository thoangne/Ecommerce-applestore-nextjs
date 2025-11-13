"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        addressLine1,
      },
    });

    revalidatePath("/account/profile");

    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error("Update profile info error:", err);

    return {
      success: false,
      error: err.message ?? "Update profile failed",
    };
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadToCloudinary(
  base64DataUri: string,
  folder: string,
  userId: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder,
    public_id: userId,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });

  return result.secure_url;
}

export async function uploadAvatar(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const avatarFile = formData.get("avatar") as File | null;
    if (!avatarFile || avatarFile.size === 0)
      return { success: false, error: "No image selected" };

    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64DataUri = `data:${avatarFile.type};base64,${buffer.toString(
      "base64"
    )}`;

    const avatarUrl = await uploadToCloudinary(
      base64DataUri,
      "user/avatars",
      userId
    );

    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    revalidatePath("/account/profile");

    return { success: true, avatarUrl };
  } catch (error) {
    const err = error as Error;
    console.error("Upload avatar error:", err);

    return {
      success: false,
      error: err.message ?? "Upload avatar failed",
    };
  }
}
export async function updateAddress(data: {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine1: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.fullName,
        phone: data.phone,
        province: data.province,
        district: data.district,
        ward: data.ward,
        addressLine1: data.addressLine1,
      },
    });

    revalidatePath("/account/address");

    return { success: true };
  } catch (error) {
    console.error("Update profile info error:", error);
    return { success: false, error: "Update failed" };
  }
}