import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminAnalyticsClient } from "@/components/admin/AdminAnalyticsClient";

export const metadata: Metadata = { title: "Analytics | TBS Admin" };

export default async function AdminAnalyticsPage() {
  const [orders, products, customers] = await Promise.all([
    db.order.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { createdAt: true, totalAmount: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    db.product.findMany({
      select: { id: true, name: true, images: true, orderItems: { select: { quantity: true, price: true } } },
    }),
    db.customer.findMany({ select: { createdAt: true }, orderBy: { createdAt: "asc" } }),
  ]);

  return <AdminAnalyticsClient orders={orders as any} products={products as any} customers={customers as any} />;
}
