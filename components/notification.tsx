"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle, Info, ShoppingCart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  href: string;
  time: string;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Giả lập fetch API
  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true);
      try {
        // 👉 Hoặc fetch("/api/notifications")
        await new Promise((r) => setTimeout(r, 1000));

        setNotifications([
          {
            id: 1,
            title: "Đơn hàng #1245 đã được giao thành công",
            icon: <CheckCircle className="w-4 h-4 text-green-500" />,
            href: "/orders/1245",
            time: "2 giờ trước",
          },
          {
            id: 2,
            title: "Khuyến mãi 10% cho MacBook Air M3",
            icon: <Info className="w-4 h-4 text-blue-500" />,
            href: "/promotions/macbook",
            time: "5 giờ trước",
          },
          {
            id: 3,
            title: "Bạn đã thêm iPhone 15 Pro vào giỏ hàng",
            icon: <ShoppingCart className="w-4 h-4 text-amber-500" />,
            href: "/cart",
            time: "1 ngày trước",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const newCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {newCount > 0 && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-80 p-2 
          bg-background/95 backdrop-blur-md
          border border-border/40 shadow-xl rounded-xl
          zoom-in-95
        "
      >
        <DropdownMenuLabel className="text-base font-semibold px-2 py-1">
          🔔 Thông báo
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* ✅ Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-3 px-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-4 h-4 rounded-md" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Không có thông báo */}
        {!isLoading && notifications.length === 0 && (
          <DropdownMenuItem className="text-center py-6 text-muted-foreground">
            Không có thông báo mới
          </DropdownMenuItem>
        )}

        {/* ✅ danh sách thông báo */}
        {!isLoading &&
          notifications.map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <Link
                href={item.href}
                className="
                  flex items-start gap-3 px-3 py-2
                  rounded-lg transition-all duration-150
                  hover:bg-accent hover:text-accent-foreground
                "
              >
                <div className="mt-[3px]">{item.icon}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-tight">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <div className="px-3 pt-1 pb-2 text-center">
          <Link
            href="/notifications"
            className="
              text-xs text-muted-foreground hover:text-foreground transition
            "
          >
            Xem tất cả thông báo →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
