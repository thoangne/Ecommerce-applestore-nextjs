export async function embed(text: string): Promise<number[]> {
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "bge-m3",
      prompt: text,
    }),
  });

  if (!res.ok) {
    throw new Error("Embedding fetch failed");
  }

  const json = await res.json();

  if (!json.embedding) {
    console.error("❌ No embedding:", json);
    throw new Error("Missing embedding");
  }

  return json.embedding;
}
