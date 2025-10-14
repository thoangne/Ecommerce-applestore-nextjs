import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderItem from "./order-items";
import OrderSummary from "./order-summary";
import Breadcrumbs from "@/components/breadscums";
import { auth } from "@/lib/auth";

interface OrderPageProps {
  params: Promise<{ orderId: string }>; // 🚀 chỉ để Promise thôi
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrderPage(props: OrderPageProps) {
  // await vì params là Promise
  const { orderId } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.id === order.userId;

  const breadScrumbs = [
    { label: "My account", href: `/account` },
    { label: "Order", href: `/order/${orderId}` },
  ];

  return (
    <main className="container mx-auto py-4">
      {isOwner && <Breadcrumbs items={breadScrumbs} />}

      {/* Danh sách sản phẩm */}
      <ul className="divide-y divide-gray-200">
        {order.items.map((item) => (
          <OrderItem key={item.id} orderItem={item} />
        ))}
      </ul>

      {/* Tóm tắt đơn hàng */}
      <OrderSummary order={order} />
    </main>
  );
}
