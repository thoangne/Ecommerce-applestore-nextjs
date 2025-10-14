import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) { 
    const payload = await request.text();

    const sig = request.headers.get('Stripe-Signature');

    if (!sig) {
        return new NextResponse('Missing Stripe-Signature', { status: 400 });

    }
    const webhookSecret: string | undefined = process.env.STRIPE_WEBHOOK_SECRET || '';
    try {
            const event =  stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;
        if (!orderId) return;

        await prisma.order.update({
            where: { id: orderId },
            data: {
            status: "paid", // ✅ chỉ webhook mới đổi sang paid
            stripePaymentIntentId: session.payment_intent as string,
            },
        });
        }
 else {
        console.warn("Unhandled event type", event.type);
        
    }
    return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        return new NextResponse("Error processing Stripe webhook", { status: 500 });
    }
}
    
 