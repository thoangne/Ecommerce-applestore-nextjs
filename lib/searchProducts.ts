import { isProductPayload, ProductPayload } from "@/app/api/chat/route";
import { embed } from "./embed";
import { qdrant } from "./qdrant";

export async function searchProducts(query: string): Promise<ProductPayload[]> {
  const vector = await embed(query);

  const results = await qdrant.search("products", {
    vector,
    limit: 5,
  });

  return results
    .map((r) => r.payload)
    .filter(isProductPayload);   // ✅ ensure type
}
