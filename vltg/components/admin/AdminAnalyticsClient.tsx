"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { formatPrice } from "@/lib/utils";

interface Order { createdAt: string; totalAmount: any; status: string; }
interface Product { id: string; name: string; images: string[]; orderItems: { quantity: number; price: any }[]; }
interface Customer { createdAt: string; }

export function AdminAnalyticsClient({ orders, products, customers }: {
  orders: Order[]; products: Product[]; customers: Customer[];
}) {
  const monthlyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleString("en", { month: "short", year: "2-digit" });
      map[key] = (map[key] || 0) + Number(o.totalAmount);
    });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue })).slice(-6);
  }, [orders]);

  const topProducts = useMemo(() => {
    return products
      .map((p) => ({
        name: p.name.length > 20 ? p.name.slice(0, 20) + "..." : p.name,
        units: p.orderItems.reduce((a, i) => a + i.quantity, 0),
        revenue: p.orderItems.reduce((a, i) => a + Number(i.price) * i.quantity, 0),
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);
  }, [products]);

  const totalRevenue = orders.reduce((a, o) => a + Number(o.totalAmount), 0);

  const tooltipStyle = {
    backgroundColor: "#111111",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#F5F5F5",
    fontSize: "12px",
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl text-white">ANALYTICS</h1>
        <p className="text-text-muted text-sm mt-1">Sales performance overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatPrice(totalRevenue) },
          { label: "Total Orders", value: orders.length },
          { label: "Total Customers", value: customers.length },
          { label: "Total Products", value: products.length },
        ].map((k) => (
          <div key={k.label} className="bg-surface-2 border border-white/5 p-5 rounded-sm">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{k.label}</p>
            <p className="font-display text-2xl text-brand-pink">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
        <h2 className="font-display text-lg tracking-wider mb-6">MONTHLY REVENUE</h2>
        {monthlyRevenue.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-12">No revenue data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#7A7A7A", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#7A7A7A", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => formatPrice(v)} />
              <Bar dataKey="revenue" fill="#FF1493" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
        <h2 className="font-display text-lg tracking-wider mb-6">TOP SELLING PRODUCTS</h2>
        {topProducts.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">No sales data yet</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="text-text-muted text-xs w-5 text-right">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white">{p.name}</span>
                    <span className="text-xs text-text-muted">{p.units} units</span>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full">
                    <div
                      className="h-full bg-brand-pink rounded-full"
                      style={{ width: `${Math.min(100, (p.units / (topProducts[0]?.units || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-brand-pink w-20 text-right">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
