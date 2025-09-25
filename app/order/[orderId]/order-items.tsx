import Image from "next/image";
import { Prisma } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

interface OrderItemProps {
  orderItem: Prisma.OrderItemGetPayload<{
    include: { product: true };
  }>;
}

export default function OrderItem({ orderItem }: OrderItemProps) {
  return (
    <li className="border-b border-muted flex py-4 justify-between relative">
      {/* Xóa sản phẩm */}

      {/* Hình ảnh + thông tin */}
      <div className="flex space-x-4">
        <div className="overflow-hidden rounded-md border border-muted w-28 h-28 flex-shrink-0">
          {orderItem.product.image && (
            <Image
              src={orderItem.product.image ?? "/placeholder.png"}
              alt={orderItem.product.name}
              className="object-cover w-full h-full"
              width={112}
              height={112}
              priority
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-lg font-semibold">{orderItem.product.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {orderItem.product.description}
          </p>
          <span className="text-base font-bold mt-2">
            {formatPrice(orderItem.product.price)}
          </span>
        </div>
      </div>

      {/* Số lượng */}
      <div className="flex flex-col items-end justify-center gap-2">
        <div className="flex items-center border border-muted rounded-full overflow-hidden">
          <span className="px-1 py-1 text-center font-medium">
            Quantity: {orderItem.quantity}
          </span>
        </div>
      </div>
    </li>
  );
}
