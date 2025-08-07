"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";



export interface GetProductParams {
    slug?: string
    query?: string
    sort?: string
    page?: number
    pageSize?: number
}
export async function getProducts({ slug, query, sort, page=1, pageSize=18 }: GetProductParams) {
    const where: Prisma.ProductWhereInput = {};

    if (query) {
        where.OR = [
            {
                name: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            {
                description: {
                    contains: query,
                    mode: "insensitive"
                }
            }
        ]
    }

    if (slug) {
        where.Category = {
            slug
        }
    }

    const orderBy: Record<string, "asc" | "desc" | undefined> = {};
    if(sort === "price-asc") {
        orderBy.price = "asc";
    } else if (sort === "price-desc") {
        orderBy.price = "desc";
    }

    const skip = pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize;

    return await prisma.product.findMany({
        where,orderBy,
        skip,    
        take
    })
}
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