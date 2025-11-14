import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/searchProducts";
import { groq } from "@/lib/ai";
import { prisma } from "@/lib/prisma"; // ✅ 1. Import Prisma

export interface ProductPayload {
  productId: string;
  text: string;
}
export function isProductPayload(x: unknown): x is ProductPayload {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  return typeof obj.productId === "string" && typeof obj.text === "string";
}
export async function POST(req: Request) {
  try {
    // ✅ 1. Nhận `userId` từ client
    const { messages, sessionId: currentSessionId, userId } = await req.json();
    const userMsg = messages?.[messages.length - 1];

    if (!userMsg || userMsg.role !== "user") {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }
    const userMsgContent = userMsg.content ?? "";

    let sessionId = currentSessionId;
    let chatSession;

    // --- ✅ 2. Logic tìm/tạo Session được cập nhật ---

    // Nếu ĐÃ đăng nhập (có userId)
    if (userId) {
      // Cố gắng tìm phiên chat gần nhất của user này
      chatSession = await prisma.chatSession.findFirst({
        where: {
          userId: userId,
          // (Tùy chọn: bạn có thể thêm điều kiện `updatedAt` để chỉ lấy session cũ trong vòng 1 ngày)
        },
        orderBy: { createdAt: "desc" },
      });
    }
    // Nếu KHÔNG đăng nhập (userId là null) VÀ có sessionId (từ localStorage)
    else if (sessionId) {
      // Tìm theo sessionId của khách vãng lai
      chatSession = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
    }

    // Nếu không tìm thấy (là tin nhắn đầu tiên, hoặc session cũ quá)
    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          // ✅ Gán userId nếu có, nếu không thì là null
          userId: userId || null,
        },
      });
    }
    // Cập nhật sessionId cho client (dù tìm thấy hay mới tạo)
    sessionId = chatSession.id;

    // --- Logic AI (Giữ nguyên) ---
    const products: ProductPayload[] = await searchProducts(userMsgContent);
    const context = products.map((p) => p.text).join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `... (system prompt của bạn) ...\n${context}`,
        },
        ...messages,
      ],
      temperature: 0.5,
    });

    const aiReply = completion.choices[0].message;

    // --- Lưu tin nhắn  ---
    if (aiReply.content) {
      await prisma.$transaction([
        prisma.chatMessage.create({
          data: {
            sessionId: sessionId,
            role: "user",
            content: userMsgContent,
          },
        }),
        prisma.chatMessage.create({
          data: {
            sessionId: sessionId,
            role: "assistant",
            content: aiReply.content,
          },
        }),
      ]);
    }

    // --- Trả về (Giữ nguyên) ---
    return NextResponse.json({
      reply: aiReply,
      matchedProducts: products,
      sessionId: sessionId,
    });
  } catch (err) {
    console.error("❌ CHAT ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
