import { embed } from "./embed";
import { qdrant } from "./qdrant";
import { dumpProducts } from "./dumpProducts";
import { randomUUID } from "crypto";

async function indexProducts() {
  const docs = await dumpProducts();
  const points = [];

  for (const d of docs) {
    const vector = await embed(d.text);

    points.push({
      id: randomUUID(), // ✅ FIX
      vector,
      payload: {
        productId: d.id,
        text: d.text,
      },
    });
  }

  await qdrant.upsert("products", {
    points,
  });

  console.log(`✅ Indexed ${points.length} products`);
}

indexProducts()
  .then(() => {
    console.log("✅ Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
//indexProducts.ts
