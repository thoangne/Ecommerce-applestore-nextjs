import { Badge } from "@/components/ui/badge";
import { OrderWithItemsAndProduct } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, CreditCard } from "lucide-react";
import { JSX } from "react";

interface OrderSummaryProps {
  order: OrderWithItemsAndProduct;
}

export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<
    string,
    { label: string; icon: JSX.Element; className: string }
  > = {
    pending: {
      label: "Pending",
      icon: <Clock className="w-4 h-4" />,
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse",
    },
    pending_payment: {
      label: "Pending Payment",
      icon: <CreditCard className="w-4 h-4" />,
      className: "bg-blue-100 text-blue-800 border-blue-300 animate-pulse",
    },
    failed: {
      label: "Failed",
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-red-100 text-red-800 border-red-300",
    },
    paid: {
      label: "Paid",
      icon: <CheckCircle className="w-4 h-4" />,
      className: "bg-green-100 text-green-800 border-green-300",
    },
    payment_processed: {
      label: "Payment Processed",
      icon: <CheckCircle className="w-4 h-4" />,
      className: "bg-green-100 text-green-800 border-green-300",
    },
  };

  const detail = statusMap[status] ?? {
    label: status,
    icon: <Clock className="w-4 h-4" />,
    className: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${detail.className}`}
    >
      {detail.icon}
      {detail.label}
    </Badge>
  );
}

export default async function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-muted-foreground">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <p>Subtotal</p>
          <p className="text-base text-foreground">
            {formatPrice(order.total)}
          </p>
        </div>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <p>Taxes</p>
          <p>{formatPrice(0)}</p>
        </div>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <p>Shipping</p>
          <p>{formatPrice(0)}</p>
        </div>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <p>Status</p>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center justify-between border-b pb-2 mb-4 font-semibold">
          <p>Total</p>
          <p className="text-lg text-foreground font-bold">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>
    </div>
  );
}
