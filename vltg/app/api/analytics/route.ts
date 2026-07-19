import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers,
      lowStockProducts,
      recentOrders,
      revenue,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: "PENDING_PAYMENT" } }),
      db.order.count({ where: { status: "DELIVERED" } }),
      db.order.count({ where: { status: "CANCELLED" } }),
      db.customer.count(),
      db.product.count({ where: { stock: { lte: 5 }, isPublished: true } }),
      db.order.findMany({
        take: 10, orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true, email: true } }, items: { select: { quantity: true, price: true } } },
      }),
      db.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
    ]);

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyOrders = await db.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, status: { not: "CANCELLED" } },
      select: { createdAt: true, totalAmount: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    monthlyOrders.forEach((order) => {
      const key = new Date(order.createdAt).toLocaleString("en", { month: "short", year: "2-digit" });
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + Number(order.totalAmount);
    });

    return NextResponse.json({
      stats: {
        totalOrders, pendingOrders, completedOrders, cancelledOrders,
        totalCustomers, lowStockProducts,
        totalRevenue: Number(revenue._sum.totalAmount || 0),
      },
      recentOrders,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
