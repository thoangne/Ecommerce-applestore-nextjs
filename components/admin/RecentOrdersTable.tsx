"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCircle, ExternalLink } from "lucide-react";

// Định nghĩa kiểu cho data (lấy từ type của Server Action)
type OrderData = {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    avatarUrl: string | null;
  } | null;
};

type RecentOrdersTableProps = {
  data: OrderData[];
};

// Component con để hiển thị Status Badge (huy hiệu trạng thái)
function StatusBadge({ status }: { status: string }) {
  let colorClasses =
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"; // Mặc định (PENDING)
  let text = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  switch (status) {
    case "COMPLETED":
      colorClasses =
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      text = "Completed";
      break;
    case "CANCELLED":
      colorClasses =
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      text = "Cancelled";
      break;
    case "PENDING":
      colorClasses =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      text = "Pending";
      break;
  }

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {text}
    </span>
  );
}

export default function RecentOrdersTable({ data }: RecentOrdersTableProps) {
  if (data.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-10">
        Không có đơn hàng nào gần đây.
      </p>
    );
  }

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {/* Header Bảng */}
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Tổng tiền
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Ngày
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Chi tiết</span>
                </th>
              </tr>
            </thead>
            {/* Thân Bảng */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {/* Khách hàng */}
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {order.user?.avatarUrl ? (
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={order.user.avatarUrl}
                            alt={order.user.name || "Avatar"}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <UserCircle className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.user?.name || "Khách vãng lai"}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Tổng tiền */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.total)}
                  </td>
                  {/* Trạng thái */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge status={order.status} />
                  </td>
                  {/* Ngày */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  {/* Link chi tiết */}
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link
                      href={`/dashboard/orders/${order.id}`} // (Giả sử bạn có trang chi tiết đơn hàng)
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
