"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronDown, Eye, ShoppingBag } from "lucide-react";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";

interface Order {
  id: string; orderNumber: string; status: string; totalAmount: any;
  createdAt: string; customer: { name: string; email: string };
  items: { quantity: number }[];
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING_PAYMENT:   { label: "Pending Payment", className: "status-pending" },
  PAYMENT_CONFIRMED: { label: "Confirmed",       className: "status-confirmed" },
  PROCESSING:        { label: "Processing",      className: "status-processing" },
  SHIPPED:           { label: "Shipped",         className: "status-shipped" },
  DELIVERED:         { label: "Delivered",       className: "status-delivered" },
  CANCELLED:         { label: "Cancelled",       className: "status-cancelled" },
};

const PINK = "#6B7C3A";

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const res = await fetch(`/api/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    }
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    setUpdating(null);
  };

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Orders
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          {total} order{total !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ position: "relative", width: "240px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666666" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders..."
            style={{
              width: "100%",
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              borderRadius: "6px",
              padding: "10px 12px 10px 36px",
              color: "#FFFFFF",
              fontSize: "13px",
              outline: "none",
            }}
            id="order-search"
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            style={{
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              borderRadius: "6px",
              padding: "10px 32px 10px 12px",
              color: "#FFFFFF",
              fontSize: "13px",
              outline: "none",
              cursor: "pointer",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
            id="order-status-filter"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ backgroundColor: "#111111", color: "#FFFFFF" }}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#666666" }} />
        </div>
      </div>

      {/* Table Box */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1F1F1F" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Order #</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Customer</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Items</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Amount</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Status</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Date</th>
                <th style={{ textAlign: "right", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(null).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1A1A1A" }}>
                    {Array(7).fill(null).map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}><div style={{ height: "16px", backgroundColor: "#1A1A1C", borderRadius: "4px" }} /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1C1C1E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <ShoppingBag size={22} style={{ color: "#555555" }} />
                    </div>
                    <p style={{ color: "#999999", fontSize: "13px", fontWeight: 600, margin: 0 }}>No orders found</p>
                  </td>
                </tr>
              ) : orders.map((order) => {
                const s = STATUS_CONFIG[order.status] || { label: order.status, className: "" };
                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid #1A1A1A" }} className="hover:bg-white/2 transition-colors">
                    <td style={{ padding: "12px 16px" }}>
                      <Link href={`/admin/orders/${order.id}`} style={{ color: PINK, textDecoration: "none", fontFamily: "monospace", fontSize: "12px", fontWeight: 600 }}>
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <p style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 600, margin: 0 }}>{order.customer.name}</p>
                      <p style={{ color: "#666666", fontSize: "10px", margin: "2px 0 0 0" }}>{order.customer.email}</p>
                    </td>
                    <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>
                      {order.items.reduce((a, i) => a + i.quantity, 0)} item{order.items.reduce((a, i) => a + i.quantity, 0) !== 1 ? "s" : ""}
                    </td>
                    <td style={{ padding: "12px 12px", color: "#FFFFFF", fontWeight: 600, fontSize: "13px" }}>{formatPrice(Number(order.totalAmount))}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={cn("text-[10px] px-2.5 py-1 border rounded-full appearance-none cursor-pointer bg-transparent uppercase tracking-wider disabled:opacity-50", s.className)}
                        id={`order-status-${order.id}`}
                      >
                        {STATUS_OPTIONS.slice(1).map((o) => (
                          <option key={o.value} value={o.value} style={{ backgroundColor: "#111111", color: "#FFFFFF" }}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "12px 12px", color: "#666666", fontSize: "11px" }}>{formatDateTime(order.createdAt)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <Link href={`/admin/orders/${order.id}`} style={{ color: "#666666" }} className="hover:text-white transition-colors">
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
