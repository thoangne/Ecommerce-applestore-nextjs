"use server"

import { type NextRequest } from "next/server";

import { notFound, redirect } from "next/navigation";
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest)  {

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
         notFound();
    
    } 
    let orderId: string|undefined = undefined
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
         orderId = session.metadata?.orderId;
        if (!orderId) return notFound();

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                stripeSessionId: sessionId
            }
            
        })
        if (!order) {
            notFound()
        }
        if(order.status === "pending_payment") {
            await prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: "pending",
                    stripeSessionId: null
                }
            });

        } 
    } catch (error) {
        console.error("Error fetching order", error);
        notFound();
    }
   return orderId ? redirect(`/order/${orderId}`) : notFound();
}