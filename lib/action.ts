"use server";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { revalidateTag, unstable_cache } from "next/cache";
import {
  createProductCacheKEY,
  createProductsTagKey,
} from "@/components/cache-keys";

export interface GetProductParams {
  slug?: string;
  query?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

// --- ✅ HÀM ĐÃ SỬA ---
export async function getProducts({
  slug,
  query,
  sort,
  page = 1,
  pageSize = 18,
}: GetProductParams) {
  const where: Prisma.ProductWhereInput = {};

  if (query) {
    where.OR = [
      {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query,
          mode: "insensitive",
        },
      },
    ];
  }

  // --- LOGIC MỚI: Lấy cả sản phẩm của danh mục con ---
  if (slug) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: true, // Lấy thêm danh mục con
      },
    });

    if (category) {
      // Tạo mảng ID bao gồm: ID danh mục hiện tại + ID các danh mục con
      const categoryIds = [
        category.id,
        ...category.subcategories.map((sub) => sub.id),
      ];

      // Tìm sản phẩm thuộc bất kỳ ID nào trong mảng trên
      where.categoryId = {
        in: categoryIds,
      };
    } else {
      // Nếu có slug mà không tìm thấy danh mục thì trả về rỗng luôn
      return [];
    }
  }
  // ----------------------------------------------------

  const orderBy: Record<string, "asc" | "desc" | undefined> = {};
  if (sort === "price-asc") {
    orderBy.price = "asc";
  } else if (sort === "price-desc") {
    orderBy.price = "desc";
  } else {
    // Mặc định sắp xếp mới nhất
    orderBy.createdAt = "desc";
  }

  const skip = pageSize ? (page - 1) * pageSize : undefined;
  const take = pageSize;

  return await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
  });
}

export async function getProductCached({
  query,
  slug,
  sort,
  page = 1,
  pageSize = 18, // Tăng mặc định lên để hiển thị nhiều hơn
}: GetProductParams) {
  const cacheKey = createProductCacheKEY({
    categorySlug: slug,
    search: query,
    sort,
    limit: pageSize,
    page,
  });

  const cacheTag = createProductsTagKey({
    search: query,
    categorySlug: slug,
  });

  return await unstable_cache(
    async () => {
      return await getProducts({ query, slug, sort, page, pageSize });
    },
    [cacheKey],
    {
      tags: [cacheTag],
      revalidate: 3600,
    }
  )();
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      Category: true,
    },
  });

  if (!product) return null;

  return product;
}

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

async function findCartFromCookie(): Promise<CartWithProducts | null> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return null;

  return unstable_cache(
    async (id: string) => {
      return await prisma.cart.findUnique({
        where: {
          id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    },
    [`cart-${cartId}`],
    { tags: [`cart-${cartId}`] }
  )(cartId);
}

export async function getCart(): Promise<ShoppingCart | null> {
  const cart = await findCartFromCookie();

  if (!cart) return null;
  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ),
  };
}

async function getOrCreateCart(): Promise<CartWithProducts> {
  let cart = await findCartFromCookie();

  if (cart) {
    return cart;
  }

  cart = await prisma.cart.create({
    data: {},
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  (await cookies()).set("cartId", cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return cart;
}

export async function addToCart(ProductId: string, quantity: number = 1) {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cart = await getOrCreateCart();

  const existingItem = cart.items.find((item) => item.productId === ProductId);

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        quantity,
        productId: ProductId,
        cartId: cart.id,
      },
    });
  }
  revalidateTag(`cart-${cart.id}`);
}

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: true;
  };
}>;

export async function setProductQuantity(productId: string, quantity: number) {
  const cart = await findCartFromCookie();

  if (!cart) throw new Error("Cart not found");

  try {
    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      });
    } else {
      await prisma.cartItem.updateMany({
        where: {
          cartId: cart.id,
          productId,
        },
        data: {
          quantity,
        },
      });
    }
    revalidateTag(`cart-${cart.id}`);
  } catch (error) {
    console.error("Error setting product quantity", error);
    throw new Error("Error setting product quantity");
  }
}

export async function getProductsCountCached() {
  return unstable_cache(
    async () => {
      return await prisma.product.count();
    },
    ["product-count"],
    { revalidate: 3600 }
  )();
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      slug: true,
    },
  });
}

export async function getCategoriesCountCached(slug: string) {
  return unstable_cache(
    () => {
      return prisma.category.count();
    },
    ["category-count"],
    {
      tags: [`category-count-${slug}`],
      revalidate: 3600,
    }
  )();
}

// Hàm này có vẻ dùng để gợi ý sản phẩm liên quan theo slug?
export async function getProductsByCategory(category: string) {
  return await prisma.product.findMany({
    where: {
      OR: [{ slug: { contains: category, mode: "insensitive" } }],
    },
    take: 6,
  });
}
