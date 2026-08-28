import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inventory | TBS Admin" };

const PINK = "#6B7C3A";

export default async function AdminInventoryPage() {
  const products = await db.product.findMany({
    where: { isPublished: true },
    orderBy: { stock: "asc" },
    select: { id: true, name: true, stock: true, images: true, category: { select: { name: true } } },
  });

  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const healthy = products.filter(p => p.stock > 5);

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Inventory
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          {products.length} products tracked
        </p>
      </div>

      {/* Summary Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "16px 18px" }}>
          <p style={{ color: "#EF4444", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
            Out of Stock
          </p>
          <p style={{ color: "#EF4444", fontSize: "28px", fontWeight: 700, margin: 0, lineHeight: 1 }}>
            {outOfStock.length}
          </p>
        </div>
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "16px 18px" }}>
          <p style={{ color: "#F59E0B", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
            Low Stock (&le;5)
          </p>
          <p style={{ color: "#F59E0B", fontSize: "28px", fontWeight: 700, margin: 0, lineHeight: 1 }}>
            {lowStock.length}
          </p>
        </div>
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "16px 18px" }}>
          <p style={{ color: PINK, fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
            Healthy Stock
          </p>
          <p style={{ color: PINK, fontSize: "28px", fontWeight: 700, margin: 0, lineHeight: 1 }}>
            {healthy.length}
          </p>
        </div>
      </div>

      {/* Products Table Box */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1F1F1F" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Product</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Category</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Stock</th>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #1A1A1A" }} className="hover:bg-white/2 transition-colors">
                  <td style={{ padding: "12px 16px", color: "#FFFFFF", fontWeight: 600, fontSize: "13px" }}>{p.name}</td>
                  <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>{p.category?.name}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: p.stock === 0 ? "#EF4444" : p.stock <= 5 ? "#F59E0B" : PINK }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      border: p.stock === 0 ? "1px solid rgba(239, 68, 68, 0.4)" : p.stock <= 5 ? "1px solid rgba(245, 158, 11, 0.4)" : `1px solid ${PINK}`,
                      color: p.stock === 0 ? "#EF4444" : p.stock <= 5 ? "#F59E0B" : PINK,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
