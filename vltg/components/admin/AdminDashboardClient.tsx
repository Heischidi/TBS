"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";

interface Stats {
  total: number; pending: number; completed: number; cancelled: number;
  revenue: number; customers: number;
}
interface Order {
  id: string; orderNumber: string; status: string; totalAmount: any;
  createdAt: string; customer: { name: string };
  items: { quantity: number }[];
}
interface Product { id: string; name: string; stock: number; images: string[]; }

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING_PAYMENT: { label: "Pending", className: "status-pending" },
  PAYMENT_CONFIRMED: { label: "Confirmed", className: "status-confirmed" },
  PROCESSING: { label: "Processing", className: "status-processing" },
  SHIPPED: { label: "Shipped", className: "status-shipped" },
  DELIVERED: { label: "Delivered", className: "status-delivered" },
  CANCELLED: { label: "Cancelled", className: "status-cancelled" },
};

export function AdminDashboardClient({ stats, recentOrders, lowStock }: {
  stats: Stats; recentOrders: Order[]; lowStock: Product[];
}) {
  const kpiCards = [
    { label: "Revenue", value: formatPrice(stats.revenue), accent: true },
    { label: "Orders", value: stats.total },
    { label: "Pending", value: stats.pending },
    { label: "Completed", value: stats.completed },
    { label: "Cancelled", value: stats.cancelled },
    { label: "Customers", value: stats.customers },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl text-white tracking-widest">DASHBOARD</h1>
        <p className="text-text-muted text-xs mt-1 uppercase tracking-widest">Overview</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-white/5 border border-white/5">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-2 p-5"
          >
            <p className="text-text-muted text-[9px] uppercase tracking-widest mb-2">{card.label}</p>
            <p className={cn("font-display text-xl", card.accent ? "text-brand-pink" : "text-white")}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface-2 border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-xs uppercase tracking-widest text-text-secondary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-brand-pink text-[10px] flex items-center gap-1 hover:underline uppercase tracking-widest">
              All <ArrowRight size={10} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-text-muted text-[10px] uppercase tracking-wider">Order</th>
                  <th className="text-left px-3 py-3 text-text-muted text-[10px] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-3 py-3 text-text-muted text-[10px] uppercase tracking-wider">Amount</th>
                  <th className="text-left px-3 py-3 text-text-muted text-[10px] uppercase tracking-wider">Status</th>
                  <th className="text-left px-3 py-3 text-text-muted text-[10px] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-text-muted text-xs">No orders yet</td></tr>
                ) : recentOrders.map((order) => {
                  const s = STATUS_CONFIG[order.status] || { label: order.status, className: "" };
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-brand-pink hover:underline font-mono text-xs">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-text-secondary text-xs">{order.customer.name}</td>
                      <td className="px-3 py-3 text-white text-xs">{formatPrice(Number(order.totalAmount))}</td>
                      <td className="px-3 py-3">
                        <span className={cn("text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider", s.className)}>{s.label}</span>
                      </td>
                      <td className="px-3 py-3 text-text-muted text-xs">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-surface-2 border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-xs uppercase tracking-widest text-text-secondary">Low Stock</h2>
          </div>
          <div className="p-4 space-y-1.5">
            {lowStock.length === 0 ? (
              <p className="text-text-muted text-xs text-center py-6">All products stocked ✓</p>
            ) : lowStock.map((product) => (
              <Link key={product.id} href="/admin/inventory" className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                <p className="text-xs text-white line-clamp-1">{product.name}</p>
                <span className={cn("text-[10px] font-mono ml-2 shrink-0", product.stock === 0 ? "text-red-400" : "text-yellow-400")}>
                  {product.stock === 0 ? "OUT" : `${product.stock}`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
