"use server"

import { cookies } from "next/headers";
import { getCart } from "./action";
import { prisma } from "./prisma";
import { createCheckoutSession, OrderWithItemsAndProduct } from "./stripe";
import { auth } from "./auth";

export type ProcessCheckoutResponse = {
    sessionUrl:string,
    order:OrderWithItemsAndProduct
}

export async function processCheckout():Promise<ProcessCheckoutResponse> {
    const cart = await getCart();
    const session = await auth();
    const userId = session?.user?.id;

    if (!cart || cart.items.length == 0) {
        throw new Error("Cart is empty")
    }

    try {
        const order = await prisma.$transaction(async (tx) => {
            const total = cart.subtotal
            const newOrder = await tx.order.create({
                data: {
                    total,
                    userId,
                }
            })

            const orderItems = cart.items.map((item) => ({
                orderId: newOrder.id,
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            }))

            await tx.orderItem.createMany({
                data: orderItems
            })

            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id
                }
            })
            await tx.cart.delete({
                where: {
                    id: cart.id
                }
            })
            return newOrder;
        });
        // 1. reload full order

        const fullOrder = await prisma.order.findUnique({
            where: {
                id: order.id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        // 2. Confirm the order was loaded
        if(!fullOrder) {
            throw new Error("Order not found")
        }
        // 3. Create the Stripe SESSION
        const {sessionId,sessionUrl } = await createCheckoutSession(fullOrder);
        // 4. RETURN THE SESSION URL AND HANDLE THE ERROR
        if(!sessionId || !sessionUrl) {
            throw new Error("Failed to create checkout session")
        }
        
        // 5. STORE THE SESSION ID IN THE ORDER & CHANGE THE ORDER STATUS
        await prisma.order.update({
            where: {
                id: fullOrder.id
            },
            data: {
                stripeSessionId: sessionId,
                status: "pending_payment"
            }
        });

        (await cookies()).delete("cartId");
        return {
            sessionUrl,
            order:fullOrder
        }
    }
    catch (error) {
        //1. OPTIONAL: the change the order status to failed
        // if (orderId && error instanceof Error ** error.message.includes("Stripes")) {
        //     await prisma.order.update({
        //         where: {
        //             id: orderId,
        //         },
        //         data: {
        //             status: "failed",
        //         }
        //     });
        // }


        console.error("Error creating order", error)
        throw new Error("Failed to create order")
    }

     //TODO:
    // 1. Caltulate total price 
    // 2. Create Order record 
    // 3. Create OrderItems records
    // 4. Delete cart
    // 5.revalidate cache
    // 6. Return the order 
}
