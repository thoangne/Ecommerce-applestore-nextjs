"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Giả sử bạn đã có file auth

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadToCloudinary(base64DataUri: string): Promise<string> {
  // base64DataUri giờ sẽ là `data:image/png;base64,UklGR...`
  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder: "blog/thumbnails",
    resource_type: "image",
    overwrite: false,
    invalidate: true,
  });
  return result.secure_url;
}

export async function createBlogPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const excerpt = formData.get("excerpt")?.toString() || "";
  const readTime = formData.get("readTime")?.toString() || "";
  const categoryId = formData.get("categoryId")?.toString() || undefined;
  const imageFile = formData.get("thumbnail") as File | null;

  if (!title || !content) {
    // Nên trả về lỗi thay vì throw
    return { error: "Thiếu tiêu đề hoặc nội dung" };
  }

  let thumbnailUrl = "";

  try {
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // ✅ SỬA LỖI: Thêm "data:" vào trước imageFile.type
      const dataUri = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

      thumbnailUrl = await uploadToCloudinary(dataUri);
    }

    // Tạo slug-an-toàn
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // Thay thế khoảng trắng và ký tự đặc biệt bằng -
      .replace(/^-+|-+$/g, "") // Xóa dấu - ở đầu và cuối
      .substring(0, 100);

    // Kiểm tra slug có bị trùng không (nên làm)
    // const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
    // if (existingSlug) {
    //   slug = `${slug}-${Date.now()}`; // Thêm timestamp nếu trùng
    // }

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...", // Tự tạo excerpt nếu rỗng
        readTime,
        thumbnail: thumbnailUrl,
        published: true, // Mặc định publish
        publishedAt: new Date(),
        authorId: session.user.id,
        categoryId: categoryId || undefined, // Sẽ là null nếu rỗng
      },
    });

    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi tạo bài viết:", error);
    return { error: error.message || "Không thể tạo bài viết." };
  }
}

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Bạn phải đăng nhập để bình luận." };
  }

  const content = formData.get("content")?.toString();
  const postId = formData.get("postId")?.toString();
  const postSlug = formData.get("postSlug")?.toString(); // Lấy slug từ form

  if (!postId || !postSlug) {
    return { error: "Lỗi: Không tìm thấy bài viết." };
  }
  if (!content || content.trim().length < 1) {
    return { error: "Bình luận không được để trống." };
  }

  try {
    await prisma.blogComment.create({
      data: {
        content: content.trim(),
        postId: postId,
        userId: session.user.id,
      },
    });

    // Revalidate lại đúng trang slug này để hiển thị comment mới
    revalidatePath(`/blog/${postSlug}`);
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi tạo bình luận:", error);
    return { error: "Đã xảy ra lỗi, không thể gửi bình luận." };
  }
}

export async function toggleBlogLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
    // Hoặc trả về { error: "Unauthorized" }
  }

  // Chú ý: Tên model này (BlogLike) phải khớp với schema của bạn
  try {
    const existing = await prisma.blogLike.findUnique({
      where: { postId_userId: { postId, userId: session.user.id } },
    });

    if (existing) {
      await prisma.blogLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.blogLike.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });
    }

    revalidatePath(`/blog/${postId}`); // Tên slug chứ không phải ID
    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi like:", error);
    return { error: "Thao tác thất bại." };
  }
}
//blog.ts
