"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Collection { id: string; name: string; slug: string; description?: string | null; coverImage?: string | null; isActive: boolean; _count: { products: number }; }
interface Category { id: string; name: string; }

const PINK = "#FF1493";

export function AdminCollectionsClient({ collections: initialCollections }: {
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
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Collections
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          Manage your product collections &amp; seasonal drops
        </p>
      </div>

      {/* Create Form Container */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
        <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          New Collection
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
              placeholder="SS25 Heat Season"
              style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }}
              id="col-name"
            />
          </div>
          <div>
            <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
              Slug
            </label>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="ss25-heat-season"
              style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }}
              id="col-slug"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
              Description
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Summer 2025 drop"
              style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }}
              id="col-desc"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
              Cover Image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "1px dashed #222224",
                borderRadius: "6px",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#141416",
              }}
              className="hover:border-white/20 transition-colors"
            >
              {form.coverImage ? (
                <div style={{ position: "relative", height: "112px" }}>
                  <Image src={form.coverImage} alt="Preview" fill style={{ objectFit: "cover", borderRadius: "4px" }} />
                </div>
              ) : uploading ? (
                <Loader2 size={20} style={{ margin: "0 auto", color: PINK }} className="animate-spin" />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "#666666" }}>
                  <Upload size={18} />
                  <p style={{ fontSize: "12px", margin: 0 }}>Upload cover image</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && uploadImage(e.target.files[0])} id="col-image-input" />
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !form.name}
          style={{
            marginTop: "16px",
            backgroundColor: PINK,
            color: "#000000",
            padding: "10px 20px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: saving || !form.name ? 0.5 : 1,
          }}
          id="save-collection-btn"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Plus size={14} /> Create Collection</>}
        </button>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {collections.map((col) => (
          <motion.div
            key={col.id}
            layout
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              padding: "14px 16px",
              borderRadius: "8px",
            }}
          >
            <div style={{ position: "relative", width: "56px", height: "48px", backgroundColor: "#1C1C1E", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
              {col.coverImage && <Image src={col.coverImage} alt={col.name} fill style={{ objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: 0 }}>{col.name}</p>
              <p style={{ color: "#666666", fontSize: "11px", fontFamily: "monospace", margin: "2px 0 0 0" }}>{col.slug}</p>
              {col.description && <p style={{ color: "#AAAAAA", fontSize: "12px", margin: "4px 0 0 0" }}>{col.description}</p>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: PINK, fontSize: "12px", fontWeight: 700 }}>{col._count.products} products</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "12px", border: col.isActive ? `1px solid ${PINK}` : "1px solid #333333", color: col.isActive ? PINK : "#666666" }}>
                {col.isActive ? "Active" : "Hidden"}
              </span>
              <button
                onClick={() => handleDelete(col.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#666666" }}
                className="hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
        {collections.length === 0 && <p style={{ color: "#666666", fontSize: "13px", textAlign: "center", padding: "32px 0" }}>No collections yet</p>}
      </div>
    </div>
  );
}
