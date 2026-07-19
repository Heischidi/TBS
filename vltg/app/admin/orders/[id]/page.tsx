import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminOrderDetailClient } from "@/components/admin/AdminOrderDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Detail | TBS Admin" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { customer: true, items: { include: { product: { select: { name: true, images: true, slug: true } } } } },
  });
  if (!order) notFound();
  return <AdminOrderDetailClient order={order as any} />;
}
