"use server";

import { prisma } from "./prisma";

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: {
            slug
        },
         include: {
             Category: true
        }
    })

    if (!product) return null;

    return product;
}