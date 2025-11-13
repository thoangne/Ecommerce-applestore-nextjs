"use client";

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Users,
  ShoppingCart,
  DollarSign,
  LucideIcon,
} from "lucide-react";

const iconMap: { [key: string]: LucideIcon } = {
  shoppingCart: ShoppingCart,
  checkCircle: CheckCircle,
  users: Users,
  dollarSign: DollarSign,
};

type StatCardProps = {
  title: string;
  value: string | number;
  iconName: keyof typeof iconMap;
  change?: string;
  changeType?: "up" | "down";
};

// ✅ HÃY CHẮC CHẮN RẰNG BẠN ĐANG DÙNG "export default"
export default function StatCard({
  title,
  value,
  iconName,
  change,
  changeType,
}: StatCardProps) {
  const Icon = iconMap[iconName] || Users;

  const isUp = changeType === "up";
  const changeColor = isUp ? "text-green-500" : "text-red-500";
  const ChangeIcon = isUp ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      {change && (
        <div className={`mt-2 flex items-center gap-1 text-xs ${changeColor}`}>
          <ChangeIcon className="w-3 h-3" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
