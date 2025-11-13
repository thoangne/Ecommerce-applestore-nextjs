import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Edit, UserCircle } from "lucide-react";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { format } from "date-fns";

/**
 * Trang "Quản lý Khách hàng" (Server Component)
 */
export default async function AdminCustomersPage() {
  // ✅ CẬP NHẬT 1: Lấy dữ liệu chi tiêu (chỉ tính đơn 'paid')
  const spendingData = await prisma.order.groupBy({
    by: ["userId"],
    where: {
      status: "paid", // Chỉ tính các đơn hàng đã thanh toán
      userId: { not: null }, // Đảm bảo userId không bị null
    },
    _sum: {
      total: true, // Tính tổng của cột 'total'
    },
  });

  // Chuyển sang Map để tra cứu nhanh (lookup)
  const spendingMap = new Map(
    spendingData.map((item) => [item.userId, item._sum.total || 0])
  );

  // ✅ CẬP NHẬT 2: Lấy dữ liệu người dùng (vẫn như cũ)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true }, // Đếm tổng số đơn (bất kể trạng thái)
      },
    },
  });

  // ✅ CẬP NHẬT 3: Gộp dữ liệu chi tiêu vào user
  const usersWithSpending = users.map((user) => ({
    ...user,
    totalSpent: spendingMap.get(user.id) || 0, // Lấy chi tiêu từ Map, mặc định là 0
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Khách hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Quản lý tất cả tài khoản khách hàng trong cửa hàng.
          </p>
        </div>
      </header>

      {/* Bảng Hiển thị Khách hàng */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:border dark:border-gray-800 overflow-hidden">
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Header Bảng */}
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Khách hàng
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Vai trò
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Ngày tham gia
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Số đơn hàng
                    </th>
                    {/* ✅ CẬP NHẬT 4: Thêm cột Header "Tổng chi tiêu" */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Tổng chi tiêu
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>

                {/* Body Bảng */}
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {/* ✅ CẬP NHẬT 5: Dùng mảng `usersWithSpending` */}
                  {usersWithSpending.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Tên khách hàng & Ảnh */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.avatarUrl ? (
                              <Image
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatarUrl}
                                alt={user.name || "Avatar"}
                                width={40}
                                height={40}
                              />
                            ) : (
                              <UserCircle className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name || "N/A"}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Vai trò */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      {/* Ngày tham gia */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(user.createdAt), "dd/MM/yyyy")}
                      </td>
                      {/* Số đơn hàng */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user._count.orders}
                      </td>
                      {/* ✅ CẬP NHẬT 6: Thêm cột data "Tổng chi tiêu" */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(user.totalSpent)}
                      </td>
                      {/* Hành động (Edit/Delete) */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/dashboard/customers/${user.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteUserButton userId={user.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Hiển thị nếu không có khách hàng */}
              {users.length === 0 && (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Không tìm thấy khách hàng nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
