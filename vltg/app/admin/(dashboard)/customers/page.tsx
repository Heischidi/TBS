import { db } from "@/lib/db";
import type { Metadata } from "next";
import { AdminCustomersClient } from "@/components/admin/AdminCustomersClient";

export const metadata: Metadata = { title: "Customers | TBS Admin" };

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
      user: { select: { role: true } },
    },
  });

  const serialized = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    ordersCount: c._count.orders,
    userRole: c.user?.role ?? null,
    createdAt: c.createdAt.toISOString(),
  }));

  return <AdminCustomersClient initialCustomers={serialized} />;
}
