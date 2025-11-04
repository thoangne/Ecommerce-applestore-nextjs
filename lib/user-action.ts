"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
export async function updateAddress(data: {
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  addressLine1?: string;
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

    return { success: true };
  } catch (error) {
    console.error("Update address error:", error);
    return { success: false, error: "Database error" };
  }
}
export async function updateProfile(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl: string | undefined = undefined;

  // ✅ Lưu ảnh vào public/uploads
  if (avatarFile) {
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${userId}.jpg`);
    fs.writeFileSync(filePath, buffer);
    avatarUrl = `/uploads/${userId}.jpg`;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      phone,
      addressLine1,
      ...(avatarUrl && { avatarUrl }),
    },
  });

  return { success: true };
}