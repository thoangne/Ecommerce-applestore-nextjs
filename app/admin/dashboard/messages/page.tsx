import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageCircle, User, Eye } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Trang "Quản lý Cuộc trò chuyện"
 * Liệt kê các ChatSession
 */
export default async function AdminChatSessionsPage() {
  const sessions = await prisma.chatSession.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } }, // Lấy thông tin user nếu có
      _count: { select: { messages: true } }, // Đếm số tin nhắn
    },
    take: 50, // Lấy 50 phiên gần nhất
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Cuộc trò chuyện
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Xem lại lịch sử trò chuyện của chatbot.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:border dark:border-gray-800 overflow-hidden">
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Người dùng
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Ngày bắt đầu
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Số tin nhắn
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Người dùng */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center gap-2">
                          {session.user ? (
                            <>
                              <User className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {session.user.name}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">
                                  {session.user.email}
                                </div>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              customer
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Ngày bắt đầu */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {format(
                          new Date(session.createdAt),
                          "dd/MM/yyyy 'lúc' HH:mm",
                          { locale: vi }
                        )}
                      </td>

                      {/* Số tin nhắn */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {session._count.messages}
                      </td>

                      {/* Hành động */}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/dashboard/messages/${session.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {/* (Bạn có thể thêm nút xóa session ở đây) */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sessions.length === 0 && (
                <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400" />
                  Chưa có cuộc trò chuyện nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
