"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ChevronDown, Eye } from "lucide-react";
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
  PENDING_PAYMENT: { label: "Pending Payment", className: "status-pending" },
  PAYMENT_CONFIRMED: { label: "Confirmed", className: "status-confirmed" },
  PROCESSING: { label: "Processing", className: "status-processing" },
  SHIPPED: { label: "Shipped", className: "status-shipped" },
  DELIVERED: { label: "Delivered", className: "status-delivered" },
  CANCELLED: { label: "Cancelled", className: "status-cancelled" },
};

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
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl text-white">ORDERS</h1>
        <p className="text-text-muted text-sm mt-1">{total} orders total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search orders..." className="input-dark pl-9 pr-4 py-2.5 text-sm w-52"
            id="order-search"
          />
        </div>
        <div className="relative">
          <select
            value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-dark text-xs py-2.5 pl-3 pr-8 appearance-none cursor-pointer"
            id="order-status-filter"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-text-muted text-xs uppercase tracking-wider">Order #</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Items</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-text-muted text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(null).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array(7).fill(null).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded-sm" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-text-muted text-sm">No orders found</td></tr>
              ) : orders.map((order) => {
                const s = STATUS_CONFIG[order.status] || { label: order.status, className: "" };
                return (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-brand-pink hover:underline font-mono text-xs">
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-white text-xs">{order.customer.name}</p>
                      <p className="text-text-muted text-[10px]">{order.customer.email}</p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary text-xs">
                      {order.items.reduce((a, i) => a + i.quantity, 0)} items
                    </td>
                    <td className="px-3 py-3 font-medium text-xs">{formatPrice(Number(order.totalAmount))}</td>
                    <td className="px-3 py-3">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={cn("text-[10px] px-2 py-1 border rounded-full appearance-none cursor-pointer bg-transparent uppercase tracking-wider disabled:opacity-50", s.className)}
                          id={`order-status-${order.id}`}
                        >
                          {STATUS_OPTIONS.slice(1).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-text-muted text-xs">{formatDateTime(order.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-text-secondary hover:text-white transition-colors"><Eye size={14} /></Link>
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
