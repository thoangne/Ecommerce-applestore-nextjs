import React from "react";
import SideBar from "@/components/admin/SideBar"; // Import SideBar
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ THAY ĐỔI: Thêm padding p-4 và gap-4
    <div className="flex h-screen bg-gray-50 dark:bg-black p-4 gap-4">
      {/* 1. SideBar */}
      <SideBar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (nếu bạn muốn thêm sau này) */}
        {/* <header className="h-16 bg-white dark:bg-gray-900 shadow-sm flex-shrink-0 border-b dark:border-gray-800"></header> */}

        {/* Vùng nội dung chính có thể cuộn */}
        <main className="flex-1 overflow-y-auto">
          {/* Padding đã được chuyển vào các file page.tsx */}
          {children}
        </main>
      </div>

      {/* Toaster để hiển thị thông báo */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
