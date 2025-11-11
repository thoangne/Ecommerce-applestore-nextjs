import { qdrant } from "./qdrant";

async function init() {
  console.log("⚡ Running init...");
  await qdrant.createCollection("products", {
    vectors: {
      size: 1024, // ✅ bge-m3 dimension
      distance: "Cosine",
    },
  });

  console.log("✅ Collection `products` ready");
}

init().catch(console.error);
