"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatPrice } from "@/lib/utils";

interface Order { createdAt: string; totalAmount: any; status: string; }
interface Product { id: string; name: string; images: string[]; orderItems: { quantity: number; price: any }[]; }
interface Customer { createdAt: string; }

const PINK = "#FF1493";

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
        name: p.name.length > 25 ? p.name.slice(0, 25) + "..." : p.name,
        units: p.orderItems.reduce((a, i) => a + i.quantity, 0),
        revenue: p.orderItems.reduce((a, i) => a + Number(i.price) * i.quantity, 0),
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);
  }, [products]);

  const totalRevenue = orders.reduce((a, o) => a + Number(o.totalAmount), 0);

  const tooltipStyle = {
    backgroundColor: "#111111",
    border: "1px solid #1F1F1F",
    borderRadius: "6px",
    color: "#FFFFFF",
    fontSize: "12px",
  };

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Analytics
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          Sales &amp; store performance overview
        </p>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        {[
          { label: "TOTAL REVENUE", value: formatPrice(totalRevenue), color: PINK },
          { label: "TOTAL ORDERS", value: orders.length, color: "#FFFFFF" },
          { label: "CUSTOMERS", value: customers.length, color: "#FFFFFF" },
          { label: "PRODUCTS", value: products.length, color: "#FFFFFF" },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              borderRadius: "8px",
              padding: "16px 18px",
            }}
          >
            <p style={{ color: "#666666", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
              {k.label}
            </p>
            <p style={{ color: k.color, fontSize: "24px", fontWeight: 700, margin: 0, lineHeight: 1 }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
        <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 20px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Monthly Revenue
        </h2>
        {monthlyRevenue.length === 0 ? (
          <p style={{ color: "#666666", fontSize: "13px", textAlign: "center", padding: "48px 0" }}>No revenue data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
              <XAxis dataKey="month" tick={{ fill: "#666666", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#666666", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => formatPrice(v)} />
              <Bar dataKey="revenue" fill={PINK} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
        <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 20px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Top Selling Products
        </h2>
        {topProducts.length === 0 ? (
          <p style={{ color: "#666666", fontSize: "13px", textAlign: "center", padding: "32px 0" }}>No sales data yet</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {topProducts.map((p, i) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ color: "#666666", fontSize: "12px", width: "20px", textAlign: "right", fontWeight: 600 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600 }}>{p.name}</span>
                    <span style={{ color: "#666666", fontSize: "11px" }}>{p.units} units</span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "#1C1C1E", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: PINK,
                        borderRadius: "3px",
                        width: `${Math.min(100, (p.units / (topProducts[0]?.units || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <span style={{ color: PINK, fontSize: "13px", fontWeight: 700, width: "90px", textAlign: "right" }}>{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
