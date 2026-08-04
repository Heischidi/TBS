"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Package, Eye, EyeOff } from "lucide-react";
import { formatPrice, formatDate, cn } from "@/lib/utils";

interface Product {
  id: string; slug: string; name: string; price: any; stock: number;
  images: string[]; isPublished: boolean; isNewArrival: boolean;
  isBestSeller: boolean; isTrending: boolean; isFeatured: boolean;
  category: { name: string }; createdAt: string;
}

const BADGE_CLASS = "text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider";

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
    const res = await fetch(`/api/products?${params}&isPublished=`);
    // Fetch ALL including unpublished for admin
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
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-white">PRODUCTS</h1>
          <p className="text-text-muted text-sm mt-1">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-brand-pink text-white px-5 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-brand-pink/80 transition-colors"
          id="add-product-btn"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="w-full input-dark pl-9 pr-4 py-2.5 text-sm"
          id="product-search"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-text-muted text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Category</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Price</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Stock</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Tags</th>
                <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Status</th>
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
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-text-muted">
                  <Package size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No products found</p>
                  <Link href="/admin/products/new" className="text-brand-pink text-xs mt-2 inline-block hover:underline">Add your first product</Link>
                </td></tr>
              ) : products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors"
                >
                  {/* Product */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-surface-3 rounded-sm overflow-hidden shrink-0">
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package size={14} className="text-text-muted" /></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm line-clamp-1">{product.name}</p>
                        <p className="text-text-muted text-[10px] font-mono">{product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-text-secondary text-xs">{product.category?.name}</td>
                  <td className="px-3 py-3 font-medium text-xs">{formatPrice(Number(product.price))}</td>
                  <td className="px-3 py-3">
                     <span className={cn("text-xs font-bold", product.stock === 0 ? "text-red-400" : product.stock <= 5 ? "text-yellow-400" : "text-neon-pink")}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.isNewArrival && <span className={cn(BADGE_CLASS, "bg-neon-pink/20 text-neon-pink")}>New</span>}
                      {product.isBestSeller && <span className={cn(BADGE_CLASS, "bg-neon-pink/20 text-neon-pink")}>Best</span>}
                      {product.isTrending && <span className={cn(BADGE_CLASS, "bg-grey-600/50 text-grey-100")}>Trend</span>}
                      {product.isFeatured && <span className={cn(BADGE_CLASS, "bg-grey-500/30 text-grey-200")}>Featured</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn("text-[10px] px-2 py-0.5 border rounded-full", product.isPublished ? "border-neon-pink/30 text-neon-pink" : "border-white/10 text-text-muted")}>
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/products/${product.slug}`} target="_blank" className="text-text-muted hover:text-white transition-colors" title="View"><Eye size={14} /></a>
                      <Link href={`/admin/products/${product.id}/edit`} className="text-text-secondary hover:text-brand-pink transition-colors" title="Edit"><Edit size={14} /></Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="text-text-muted hover:text-red-400 transition-colors disabled:opacity-40"
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
