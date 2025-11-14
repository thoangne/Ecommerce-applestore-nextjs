"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Box,
  MessageSquare,
  Users,
  LogOut,
  UserCircle,
  FileText, // ✅ 1. Import icon mới
} from "lucide-react";
import Image from "next/image";

// Định nghĩa kiểu cho các link
interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { href: "/admin/dashboard", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/dashboard/products", label: "Products", icon: Box },
  { href: "/admin/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/dashboard/customers", label: "Customers", icon: Users },
  { href: "/admin/dashboard/blog", label: "Blog", icon: FileText }, // ✅ 2. Thêm link Blog
];

/**
 * Component Sidebar chính
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <aside className="w-64 h-[650px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
      <div>
        {/* Main Navigation */}
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={
                pathname === link.href ||
                (link.href !== "/admin/dashboard" &&
                  pathname.startsWith(link.href))
              }
            />
          ))}
        </nav>
      </div>

      {/* User/Auth Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-10 flex flex-col items-center">
        {/* (Phần Loading... giữ nguyên) */}
        {status === "loading" && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )}

        {/* (Phần Đã đăng nhập... giữ nguyên) */}
        {status === "authenticated" && user && (
          <>
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name ?? "Avatar"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white pb-3">
                {user.name ?? "User"}
              </p>
            </div>
          </>
        )}

        {/* (Nút Log Out... giữ nguyên) */}
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

/**
 * Component con cho từng link trong Sidebar
 * (Giữ nguyên)
 */
function SidebarLink({
  href,
  label,
  icon: Icon,
  isActive,
}: NavLink & { isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 text-white dark:bg-gray-700 dark:text-white"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
