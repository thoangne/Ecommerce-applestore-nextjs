import { Prisma } from "@prisma/client";
import Stripe from "stripe";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || BASE_URL;

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil", // hoặc bỏ hẳn để Stripe tự chọn version ổn định
  typescript: true,
});

export type OrderWithItemsAndProduct = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export async function createCheckoutSession(order: OrderWithItemsAndProduct) {
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => {
      // ✅ Đảm bảo ảnh là URL hợp lệ
      let imageUrl: string | undefined;
      if (item.product.images?.length > 0) {
        const img = item.product.images[0];
        // Nếu ảnh đã là URL đầy đủ
        if (img.startsWith("http")) {
          imageUrl = img;
        } else {
          // Nếu ảnh là đường dẫn tương đối (ví dụ: /picture/ip.png)
          imageUrl = `${BASE_URL}${img.startsWith("/") ? img : `/${img}`}`;
        }
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name ?? "Unnamed Product",
            description: item.product.description ?? undefined,
            images: imageUrl ? [imageUrl] : [], // ✅ Chỉ gửi khi hợp lệ
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });

  const successUrl = `${PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${PUBLIC_URL}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id.toString(),
        ...(order.userId && { userId: order.userId }),
      },
    });

    if (!session.url) {
      throw new Error("Stripe session URL is null");
    }

    return { sessionId: session.id, sessionUrl: session.url };
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw new Error("Error creating checkout session");
  }
}
