import { prisma } from "./prisma";

export async function dumpProducts() {
  const products = await prisma.product.findMany();

  // build text docs
  return products.map((p) => ({
    id: p.id,
    text: `
Tên: ${p.name}
Giá: ${p.price}₫
Kho: ${p.inventory}
Mô tả: ${p.description ?? ""}
Spec: ${JSON.stringify(p.specs ?? {})}
  `,
  }));
}
