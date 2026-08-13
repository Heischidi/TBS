import { db } from "@/lib/db";
import type { Metadata } from "next";
import { Users } from "lucide-react";

export const metadata: Metadata = { title: "Customers | TBS Admin" };

const PINK = "#FF1493";

export default async function AdminCustomersPage() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Customers
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          {customers.length} total customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table Box */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1F1F1F" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Phone</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Orders</th>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1C1C1E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Users size={22} style={{ color: "#555555" }} />
                    </div>
                    <p style={{ color: "#999999", fontSize: "13px", fontWeight: 600, margin: 0 }}>No customers yet</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #1A1A1A" }} className="hover:bg-white/2 transition-colors">
                    <td style={{ padding: "12px 16px", color: "#FFFFFF", fontWeight: 600, fontSize: "13px" }}>{c.name}</td>
                    <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>{c.email}</td>
                    <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>{c.phone || "—"}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ color: PINK, fontSize: "12px", fontWeight: 700 }}>{c._count.orders}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666666", fontSize: "11px" }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
