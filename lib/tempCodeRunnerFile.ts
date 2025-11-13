import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({ url: "http://localhost:6333" });
export async function initVectorDB() {
  await qdrant.createCollection("products", {
    vectors: {
      size: 768,   // bge-small
      distance: "Cosine",
    },
  });
}
