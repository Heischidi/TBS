"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, X, Upload, Loader2, ArrowLeft, GripVertical } from "lucide-react";
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

  const inputClass = "w-full input-dark px-4 py-3 text-sm";
  const labelClass = "block text-xs uppercase tracking-wider text-text-secondary mb-1.5";

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-3xl text-white">{isEditing ? "EDIT PRODUCT" : "NEW PRODUCT"}</h1>
          <p className="text-text-muted text-sm mt-0.5">{isEditing ? `Editing: ${product.name}` : "Add a new product to your store"}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 mb-6 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
              <h2 className="font-display text-lg tracking-wider mb-5">PRODUCT DETAILS</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={inputClass} placeholder="e.g. Oversized Drop Tee" required id="product-name" />
                </div>
                <div>
                  <label className={labelClass}>URL Slug *</label>
                  <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputClass} placeholder="oversized-drop-tee" required id="product-slug" />
                </div>
                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputClass} h-32 resize-none`} placeholder="Describe the product..." required id="product-desc" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Price (₦) *</label>
                    <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputClass} placeholder="15000" required min="0" id="product-price" />
                  </div>
                  <div>
                    <label className={labelClass}>Compare Price (₦)</label>
                    <input type="number" value={form.comparePrice} onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))} className={inputClass} placeholder="20000" min="0" id="product-compare-price" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className={inputClass} min="0" id="product-stock" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
              <h2 className="font-display text-lg tracking-wider mb-5">PRODUCT IMAGES</h2>
              <div
                className="border-2 border-dashed border-white/10 rounded-sm p-8 text-center hover:border-brand-pink/50 transition-colors cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 size={24} className="mx-auto text-brand-pink animate-spin" />
                ) : (
                  <>
                    <Upload size={24} className="mx-auto text-text-muted mb-3" />
                    <p className="text-text-secondary text-sm">Click to upload or drag &amp; drop</p>
                    <p className="text-text-muted text-xs mt-1">PNG, JPG up to 10MB each</p>
                  </>
                )}
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)} id="product-images-input" />
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square group">
                      <Image src={img} alt="" fill className="object-cover rounded-sm" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[8px] bg-brand-pink text-white px-1">MAIN</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
              <h2 className="font-display text-lg tracking-wider mb-5">SIZES</h2>
              <div className="flex flex-wrap gap-2">
                {COMMON_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn("px-3 py-1.5 text-xs border font-medium uppercase tracking-wider transition-all", sizes.includes(size) ? "border-brand-pink bg-brand-pink/10 text-brand-pink" : "border-white/10 text-text-secondary hover:border-white hover:text-white")}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {/* Custom size */}
              <div className="flex gap-2 mt-3">
                <input placeholder="Custom size..." className="input-dark px-3 py-2 text-sm flex-1" id="custom-size-input"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); toggleSize((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; }}} />
              </div>
            </div>

            {/* Colors */}
            <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
              <h2 className="font-display text-lg tracking-wider mb-5">COLORS</h2>
              <div className="flex flex-wrap gap-2 mb-4">
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
                    className={cn("flex items-center gap-2 px-3 py-1.5 text-xs border transition-all", colors.find((c) => c.name === color.name) ? "border-brand-pink bg-brand-pink/10" : "border-white/10 hover:border-white")}
                  >
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ background: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
              {/* Custom color */}
              <div className="flex gap-2 items-center">
                <input type="color" value={colorInput.hex} onChange={(e) => setColorInput((c) => ({ ...c, hex: e.target.value }))} className="w-10 h-10 rounded border border-white/10 bg-surface-3 cursor-pointer" id="color-picker" />
                <input value={colorInput.name} onChange={(e) => setColorInput((c) => ({ ...c, name: e.target.value }))} placeholder="Color name..." className="input-dark px-3 py-2 text-sm flex-1" id="color-name-input" />
                <button type="button" onClick={addColor} className="bg-surface-3 hover:bg-surface-4 border border-white/10 px-3 py-2 text-xs uppercase tracking-wider transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              {colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {colors.map((c) => (
                    <div key={c.name} className="flex items-center gap-1.5 bg-surface-3 px-2 py-1 rounded-sm text-xs">
                      <span className="w-3 h-3 rounded-full" style={{ background: c.hex }} />
                      {c.name}
                      <button type="button" onClick={() => setColors((prev) => prev.filter((x) => x.name !== c.name))} className="text-text-muted hover:text-red-400 ml-1"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Options */}
          <div className="space-y-6">
            {/* Organization */}
            <div className="bg-surface-2 border border-white/5 p-5 rounded-sm">
              <h2 className="font-display text-lg tracking-wider mb-5">ORGANIZATION</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className={`${inputClass} cursor-pointer`} id="product-category" required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Collection</label>
                  <select value={form.collectionId} onChange={(e) => setForm((f) => ({ ...f, collectionId: e.target.value }))} className={`${inputClass} cursor-pointer`} id="product-collection">
                    <option value="">None</option>
                    {collections.map((col) => <option key={col.id} value={col.id}>{col.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-surface-2 border border-white/5 p-5 rounded-sm">
              <h2 className="font-display text-lg tracking-wider mb-5">PRODUCT TAGS</h2>
              <div className="space-y-3">
                {[
                  { key: "isPublished", label: "Published" },
                  { key: "isFeatured", label: "Featured" },
                  { key: "isNewArrival", label: "New Arrival" },
                  { key: "isBestSeller", label: "Best Seller" },
                  { key: "isTrending", label: "Trending" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-text-secondary">{label}</span>
                    <div
                      className={cn("relative w-10 h-5 rounded-full transition-colors", (form as any)[key] ? "bg-brand-pink" : "bg-surface-4")}
                      onClick={() => setForm((f) => ({ ...f, [key]: !(f as any)[key] }))}
                    >
                      <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform", (form as any)[key] ? "translate-x-5" : "translate-x-0.5")} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-pink text-white py-4 font-medium uppercase tracking-widest text-sm hover:bg-brand-pink/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              id="save-product-btn"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : isEditing ? "Update Product" : "Create Product"}
            </button>

            <button type="button" onClick={() => router.back()} className="w-full border border-white/10 text-text-secondary py-3 text-sm uppercase tracking-wider hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
