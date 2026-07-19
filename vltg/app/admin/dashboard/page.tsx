import { db } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | TBS Admin" };

export default async function AdminDashboardPage() {
  const [stats, recentOrders, lowStockProducts] = await Promise.all([
    (async () => {
      const [total, pending, completed, cancelled, revenue, customers] = await Promise.all([
        db.order.count(),
        db.order.count({ where: { status: "PENDING_PAYMENT" } }),
        db.order.count({ where: { status: "DELIVERED" } }),
        db.order.count({ where: { status: "CANCELLED" } }),
        db.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
        db.customer.count(),
      ]);
      return { total, pending, completed, cancelled, revenue: Number(revenue._sum.totalAmount || 0), customers };
    })(),
    db.order.findMany({
      take: 10, orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } }, items: { select: { quantity: true } } },
    }),
    db.product.findMany({
      where: { stock: { lte: 5 }, isPublished: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
  ]);

  return <AdminDashboardClient stats={stats} recentOrders={recentOrders as any} lowStock={lowStockProducts as any} />;
}
