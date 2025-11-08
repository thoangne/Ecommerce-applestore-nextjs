import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/searchProducts";
import { groq } from "@/lib/ai";
export interface ProductPayload {
  productId: string;
  text: string;
}
export function isProductPayload(x: unknown): x is ProductPayload {
  if (!x || typeof x !== "object") return false;

  const obj = x as Record<string, unknown>;

  return (
    typeof obj.productId === "string" &&
    typeof obj.text === "string" 
  );
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMsg = messages?.[messages.length - 1]?.content ?? "";

    const products: ProductPayload[] = await searchProducts(userMsg);

    const context = products
      .map((p) => p.text)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Bạn là tư vấn viên Apple Việt Nam.
Chỉ trả lời dựa trên dữ liệu dưới đây.
Nếu không có thông tin phù hợp, hãy hỏi thêm về nhu cầu hoặc ngân sách.

Dữ liệu sản phẩm:
${context}
`,
        },
        ...messages,
      ],
      temperature: 0.5,
    });

    return NextResponse.json({
      reply: completion.choices[0].message,
      matchedProducts: products,
    });
  } catch (err) {
    console.error("❌ CHAT ERROR", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 },
    );
  }
}
