import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers | TBS Admin" };

export default async function AdminCustomersPage() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl text-white">CUSTOMERS</h1>
        <p className="text-text-muted text-sm mt-1">{customers.length} total customers</p>
      </div>

      <div className="bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-text-muted text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Phone</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Orders</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-text-muted text-sm">No customers yet</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-5 py-3 font-medium text-white text-xs">{c.name}</td>
                <td className="px-3 py-3 text-text-secondary text-xs">{c.email}</td>
                <td className="px-3 py-3 text-text-secondary text-xs">{c.phone || "—"}</td>
                <td className="px-3 py-3">
                  <span className="text-brand-pink text-xs font-bold">{c._count.orders}</span>
                </td>
                <td className="px-3 py-3 text-text-muted text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
