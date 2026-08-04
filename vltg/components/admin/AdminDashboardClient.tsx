"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart, Package, Users, TrendingUp, DollarSign,
  AlertTriangle, Clock, CheckCircle, XCircle, ArrowRight
} from "lucide-react";
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
    { label: "Total Orders", value: stats.total, icon: ShoppingCart, color: "text-brand-pink", bg: "bg-brand-pink/10" },
    { label: "Pending Orders", value: stats.pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-neon-pink", bg: "bg-neon-pink/10" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: DollarSign, color: "text-brand-pink", bg: "bg-brand-pink/10", wide: true },
    { label: "Customers", value: stats.customers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl text-white">DASHBOARD</h1>
        <p className="text-text-muted text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn("bg-surface-2 border border-white/5 p-5 rounded-sm", card.wide ? "lg:col-span-2" : "")}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-muted text-xs uppercase tracking-wider">{card.label}</p>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", card.bg)}>
                <card.icon size={14} className={card.color} />
              </div>
            </div>
            <p className={cn("font-display text-2xl", card.color)}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-display text-lg tracking-wider">RECENT ORDERS</h2>
            <Link href="/admin/orders" className="text-brand-pink text-xs flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-text-muted text-xs uppercase tracking-wider">Order</th>
                  <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-text-muted text-xs">No orders yet</td></tr>
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
                      <td className="px-3 py-3 font-medium text-xs">{formatPrice(Number(order.totalAmount))}</td>
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

        {/* Low Stock Alerts */}
        <div className="bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
            <AlertTriangle size={14} className="text-yellow-400" />
            <h2 className="font-display text-lg tracking-wider">LOW STOCK</h2>
          </div>
          <div className="p-4 space-y-2">
            {lowStock.length === 0 ? (
              <p className="text-text-muted text-xs text-center py-6">All products well stocked ✓</p>
            ) : lowStock.map((product) => (
              <Link key={product.id} href={`/admin/products`} className="flex items-center justify-between p-3 bg-surface-3 hover:bg-surface-4 transition-colors rounded-sm">
                <p className="text-sm text-white line-clamp-1">{product.name}</p>
                <span className={cn("text-xs font-bold px-2 py-0.5", product.stock === 0 ? "text-red-400" : "text-yellow-400")}>
                  {product.stock === 0 ? "OUT" : `${product.stock} left`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
