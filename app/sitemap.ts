import { prisma } from "@/lib/prisma";

export default async function sitemap() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const products = await prisma.product.findMany({ select: { slug: true } })
    const categories = await prisma.category.findMany({ select: { slug: true } })
    return [
        {
            url: "https://ecommerce-store.com",
            lastModified: new Date(),
        },...products.map((prod) => ({
            url: `${baseURL}/products/${prod.slug}`,
            lastModified: new Date(),
        })),...categories.map((cat) => ({
            url: `${baseURL}/search/${cat.slug}`,
            lastModified: new Date(),
        })),
       
    ];
}