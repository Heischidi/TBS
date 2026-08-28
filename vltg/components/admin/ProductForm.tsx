"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, Upload, Loader2, ArrowLeft } from "lucide-react";
import { slugify, cn } from "@/lib/utils";

interface Category { id: string; name: string; slug: string; }
interface Collection { id: string; name: string; slug: string; }

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "One Size"];
const PRESET_COLORS = [
  { name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#7A7A7A" }, { name: "Olive", hex: "#4A4A2A" },
  { name: "Navy", hex: "#001F5A" }, { name: "Red", hex: "#CC0000" },
  { name: "Beige", hex: "#D4C5A9" }, { name: "Brown", hex: "#4A2C17" },
];

interface Props {
  categories: Category[];
  collections: Collection[];
  product?: any;
}

const PINK = "#6B7C3A";

export function ProductForm({ categories, collections, product }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price ? String(product.price) : "",
    comparePrice: product?.comparePrice ? String(product.comparePrice) : "",
    stock: product?.stock ? String(product.stock) : "0",
    categoryId: product?.categoryId || "",
    collectionId: product?.collectionId || "",
    isNewArrival: product?.isNewArrival || false,
    isFeatured: product?.isFeatured || false,
    isBestSeller: product?.isBestSeller || false,
    isTrending: product?.isTrending || false,
    isPublished: product?.isPublished !== false,
  });

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(product?.colors || []);
  const [colorInput, setColorInput] = useState({ name: "", hex: "#000000" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: isEditing ? f.slug : slugify(name) }));
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { urls } = await res.json();
      setImages((prev) => [...prev, ...urls]);
    }
    setUploading(false);
  };

  const toggleSize = (size: string) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const addColor = () => {
    if (!colorInput.name) return;
    if (colors.find((c) => c.name === colorInput.name)) return;
    setColors((prev) => [...prev, { ...colorInput }]);
    setColorInput({ name: "", hex: "#000000" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { setError("Please select a category"); return; }
    setSaving(true);
    setError("");

    const payload = { ...form, images, sizes, colors };
    const url = isEditing ? `/api/products/${product.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save product");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#161618",
    border: "1px solid #222224",
    borderRadius: "6px",
    padding: "10px 12px",
    color: "#FFFFFF",
    fontSize: "13px",
    outline: "none",
  };
  const labelStyle = {
    display: "block",
    color: "#666666",
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    fontWeight: 700,
    marginBottom: "6px",
  };

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#666666" }} className="hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
          <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
            {isEditing ? `Editing: ${product.name}` : "Add a new product listing to your store"}
          </p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", fontSize: "13px", padding: "12px 16px", borderRadius: "6px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "24px", alignItems: "start" }}>
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Basic Info */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Product Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} style={inputStyle} placeholder="e.g. Oversized Drop Tee" required id="product-name" />
                </div>
                <div>
                  <label style={labelStyle}>URL Slug *</label>
                  <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} style={inputStyle} placeholder="oversized-drop-tee" required id="product-slug" />
                </div>
                <div>
                  <label style={labelStyle}>Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, height: "120px", resize: "none" }} placeholder="Describe the product..." required id="product-desc" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Price (₦) *</label>
                    <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} style={inputStyle} placeholder="15000" required min="0" id="product-price" />
                  </div>
                  <div>
                    <label style={labelStyle}>Compare Price (₦)</label>
                    <input type="number" value={form.comparePrice} onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))} style={inputStyle} placeholder="20000" min="0" id="product-compare-price" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} style={inputStyle} min="0" id="product-stock" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Product Images
              </h2>
              <div
                style={{ border: "1px dashed #222224", borderRadius: "6px", padding: "28px", textAlign: "center", cursor: "pointer", backgroundColor: "#141416" }}
                onClick={() => fileRef.current?.click()}
                className="hover:border-white/20 transition-colors"
              >
                {uploading ? (
                  <Loader2 size={24} style={{ margin: "0 auto", color: PINK }} className="animate-spin" />
                ) : (
                  <>
                    <Upload size={22} style={{ margin: "0 auto 8px", color: "#666666" }} />
                    <p style={{ color: "#CCCCCC", fontSize: "13px", margin: 0 }}>Click to upload or drag &amp; drop</p>
                    <p style={{ color: "#666666", fontSize: "11px", margin: "2px 0 0 0" }}>PNG, JPG up to 10MB each</p>
                  </>
                )}
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)} id="product-images-input" />
              </div>
              {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px", marginTop: "16px" }}>
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square group" style={{ borderRadius: "4px", overflow: "hidden", backgroundColor: "#1C1C1E" }}>
                      <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "#EF4444", border: "none", borderRadius: "50%", padding: "3px", cursor: "pointer", color: "#FFF" }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                      {i === 0 && <span style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "8px", backgroundColor: PINK, color: "#000", fontWeight: 700, padding: "1px 4px", borderRadius: "2px" }}>MAIN</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Sizes
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {COMMON_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      border: sizes.includes(size) ? `1px solid ${PINK}` : "1px solid #222224",
                      backgroundColor: sizes.includes(size) ? "rgba(255, 20, 147, 0.12)" : "transparent",
                      color: sizes.includes(size) ? PINK : "#999999",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Colors
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      if (colors.find((c) => c.name === color.name)) {
                        setColors((prev) => prev.filter((c) => c.name !== color.name));
                      } else {
                        setColors((prev) => [...prev, color]);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: colors.find((c) => c.name === color.name) ? `1px solid ${PINK}` : "1px solid #222224",
                      backgroundColor: colors.find((c) => c.name === color.name) ? "rgba(255, 20, 147, 0.12)" : "transparent",
                      color: colors.find((c) => c.name === color.name) ? PINK : "#999999",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Organization */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Organization
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }} id="product-category" required>
                    <option value="" style={{ backgroundColor: "#111111" }}>Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id} style={{ backgroundColor: "#111111" }}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Collection</label>
                  <select value={form.collectionId} onChange={(e) => setForm((f) => ({ ...f, collectionId: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }} id="product-collection">
                    <option value="" style={{ backgroundColor: "#111111" }}>None</option>
                    {collections.map((col) => <option key={col.id} value={col.id} style={{ backgroundColor: "#111111" }}>{col.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Product Tags
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { key: "isPublished", label: "Published" },
                  { key: "isFeatured", label: "Featured" },
                  { key: "isNewArrival", label: "New Arrival" },
                  { key: "isBestSeller", label: "Best Seller" },
                  { key: "isTrending", label: "Trending" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <span style={{ color: "#CCCCCC", fontSize: "13px" }}>{label}</span>
                    <div
                      style={{
                        position: "relative",
                        width: "36px",
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: (form as any)[key] ? PINK : "#222224",
                        transition: "all 0.15s ease",
                      }}
                      onClick={() => setForm((f) => ({ ...f, [key]: !(f as any)[key] }))}
                    >
                      <div style={{
                        position: "absolute",
                        top: "2px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#FFFFFF",
                        transform: (form as any)[key] ? "translateX(18px)" : "translateX(2px)",
                        transition: "all 0.15s ease",
                      }} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                backgroundColor: PINK,
                color: "#000000",
                padding: "14px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: saving ? 0.5 : 1,
              }}
              id="save-product-btn"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : isEditing ? "Update Product" : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "1px solid #222224",
                color: "#888888",
                padding: "12px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              className="hover:text-white hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
