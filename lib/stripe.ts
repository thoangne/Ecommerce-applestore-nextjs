import { Prisma } from "@prisma/client";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}
if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("Missing NEXT_PUBLIC_URL environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil", // hoặc bỏ luôn để Stripe dùng mặc định
  typescript: true,
});

export type OrderWithItemsAndProduct =
  Prisma.OrderGetPayload<{
    include: { items: { include: { product: true } } };
  }>;

export async function createCheckoutSession(order: OrderWithItemsAndProduct) {
  if (!order.items || order.items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name ?? "",
          description: item.product.description ?? "",
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

const successUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`;

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
