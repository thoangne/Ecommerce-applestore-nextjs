"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Giả sử bạn đã có file auth

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Tải ảnh lên Cloudinary
 */
async function uploadToCloudinary(base64DataUri: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder: "blog/thumbnails",
    resource_type: "image",
    overwrite: false,
    invalidate: true,
  });
  return result.secure_url;
}

/**
 * ACTION 1: Tạo bài viết mới
 */
export async function createBlogPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const excerpt = formData.get("excerpt")?.toString() || "";
    const readTime = formData.get("readTime")?.toString() || "";
    const categoryId = formData.get("categoryId")?.toString() || undefined;
    const imageFile = formData.get("thumbnail") as File | null;

    if (!title || !content || !categoryId) {
      return { error: "Thiếu tiêu đề, nội dung, hoặc danh mục" };
    }

    let thumbnailUrl = "";

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Sửa lỗi ENAMETOOLONG: Thêm "data:"
      const dataUri = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
      thumbnailUrl = await uploadToCloudinary(dataUri);
    }

    // Tạo slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // Thay thế khoảng trắng và ký tự đặc biệt
      .replace(/^-+|-+$/g, "") // Xóa dấu - ở đầu và cuối
      .substring(0, 100);

    // (Nên kiểm tra slug trùng lặp ở đây)

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + "...",
        readTime,
        thumbnail: thumbnailUrl || undefined, // Lưu là undefined nếu rỗng
        published: true,
        publishedAt: new Date(),
        authorId: session.user.id,
        categoryId: categoryId, // Lưu ID danh mục
      },
    });

    revalidatePath("/blog");
    revalidatePath("/blog/create");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi tạo bài viết:", error);
    return { error: error.message || "Không thể tạo bài viết." };
  }
}

/**
 * ACTION 2: Like/Unlike bài viết
 * (Giả sử bạn dùng model BlogLike)
 */
export async function toggleBlogLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

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

    // Lấy slug để revalidate (tùy chọn nhưng nên làm)
    // const post = await prisma.blogPost.findUnique({ where: { id: postId }, select: { slug: true }});
    // if (post) revalidatePath(`/blog/${post.slug}`);

    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi like:", error);
    return { error: "Thao tác thất bại." };
  }
}

/**
 * ACTION 3: Tạo bình luận mới
 */
export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Bạn phải đăng nhập để bình luận." };
  }

  const content = formData.get("content")?.toString();
  const postId = formData.get("postId")?.toString();
  const postSlug = formData.get("postSlug")?.toString();

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
  } catch (error) {
    console.error("Lỗi khi tạo bình luận:", error);
    return { error: "Đã xảy ra lỗi, không thể gửi bình luận." };
  }
}

/**
 * ACTION 4: Lấy danh sách danh mục Blog
 */
export async function getBlogCategories() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
    });
    return { categories };
  } catch (error) {
    return { error: "Không thể tải danh mục." };
  }
}
