"use server"
import { type NextRequest } from "next/server";
import { notFound, redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");


  if (!sessionId) {
    return notFound();
  }

  let orderId: string | undefined = undefined;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    orderId = session.metadata?.orderId;

    if (!orderId) {
      return notFound();
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        stripeSessionId: sessionId,
      },
    });

    if (!order) {
      return redirect(`/order/${orderId}`);
    }


    if (order.status === "pending_payment") {
      // kiểm tra payment_status của stripe

      if (session.payment_status === "paid") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "paid",
            stripeSessionId: null,
          },
        });
      } else {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "failed",
            stripeSessionId: null,
          },
        });
      }
    }

    return redirect(`/order/${orderId}`);
  } catch (error) {
    console.error("❌ Lỗi khi xử lý success route:", error);
    return orderId ? redirect(`/order/${orderId}`) : notFound();
  }
}
