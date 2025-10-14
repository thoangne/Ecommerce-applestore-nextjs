export function createProductCacheKEY(param: {
    categorySlug?: string,
    search?: string,
    sort?: string
    limit?: number
    page?: number
}) {
    const { categorySlug, search, sort, limit, page } = param;
    const keyParts = ["products"];
    if (categorySlug) keyParts.push(`category:${categorySlug}`);
    if (search) keyParts.push(`search:${search}`);
    if (sort) keyParts.push(`sort:${sort}`);
    if (limit) keyParts.push(`page:${limit}`);
    if (page) keyParts.push(`page:${page}`);

    return keyParts.join(":");

    
}

export function createProductsTagKey(params: {
    categorySlug?: string,
    search?:string
}) {
    const { categorySlug, search } = params;
    const tags = ["products"];

    if (categorySlug) tags.push(`category:${categorySlug}`);
    if (search) tags.push(`search:${search}`);

return tags.join(":");
    
}