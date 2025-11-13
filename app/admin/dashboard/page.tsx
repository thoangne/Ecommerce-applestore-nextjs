import {
  getDashboardStats,
  getSalesDataByMonth,
  getOrderStatusData,
  getRecentOrders,
  getTopSellingProducts,
} from "@/lib/action/admin";
import StatCard from "@/components/admin/StatCard";
import SalesBarChart from "@/components/admin/SaleBarChart";
import OrderStatusPieChart from "@/components/admin/OrderStatusPieChart";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import TopProductsList from "@/components/admin/TopProductList";
import { MoreHorizontal } from "lucide-react"; // Icon cho header

/**
 * Trang Dashboard chính (Server Component)
 */
export default async function DashboardPage() {
  // Gọi tất cả các Server Action song song
  const [
    statsResult,
    salesDataResult,
    orderStatusResult,
    recentOrdersResult,
    topProductsResult,
  ] = await Promise.all([
    getDashboardStats(),
    getSalesDataByMonth(),
    getOrderStatusData(),
    getRecentOrders(),
    getTopSellingProducts(),
  ]);

  // Xử lý trường hợp lỗi chung (nếu thống kê chính lỗi)
  if ("error" in statsResult) {
    return (
      <div className="p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <h3 className="font-bold">Lỗi</h3>
          <p>{statsResult.error}</p>
        </div>
      </div>
    );
  }

  // Lấy dữ liệu an toàn (gán mảng rỗng nếu có lỗi)
  const stats = statsResult;

  const salesData =
    "data" in salesDataResult && Array.isArray(salesDataResult.data)
      ? salesDataResult.data
      : [];

  const orderStatusData =
    "data" in orderStatusResult && Array.isArray(orderStatusResult.data)
      ? orderStatusResult.data
      : [];

  const recentOrders =
    "data" in recentOrdersResult && Array.isArray(recentOrdersResult.data)
      ? recentOrdersResult.data
      : [];

  const topProducts =
    "data" in topProductsResult && Array.isArray(topProductsResult.data)
      ? topProductsResult.data
      : [];
  // Format Doanh thu
  const formattedRevenue = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(stats.totalRevenue);

  // Lấy ngày tháng cho header (ví dụ)
  const dateRange = "01.01.2025 - 31.12.2025"; // (Bạn có thể thay bằng logic thật)

  return (
    // ✅ THAY ĐỔI: Thêm padding và spacing
    <div className="p-6 md:p-8 space-y-6 md:space-y-8">
      {/* Hàng 1: Tiêu đề trang (GIỐNG HỆT ẢNH) */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {dateRange}
          </p>
        </div>
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Hàng 2: Lưới 4 Card Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* StatCard đã được thiết kế lại ở File 4 */}
        <StatCard
          title="Orders"
          value={stats.orderCount ?? 0}
          iconName="shoppingCart"
          // (Dữ liệu 'change' demo, bạn có thể thêm logic này vào action)
          change="+7.2%"
          changeType="up"
        />
        <StatCard
          title="Approved"
          value={stats.approvedCount ?? 0}
          iconName="checkCircle"
        />
        <StatCard
          title="Users"
          value={stats.userCount ?? 0}
          iconName="users"
          change="+1.5%"
          changeType="up"
        />
        <StatCard
          title="Total Revenue" // Đổi "Subscriptions" thành "Total Revenue"
          value={formattedRevenue}
          iconName="dollarSign"
          change="+3.5%"
          changeType="up"
        />
      </div>

      {/* Hàng 3: Các Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ THAY ĐỔI: Thêm wrapper styling (nền, bo góc, bóng) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg dark:border dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Dynamics
          </h3>
          <div className="h-80">
            {salesData.length > 0 ? (
              <SalesBarChart data={salesData} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center pt-10">
                Không có dữ liệu doanh số để hiển thị.
              </p>
            )}
          </div>
        </div>

        {/* ✅ THAY ĐỔI: Thêm wrapper styling */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg dark:border dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Status Distribution
          </h3>
          <div className="h-80">
            {orderStatusData.length > 0 ? (
              <OrderStatusPieChart data={orderStatusData} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center pt-10">
                Không có dữ liệu trạng thái đơn hàng để hiển thị.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hàng 4: Bảng và Danh sách */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✅ THAY ĐỔI: Thêm wrapper styling */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg dark:border dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Order
          </h3>
          <RecentOrdersTable data={recentOrders} />
        </div>

        {/* ✅ THAY ĐỔI: Thêm wrapper styling */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg dark:border dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Selling Products
          </h3>
          <TopProductsList data={topProducts} />
        </div>
      </div>
    </div>
  );
}
