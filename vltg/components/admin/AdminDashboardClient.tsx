"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart, Clock, CheckCircle, XCircle,
  DollarSign, Users, AlertTriangle,
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

const PINK = "#FF1493";

export function AdminDashboardClient({ stats, recentOrders, lowStock }: {
  stats: Stats; recentOrders: Order[]; lowStock: Product[];
}) {
  const kpiStats = [
    { label: "Total Orders", value: stats.total,               icon: ShoppingCart, valueColor: "#fff" },
    { label: "Pending",      value: stats.pending,             icon: Clock,        valueColor: "#F59E0B" },
    { label: "Completed",    value: stats.completed,           icon: CheckCircle,  valueColor: "#fff" },
    { label: "Cancelled",    value: stats.cancelled,           icon: XCircle,      valueColor: "#EF4444" },
    { label: "Revenue",      value: formatPrice(stats.revenue), icon: DollarSign,  valueColor: "#fff" },
    { label: "Customers",    value: stats.customers,           icon: Users,        valueColor: "#fff" },
  ];

  const quickActions = [
    { label: "Add Product",    sub: "Create a new listing",  icon: Plus,      href: "/admin/products",  iconColor: PINK },
    { label: "View Reports",   sub: "Analytics & insights",  icon: BarChart2, href: "/admin/analytics", iconColor: "#9A9A9A" },
    { label: "Store Settings", sub: "Configure your store",  icon: Settings,  href: "/admin/content",   iconColor: "#9A9A9A" },
  ];

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* ── Title ───────────────────────────────────────────── */}
      <div>
        <h1 style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          Dashboard
        </h1>
        <p style={{ color: "#5A5A5A", fontSize: 13, marginTop: 6 }}>
          Welcome back. Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* ── KPI row with dividers ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {kpiStats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: "1rem 1.25rem",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#5A5A5A", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500 }}>
                {stat.label}
              </span>
              <stat.icon size={13} style={{ color: stat.valueColor === "#fff" ? "#5A5A5A" : stat.valueColor, flexShrink: 0 }} />
            </div>
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 700, fontSize: "1.75rem", color: stat.valueColor, lineHeight: 1 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── Two-column layout ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>

        {/* Recent Orders */}
        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif" }}>Recent Orders</h2>
              <p style={{ color: "#5A5A5A", fontSize: 11, marginTop: 2 }}>Latest transactions from your store</p>
            </div>
            <Link href="/admin/orders" style={{ color: PINK, fontSize: 11, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginTop: 2, whiteSpace: "nowrap" }}>
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1rem", gap: "0.75rem", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={20} style={{ color: "#3D3D3D" }} />
              </div>
              <p style={{ color: "#9A9A9A", fontSize: 13, fontWeight: 500 }}>No orders yet</p>
              <p style={{ color: "#5A5A5A", fontSize: 11 }}>Orders will appear here once customers start buying.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Order", "Customer", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "0.6rem 1rem", color: "#5A5A5A", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const s = STATUS_CONFIG[order.status] || { label: order.status, className: "" };
                    return (
                      <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.7rem 1rem" }}>
                          <Link href={`/admin/orders/${order.id}`} style={{ color: PINK, textDecoration: "none", fontFamily: "monospace", fontSize: 11 }}>
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td style={{ padding: "0.7rem 1rem", color: "#9A9A9A", fontSize: 12 }}>{order.customer.name}</td>
                        <td style={{ padding: "0.7rem 1rem", color: "#fff", fontSize: 12 }}>{formatPrice(Number(order.totalAmount))}</td>
                        <td style={{ padding: "0.7rem 1rem" }}>
                          <span className={cn("text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider", s.className)}>{s.label}</span>
                        </td>
                        <td style={{ padding: "0.7rem 1rem", color: "#5A5A5A", fontSize: 11 }}>{formatDateTime(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Low Stock */}
          <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <AlertTriangle size={13} style={{ color: "#F59E0B" }} />
              <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif" }}>Low Stock</h2>
            </div>
            <div style={{ padding: "0.5rem" }}>
              {lowStock.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 1rem", gap: "0.5rem", textAlign: "center" }}>
                  <CheckCircle size={20} style={{ color: PINK }} />
                  <p style={{ color: "#9A9A9A", fontSize: 12, fontWeight: 500 }}>All products well stocked</p>
                  <p style={{ color: "#5A5A5A", fontSize: 10 }}>Inventory levels are healthy.</p>
                </div>
              ) : lowStock.map((product) => (
                <Link key={product.id} href="/admin/inventory" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", textDecoration: "none", borderRadius: 2 }} className="hover:bg-white/5 transition-colors">
                  <p style={{ color: "#fff", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</p>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: product.stock === 0 ? "#EF4444" : "#F59E0B", marginLeft: 8, flexShrink: 0 }}>
                    {product.stock === 0 ? "OUT" : `${product.stock}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif" }}>Quick Actions</h2>
            </div>
            <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0.75rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 2,
                    textDecoration: "none",
                  }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <action.icon size={14} style={{ color: action.iconColor, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{action.label}</p>
                    <p style={{ color: "#5A5A5A", fontSize: 10, marginTop: 1 }}>{action.sub}</p>
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
