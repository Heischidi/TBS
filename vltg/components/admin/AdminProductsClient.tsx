"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface Product {
  id: string; slug: string; name: string; price: any; stock: number;
  images: string[]; isPublished: boolean; isNewArrival: boolean;
  isBestSeller: boolean; isTrending: boolean; isFeatured: boolean;
  category: { name: string }; createdAt: string;
}

const PINK = "#FF1493";

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    const adminRes = await fetch(`/api/admin/products?${params}`);
    if (adminRes.ok) {
      const data = await adminRes.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
            Products
          </h1>
          <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            backgroundColor: PINK,
            color: "#000000",
            padding: "10px 18px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
          id="add-product-btn"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "360px" }}>
        <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666666" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
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
          id="product-search"
        />
      </div>

      {/* Table Box */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1F1F1F" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Product</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Category</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Price</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Stock</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Tags</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Status</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1C1C1E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Package size={22} style={{ color: "#555555" }} />
                    </div>
                    <p style={{ color: "#999999", fontSize: "13px", fontWeight: 600, margin: 0 }}>No products found</p>
                    <Link href="/admin/products/new" style={{ color: PINK, fontSize: "12px", marginTop: "6px", display: "inline-block", textDecoration: "none" }}>Add your first product</Link>
                  </td>
                </tr>
              ) : products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ borderBottom: "1px solid #1A1A1A" }}
                  className="hover:bg-white/2 transition-colors"
                >
                  {/* Product */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ position: "relative", width: "40px", height: "48px", backgroundColor: "#1A1A1C", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={14} style={{ color: "#555555" }} /></div>
                        )}
                      </div>
                      <div>
                        <p style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600, margin: 0 }}>{product.name}</p>
                        <p style={{ color: "#666666", fontSize: "10px", fontFamily: "monospace", margin: "2px 0 0 0" }}>{product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>{product.category?.name}</td>
                  <td style={{ padding: "12px 12px", color: "#FFFFFF", fontWeight: 600, fontSize: "13px" }}>{formatPrice(Number(product.price))}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: product.stock === 0 ? "#EF4444" : product.stock <= 5 ? "#F59E0B" : PINK }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: "12px 12px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {product.isNewArrival && <span style={{ fontSize: "9px", padding: "2px 6px", fontWeight: 700, textTransform: "uppercase", backgroundColor: "rgba(255, 20, 147, 0.15)", color: PINK, borderRadius: "4px" }}>New</span>}
                      {product.isBestSeller && <span style={{ fontSize: "9px", padding: "2px 6px", fontWeight: 700, textTransform: "uppercase", backgroundColor: "rgba(255, 20, 147, 0.15)", color: PINK, borderRadius: "4px" }}>Best</span>}
                      {product.isTrending && <span style={{ fontSize: "9px", padding: "2px 6px", fontWeight: 700, textTransform: "uppercase", backgroundColor: "#222224", color: "#CCCCCC", borderRadius: "4px" }}>Trend</span>}
                      {product.isFeatured && <span style={{ fontSize: "9px", padding: "2px 6px", fontWeight: 700, textTransform: "uppercase", backgroundColor: "#222224", color: "#AAAAAA", borderRadius: "4px" }}>Featured</span>}
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "12px", border: product.isPublished ? `1px solid ${PINK}` : "1px solid #333333", color: product.isPublished ? PINK : "#666666" }}>
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                      <a href={`/products/${product.slug}`} target="_blank" style={{ color: "#666666" }} className="hover:text-white transition-colors" title="View"><Eye size={14} /></a>
                      <Link href={`/admin/products/${product.id}/edit`} style={{ color: "#999999" }} className="hover:text-white transition-colors" title="Edit"><Edit size={14} /></Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#666666" }}
                        className="hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
