import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Bot } from "lucide-react";
import { format } from "date-fns";

/**
 * Trang Chi tiết Cuộc trò chuyện
 */
export default async function ChatDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const session = await prisma.chatSession.findUnique({
    where: { id: params.sessionId },
    include: {
      messages: { orderBy: { createdAt: "asc" } }, // Lấy tất cả tin nhắn
      user: { select: { name: true } },
    },
  });

  if (!session) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Nút Back và Tiêu đề */}
      <div>
        <Link
          href="/admin/dashboard/messages"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:border dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cuộc trò chuyện{" "}
            {session.user ? `với ${session.user.name}` : "với Khách"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bắt đầu lúc:{" "}
            {format(new Date(session.createdAt), "dd/MM/yyyy HH:mm")}
          </p>
        </div>

        {/* Khung chat */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar Bot */}
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              )}

              {/* Nội dung tin nhắn */}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Avatar User */}
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
