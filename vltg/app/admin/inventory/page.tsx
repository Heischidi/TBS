import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inventory | TBS Admin" };

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
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-3xl text-white">INVENTORY</h1>
        <p className="text-text-muted text-sm mt-1">{products.length} products tracked</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-sm">
          <p className="text-red-400 text-xs uppercase tracking-wider mb-2">Out of Stock</p>
          <p className="font-display text-3xl text-red-400">{outOfStock.length}</p>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/20 p-5 rounded-sm">
          <p className="text-yellow-400 text-xs uppercase tracking-wider mb-2">Low Stock (≤5)</p>
          <p className="font-display text-3xl text-yellow-400">{lowStock.length}</p>
        </div>
        <div className="bg-neon-pink/10 border border-neon-pink/25 p-5 rounded-sm">
          <p className="text-neon-pink text-xs uppercase tracking-wider mb-2">Healthy Stock</p>
          <p className="font-display text-3xl text-neon-pink">{healthy.length}</p>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-text-muted text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Category</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Stock</th>
              <th className="text-left px-3 py-3 text-text-muted text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-5 py-3 font-medium text-white text-sm">{p.name}</td>
                <td className="px-3 py-3 text-text-secondary text-xs">{p.category?.name}</td>
                <td className="px-3 py-3">
                  <span className={`text-sm font-bold ${p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-yellow-400" : "text-neon-pink"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider ${
                    p.stock === 0 ? "border-red-500/30 text-red-400" :
                    p.stock <= 5 ? "border-yellow-400/30 text-yellow-400" :
                    "border-neon-pink/30 text-neon-pink"
                  }`}>
                    {p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? "Low Stock" : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
