"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Trash2, Upload, Loader2, Edit } from "lucide-react";
import { slugify, cn } from "@/lib/utils";

interface Collection { id: string; name: string; slug: string; description?: string | null; coverImage?: string | null; isActive: boolean; _count: { products: number }; }
interface Category { id: string; name: string; }

export function AdminCollectionsClient({ collections: initialCollections, categories }: {
  collections: Collection[]; categories: Category[];
}) {
  const [collections, setCollections] = useState(initialCollections);
  const [form, setForm] = useState({ name: "", slug: "", description: "", coverImage: "", isActive: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { urls } = await res.json();
    setForm((f) => ({ ...f, coverImage: urls[0] }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    const res = await fetch("/api/collections", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const col = await res.json();
      setCollections((prev) => [{ ...col, _count: { products: 0 } }, ...prev]);
      setForm({ name: "", slug: "", description: "", coverImage: "", isActive: true });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    await fetch(`/api/collections/${id}`, { method: "DELETE" });
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="font-display text-3xl text-white">COLLECTIONS</h1>

      {/* Create form */}
      <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
        <h2 className="font-display text-lg tracking-wider mb-5">NEW COLLECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1.5">Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} className="w-full input-dark px-3 py-2.5 text-sm" placeholder="SS25 Heat Season" id="col-name" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1.5">Slug</label>
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full input-dark px-3 py-2.5 text-sm" placeholder="ss25-heat-season" id="col-slug" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1.5">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full input-dark px-3 py-2.5 text-sm" placeholder="Summer 2025 drop" id="col-desc" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1.5">Cover Image</label>
            <div className="border-2 border-dashed border-white/10 p-6 text-center cursor-pointer hover:border-brand-pink/50 transition-colors rounded-sm" onClick={() => fileRef.current?.click()}>
              {form.coverImage ? (
                <div className="relative h-28"><Image src={form.coverImage} alt="Preview" fill className="object-cover rounded-sm" /></div>
              ) : uploading ? (
                <Loader2 size={20} className="mx-auto text-brand-pink animate-spin" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted"><Upload size={18} /><p className="text-xs">Upload cover image</p></div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadImage(e.target.files[0])} id="col-image-input" />
            </div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving || !form.name} className="mt-4 bg-brand-pink text-white px-6 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-brand-pink/80 transition-colors disabled:opacity-50 flex items-center gap-2" id="save-collection-btn">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Plus size={14} /> Create Collection</>}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {collections.map((col) => (
          <motion.div key={col.id} layout className="flex items-center gap-4 bg-surface-2 border border-white/5 p-4 rounded-sm">
            <div className="relative w-16 h-12 bg-surface-3 rounded-sm overflow-hidden shrink-0">
              {col.coverImage && <Image src={col.coverImage} alt={col.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{col.name}</p>
              <p className="text-text-muted text-xs font-mono">{col.slug}</p>
              {col.description && <p className="text-text-secondary text-xs mt-0.5">{col.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-brand-pink text-xs">{col._count.products} products</span>
              <span className={cn("text-[10px] px-2 py-0.5 border rounded-full", col.isActive ? "border-neon-pink/30 text-neon-pink" : "border-white/10 text-text-muted")}>{col.isActive ? "Active" : "Hidden"}</span>
              <button onClick={() => handleDelete(col.id)} className="text-text-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
        {collections.length === 0 && <p className="text-text-muted text-sm text-center py-8">No collections yet</p>}
      </div>
    </div>
  );
}
