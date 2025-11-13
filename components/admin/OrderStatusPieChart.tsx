"use client"; // Client Component

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

type StatusData = {
  name: string;
  value: number;
  percentage: number;
};

type OrderStatusPieChartProps = {
  data: StatusData[];
};

// 1. Định nghĩa màu sắc cho các trạng thái đơn hàng (có thể tùy chỉnh)
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#A4DFDF",
];

export default function OrderStatusPieChart({
  data,
}: OrderStatusPieChartProps) {
  const { theme } = useTheme();

  // Custom Tooltip để hiển thị tên, số lượng và phần trăm
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div
          className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg"
          style={{ color: theme === "dark" ? "#cbd5e1" : "#4a5568" }}
        >
          <p className="font-semibold">{`${item.name}`}</p>
          <p className="text-sm">{`Số lượng: ${item.value}`}</p>
          <p className="text-sm">{`Tỷ lệ: ${item.percentage.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
