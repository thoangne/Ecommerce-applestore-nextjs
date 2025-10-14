import Breadcrumbs from "@/components/breadscums";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusBadge } from "../order/[orderId]/order-summary";

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className=" container mx-auto py-4">
      <Breadcrumbs
        items={[{ label: "My account", href: "/account", active: true }]}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Date </TableHead>
            <TableHead>Total </TableHead>
            <TableHead>Status </TableHead>
            <TableHead>Action </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No orders found
              </TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id.slice(-8)}...</TableCell>
              <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>${order.total}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                <Link href={`/order/${order.id}`} className="underline">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>{" "}
    </main>
  );
}
