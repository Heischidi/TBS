"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart, Clock, CheckCircle, XCircle,
  DollarSign, Users, AlertTriangle, ArrowRight,
  Plus, BarChart2, Settings,
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
  PENDING_PAYMENT:   { label: "Pending",    className: "status-pending" },
  PAYMENT_CONFIRMED: { label: "Confirmed",  className: "status-confirmed" },
  PROCESSING:        { label: "Processing", className: "status-processing" },
  SHIPPED:           { label: "Shipped",    className: "status-shipped" },
  DELIVERED:         { label: "Delivered",  className: "status-delivered" },
  CANCELLED:         { label: "Cancelled",  className: "status-cancelled" },
};

export function AdminDashboardClient({ stats, recentOrders, lowStock }: {
  stats: Stats; recentOrders: Order[]; lowStock: Product[];
}) {
  const kpiCards = [
    { label: "Total Orders", value: stats.total,              icon: ShoppingCart, color: "text-white",       iconBg: "bg-white/10" },
    { label: "Pending",      value: stats.pending,            icon: Clock,        color: "text-yellow-400",  iconBg: "bg-yellow-400/10" },
    { label: "Completed",    value: stats.completed,          icon: CheckCircle,  color: "text-white",       iconBg: "bg-white/10" },
    { label: "Cancelled",    value: stats.cancelled,          icon: XCircle,      color: "text-red-400",     iconBg: "bg-red-400/10" },
    { label: "Revenue",      value: formatPrice(stats.revenue), icon: DollarSign,  color: "text-white",       iconBg: "bg-white/10" },
    { label: "Customers",    value: stats.customers,          icon: Users,        color: "text-white",       iconBg: "bg-white/10" },
  ];

  const quickActions = [
    { label: "Add Product",   sub: "Create a new listing",   icon: Plus,     href: "/admin/products" },
    { label: "View Reports",  sub: "Analytics & insights",   icon: BarChart2, href: "/admin/analytics" },
    { label: "Store Settings", sub: "Configure your store",  icon: Settings, href: "/admin/content" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Title */}
      <div>
        <h1 className="font-display text-3xl text-white">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-surface-2 border border-white/5 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-muted text-[10px] uppercase tracking-wider">{card.label}</p>
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", card.iconBg)}>
                <card.icon size={13} className={card.color} />
              </div>
            </div>
            <p className={cn("font-display text-2xl", card.color)}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders — spans 2 cols */}
        <div className="lg:col-span-2 bg-surface-2 border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-medium text-white">Recent Orders</h2>
              <p className="text-text-muted text-[10px] mt-0.5">Latest transactions from your store</p>
            </div>
            <Link href="/admin/orders" className="text-brand-pink text-xs flex items-center gap-1 hover:underline">
              View All <ArrowRight size={11} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <ShoppingCart size={32} className="text-white/10" />
                <p className="text-white text-sm">No orders yet</p>
                <p className="text-text-muted text-xs">Orders will appear here once customers start buying.</p>
              </div>
            ) : (
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
                  {recentOrders.map((order) => {
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
                          <span className={cn("text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider", s.className)}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-text-muted text-xs">{formatDateTime(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right column — Low Stock + Quick Actions */}
        <div className="flex flex-col gap-4">
          {/* Low Stock */}
          <div className="bg-surface-2 border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <AlertTriangle size={13} className="text-yellow-400" />
              <h2 className="text-sm font-medium text-white">Low Stock</h2>
            </div>
            <div className="p-3 space-y-1">
              {lowStock.length === 0 ? (
                <div className="flex flex-col items-center py-6 gap-1.5 text-center">
                  <CheckCircle size={20} className="text-neon-pink" />
                  <p className="text-white text-xs">All products well stocked</p>
                  <p className="text-text-muted text-[10px]">Inventory levels are looking fine.</p>
                </div>
              ) : lowStock.map((product) => (
                <Link key={product.id} href="/admin/inventory"
                  className="flex items-center justify-between p-2.5 hover:bg-white/5 transition-colors">
                  <p className="text-xs text-white line-clamp-1">{product.name}</p>
                  <span className={cn("text-[10px] font-mono ml-2 shrink-0",
                    product.stock === 0 ? "text-red-400" : "text-yellow-400")}>
                    {product.stock === 0 ? "OUT" : `${product.stock}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-2 border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-medium text-white">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 bg-surface-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-7 h-7 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-pink/10 transition-colors">
                    <action.icon size={13} className="text-text-muted group-hover:text-brand-pink transition-colors" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{action.label}</p>
                    <p className="text-text-muted text-[10px]">{action.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
