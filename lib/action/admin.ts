"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
/**
 * Lấy các số liệu thống kê chính cho Dashboard.
 */
export async function getDashboardStats() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    console.error(
      "Admin access denied. User role:",
      session?.user?.role ?? "User is not logged in"
    );
    return { error: "Không được phép truy cập" };
  }

  try {
    const [orderCount, userCount, approvedCount, revenueResult] =
      await prisma.$transaction([
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.count({
          where: { status: "paid" },
        }),
        prisma.order.aggregate({
          _sum: {
            total: true,
          },
          where: {
            status: "paid",
          },
        }),
      ]);

    const totalRevenue = revenueResult._sum.total || 0;

    return {
      orderCount,
      userCount,
      approvedCount,
      totalRevenue,
    };
  } catch (error: any) {
    console.error("Lỗi khi lấy thống kê dashboard:", error);
    return { error: "Không thể tải dữ liệu thống kê." };
  }
}

/**
 * Lấy dữ liệu doanh số theo tháng cho biểu đồ cột.
 */
export async function getSalesDataByMonth() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }

  try {
    // --- BƯỚC 1: ĐỊNH NGHĨA PHẠM VI 12 THÁNG ---
    const twelveMonthsAgo = new Date();
    // Đặt ngày về 1 để đảm bảo lấy trọn tháng
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); // Lùi về 11 tháng trước (tổng là 12 tháng)
    twelveMonthsAgo.setHours(0, 0, 0, 0); // Bắt đầu từ 00:00

    // --- BƯỚC 2: KHỞI TẠO MAP 12 THÁNG VỚI GIÁ TRỊ 0 ---
    // (Giữ nguyên logic của bạn, nó rất tốt)
    const salesDataMap = new Map<string, number>();
    for (let i = 0; i < 12; i++) {
      const date = new Date(twelveMonthsAgo);
      date.setMonth(twelveMonthsAgo.getMonth() + i);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short", // "Nov"
        year: "2-digit", // "25"
      });
      salesDataMap.set(monthYear, 0); // Ví dụ: "Nov '25" = 0
    }

    // --- BƯỚC 3: LẤY DỮ LIỆU THẬT TỪ PRISMA ---
    const orders = await prisma.order.findMany({
      where: {
        status: "paid", // Chỉ lấy đơn hàng đã hoàn thành
        createdAt: {
          gte: twelveMonthsAgo, // Lớn hơn hoặc bằng 12 tháng trước
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // --- BƯỚC 4: GỘP DỮ LIỆU THẬT VÀO MAP ---
    orders.forEach((order) => {
      // Chuyển ngày tạo đơn hàng thành key (ví dụ: "Nov '25")
      const monthYear = order.createdAt.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });

      // Lấy giá trị hiện tại, cộng dồn, và đặt lại vào Map
      const currentSales = salesDataMap.get(monthYear) || 0;
      salesDataMap.set(monthYear, currentSales + (order.total || 0));
    });

    // --- BƯỚC 5: CHUYỂN ĐỔI MAP SANG MẢNG CHO BIỂU ĐỒ ---
    // (Giữ nguyên logic của bạn)
    const formattedSalesData = Array.from(salesDataMap.entries()).map(
      ([month, sales]) => ({
        month,
        sales,
      })
    );

    return { data: formattedSalesData };
  } catch (error: any) {
    console.error("Lỗi khi lấy dữ liệu doanh số theo tháng:", error);
    return { error: "Không thể tải dữ liệu doanh số." };
  }
}

/**
 * Lấy dữ liệu trạng thái đơn hàng cho biểu đồ tròn.
 */
export async function getOrderStatusData() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }

  try {
    // Logic lấy order status (giữ nguyên)...
    // ...
    // (Giữ nguyên logic getOrderStatusData của bạn ở đây)
    // ...
    // Giả sử trả về:
    const orderStatuses = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    const totalOrders = orderStatuses.reduce(
      (sum, item) => sum + item._count.status,
      0
    );
    const formattedStatusData = orderStatuses.map((item) => ({
      name: item.status,
      value: item._count.status,
      percentage:
        totalOrders > 0 ? (item._count.status / totalOrders) * 100 : 0,
    }));
    return { data: formattedStatusData };
  } catch (error: any) {
    console.error("Lỗi khi lấy dữ liệu trạng thái đơn hàng:", error);
    return { error: "Không thể tải dữ liệu trạng thái đơn hàng." };
  }
}

/**
 * HÀM MỚI: Lấy 5 đơn hàng gần nhất
 */
export async function getRecentOrders() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }

  try {
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
    return { data: orders };
  } catch (error: any) {
    console.error("Lỗi khi lấy đơn hàng gần đây:", error);
    return { error: "Không thể tải đơn hàng." };
  }
}

/**
 * HÀM MỚI: Lấy 5 sản phẩm bán chạy nhất
 */
export async function getTopSellingProducts() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }

  try {
    // 1. Đếm số lượng bán của mỗi sản phẩm từ OrderItem
    const productSales = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          status: "paid", // Chỉ tính các đơn đã hoàn thành
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    // 2. Lấy thông tin chi tiết (tên, ảnh) của các sản phẩm đó
    const productIds = productSales.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        images: true, // Lấy mảng images
      },
    });

    // 3. Gộp 2 kết quả lại
    const topProducts = productSales.map((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      return {
        id: product?.id || sale.productId,
        name: product?.name || "Sản phẩm không xác định",
        thumbnail: product?.images?.[0] || null, // Lấy ảnh đầu tiên làm thumbnail
        sold: sale._sum.quantity || 0,
      };
    });

    // Sắp xếp lại mảng cuối cùng (vì findMany không giữ thứ tự của `in`)
    topProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));

    return { data: topProducts };
  } catch (error: any) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
    return { error: "Không thể tải sản phẩm." };
  }
}
export async function deleteUser(userId: string) {
  const session = await auth();

  // 1. Xác thực Admin
  if (session?.user?.role !== "admin") {
    return { error: "Không được phép truy cập" };
  }
  if (!userId) {
    return { error: "Không tìm thấy người dùng." };
  }

  // 2. ✅ Kiểm tra an toàn: Không cho admin tự xóa chính mình
  if (session.user.id === userId) {
    return { error: "Không thể tự xóa tài khoản của chính mình." };
  }

  // 3. Xóa khỏi CSDL
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/dashboard/customers");

    return { success: "Đã xóa khách hàng thành công." };
  } catch (error: any) {
    console.error("Lỗi khi xóa người dùng:", error);

    // Xử lý lỗi nếu user này vẫn còn liên kết (ví dụ: orders)
    // (Giả sử schema của bạn có ràng buộc khóa ngoại)
    if (error.code === "P2003") {
      return {
        error:
          "Không thể xóa khách hàng này vì họ đang được liên kết với các đơn hàng.",
      };
    }
    return { error: "Đã xảy ra lỗi không xác định." };
  }
}
//action/admin.ts
