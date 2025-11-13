"use client"; // Client Component

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes"; // Để tự động chuyển màu theo theme

type SalesData = {
  month: string;
  sales: number;
};

type SalesBarChartProps = {
  data: SalesData[];
};

export default function SalesBarChart({ data }: SalesBarChartProps) {
  const { theme } = useTheme(); // Lấy theme hiện tại

  // Định nghĩa màu cho text và grid dựa trên theme
  const axisColor = theme === "dark" ? "#cbd5e1" : "#4a5568"; // tailwind slate-300 / gray-700
  const gridColor = theme === "dark" ? "#4b5563" : "#e2e8f0"; // tailwind gray-600 / slate-200
  const barColor = "#8884d8"; // Màu cố định cho cột (hoặc có thể tùy biến theo theme)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value)
          }
          labelFormatter={(label: string) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
            borderColor: theme === "dark" ? "#4b5563" : "#e2e8f0",
            borderRadius: "0.5rem",
          }}
          labelStyle={{ color: axisColor }}
          itemStyle={{ color: axisColor }}
        />
        <Bar dataKey="sales" fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}
