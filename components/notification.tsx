"use client";

import React from "react";
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

export default function Notification() {
  const notifications = [
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
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {/* 🔴 Badge thông báo */}
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-2.5 h-2.5 bg-red-500 rounded-full "></span>
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
          🔔 Thông báo mới
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-center py-6 text-muted-foreground">
            Không có thông báo mới
          </DropdownMenuItem>
        ) : (
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
          ))
        )}

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
