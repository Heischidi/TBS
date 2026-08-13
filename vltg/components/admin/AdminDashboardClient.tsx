"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart, Clock, CheckCircle, XCircle,
  Users, AlertTriangle, Plus, BarChart2, Settings,
  ShoppingBag, Check,
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
  const kpiCards = [
    { label: "TOTAL ORDERS", value: stats.total,               icon: ShoppingCart, valueColor: "#FFFFFF", iconColor: "#888888", bgIcon: "#1F1F1F" },
    { label: "PENDING",      value: stats.pending,             icon: Clock,        valueColor: "#F59E0B", iconColor: "#F59E0B", bgIcon: "rgba(245, 158, 11, 0.15)" },
    { label: "COMPLETED",    value: stats.completed,           icon: CheckCircle,  valueColor: "#FFFFFF", iconColor: "#888888", bgIcon: "#1F1F1F" },
    { label: "CANCELLED",    value: stats.cancelled,           icon: XCircle,      valueColor: "#EF4444", iconColor: "#EF4444", bgIcon: "rgba(239, 68, 68, 0.15)" },
    { label: "REVENUE",      value: formatPrice(stats.revenue), icon: null,         valueColor: "#FFFFFF", iconText: "N",        bgIcon: "#1F1F1F" },
    { label: "CUSTOMERS",    value: stats.customers,           icon: Users,        valueColor: "#FFFFFF", iconColor: "#888888", bgIcon: "#1F1F1F" },
  ];

  const quickActions = [
    { label: "Add Product",    sub: "Create a new listing",  icon: Plus,      href: "/admin/products",  iconColor: PINK, iconBg: "rgba(255, 20, 147, 0.15)" },
    { label: "View Reports",   sub: "Analytics & insights",  icon: BarChart2, href: "/admin/analytics", iconColor: "#888888", iconBg: "#222224" },
    { label: "Store Settings", sub: "Configure your store",  icon: Settings,  href: "/admin/content",   iconColor: "#888888", iconBg: "#222224" },
  ];

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── Dashboard Title ──────────────────────────────────────────────── */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Dashboard
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          Welcome back. Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* ── KPI Cards Row (6 Cards Grid) ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "86px",
            }}
          >
            {/* Card Header Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#666666", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {card.label}
              </span>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "4px",
                  backgroundColor: card.bgIcon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {card.icon ? (
                  <card.icon size={12} style={{ color: card.iconColor }} />
                ) : (
                  <span style={{ color: "#888888", fontSize: "10px", fontWeight: 700 }}>{card.iconText}</span>
                )}
              </div>
            </div>

            {/* Card Value */}
            <p style={{ color: card.valueColor, fontSize: "22px", fontWeight: 700, margin: 0, lineHeight: 1 }}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── 2-Column Main Layout ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "20px", alignItems: "start" }}>

        {/* Left Box: Recent Orders */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1F1F1F" }}>
            <div>
              <h2 style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 700, margin: 0 }}>Recent Orders</h2>
              <p style={{ color: "#666666", fontSize: "11px", margin: "2px 0 0 0" }}>Latest transactions from your store</p>
            </div>
            <Link
              href="/admin/orders"
              style={{ color: PINK, fontSize: "12px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
            >
              View All -&gt;
            </Link>
          </div>

          {/* Body */}
          {recentOrders.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#1A1A1C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <ShoppingBag size={24} style={{ color: "#48484A" }} />
              </div>
              <p style={{ color: "#999999", fontSize: "13px", fontWeight: 600, margin: 0 }}>No orders yet</p>
              <p style={{ color: "#555555", fontSize: "11px", margin: "4px 0 0 0" }}>Orders will appear here once customers start buying.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1F1F1F" }}>
                    {["Order", "Customer", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const s = STATUS_CONFIG[order.status] || { label: order.status, className: "" };
                    return (
                      <tr key={order.id} style={{ borderBottom: "1px solid #1A1A1A" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <Link href={`/admin/orders/${order.id}`} style={{ color: PINK, textDecoration: "none", fontFamily: "monospace", fontSize: "11px" }}>
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#AAAAAA" }}>{order.customer.name}</td>
                        <td style={{ padding: "12px 16px", color: "#FFFFFF", fontWeight: 500 }}>{formatPrice(Number(order.totalAmount))}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className={cn("text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider", s.className)}>{s.label}</span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#666666", fontSize: "11px" }}>{formatDateTime(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Low Stock + Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Low Stock Panel */}
          <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 16px", borderBottom: "1px solid #1F1F1F" }}>
              <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: 0 }}>Low Stock</h2>
            </div>

            <div style={{ padding: "16px" }}>
              {lowStock.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px", textAlign: "center" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Check size={20} style={{ color: "#10B981" }} />
                  </div>
                  <p style={{ color: "#CCCCCC", fontSize: "12px", fontWeight: 600, margin: 0 }}>All products well stocked</p>
                  <p style={{ color: "#666666", fontSize: "10px", margin: "2px 0 0 0" }}>Inventory levels are healthy</p>
                </div>
              ) : lowStock.map((product) => (
                <Link
                  key={product.id}
                  href="/admin/inventory"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justify: "space-between",
                    padding: "8px 10px",
                    textDecoration: "none",
                    borderRadius: "4px",
                    marginBottom: "4px",
                  }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <p style={{ color: "#FFFFFF", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {product.name}
                  </p>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: product.stock === 0 ? "#EF4444" : "#F59E0B", marginLeft: "8px", flexShrink: 0 }}>
                    {product.stock === 0 ? "OUT" : `${product.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "16px" }}>
            <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 12px 0" }}>Quick Actions</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    backgroundColor: "#161618",
                    border: "1px solid #222224",
                    borderRadius: "8px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      backgroundColor: action.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <action.icon size={14} style={{ color: action.iconColor }} />
                  </div>
                  <div>
                    <p style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 700, margin: 0 }}>{action.label}</p>
                    <p style={{ color: "#666666", fontSize: "10px", margin: "1px 0 0 0" }}>{action.sub}</p>
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
