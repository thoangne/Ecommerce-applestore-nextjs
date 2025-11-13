"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <div className="p-6 rounded-full border border-neutral-300 dark:border-neutral-700 mb-6">
        <Wrench className="w-16 h-16 text-neutral-800 dark:text-neutral-200 animate-pulse" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-2">
        Tính năng đang được phát triển
      </h1>

      {/* Description */}
      <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mb-6">
        Chúng tôi đang hoàn thiện tính năng này để mang đến cho bạn trải nghiệm
        tốt hơn. Hãy quay lại sau để xem bản cập nhật mới nhất nhé!
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button asChild variant="default">
          <Link href="/">Về trang chủ</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="border-neutral-800 dark:border-neutral-200"
        >
          <Link href="/products">Xem sản phẩm</Link>
        </Button>
      </div>
    </div>
  );
}
