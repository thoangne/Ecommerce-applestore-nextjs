"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/lib/action/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UpdateRoleDropdownProps {
  userId: string;
  currentRole: "user" | "admin";
}

export function UpdateRoleDropdown({
  userId,
  currentRole,
}: UpdateRoleDropdownProps) {
  const [isPending, startTransition] = useTransition();

  // Hàm xử lý khi thay đổi lựa chọn
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;

    // Tạo FormData để gửi đi
    const formData = new FormData();
    formData.append("role", newRole);

    // Gọi Server Action
    startTransition(async () => {
      const result = await updateUserRole(userId, formData);

      if (result.error) {
        toast.error(result.error);
        // Nếu lỗi, reset lại dropdown về giá trị cũ
        e.target.value = currentRole;
      } else {
        toast.success(result.success);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      <select
        defaultValue={currentRole}
        onChange={handleRoleChange}
        disabled={isPending}
        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
          currentRole === "admin"
            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
            : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
        } 
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
    </div>
  );
}
