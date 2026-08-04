"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, X, Loader2 } from "lucide-react";

interface HeroBanner {
  id: string; title: string; subtitle?: string | null;
  image: string; ctaText?: string | null; ctaLink?: string | null; isActive: boolean; order: number;
}
interface LookbookImage { id: string; image: string; caption?: string | null; order: number; }

export function AdminContentClient({ banners: initialBanners, lookbook: initialLookbook }: {
  banners: HeroBanner[]; lookbook: LookbookImage[];
}) {
  const [banners, setBanners] = useState(initialBanners);
  const [lookbook, setLookbook] = useState(initialLookbook);
  const [tab, setTab] = useState<"hero" | "lookbook">("hero");
  const [newBanner, setNewBanner] = useState({ title: "", subtitle: "", image: "", ctaText: "Shop Now", ctaLink: "/shop", isActive: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const lookbookFileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { urls } = await res.json();
    return urls[0];
  };

  const handleBannerImage = async (files: FileList) => {
    setUploading(true);
    const url = await uploadFile(files[0]);
    setNewBanner((b) => ({ ...b, image: url }));
    setUploading(false);
  };

  const saveBanner = async () => {
    if (!newBanner.title || !newBanner.image) { alert("Title and image required"); return; }
    setSaving(true);
    const res = await fetch("/api/content/hero", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newBanner, order: banners.length }),
    });
    if (res.ok) {
      const banner = await res.json();
      setBanners((prev) => [...prev, banner]);
      setNewBanner({ title: "", subtitle: "", image: "", ctaText: "Shop Now", ctaLink: "/shop", isActive: true });
    }
    setSaving(false);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/content/hero/${id}`, { method: "DELETE" });
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const handleLookbookUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      const res = await fetch("/api/content/lookbook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url, order: lookbook.length }),
      });
      if (res.ok) {
        const img = await res.json();
        setLookbook((prev) => [...prev, img]);
      }
    }
    setUploading(false);
  };

  const deleteLookbook = async (id: string) => {
    await fetch(`/api/content/lookbook/${id}`, { method: "DELETE" });
    setLookbook((prev) => prev.filter((i) => i.id !== id));
  };

  const inputClass = "w-full input-dark px-3 py-2.5 text-sm";
  const labelClass = "text-xs uppercase tracking-wider text-text-secondary block mb-1.5";

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-white">CONTENT MANAGEMENT</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 border border-white/5 p-1 rounded-sm w-fit">
        {(["hero", "lookbook"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${tab === t ? "bg-brand-pink text-white" : "text-text-secondary hover:text-white"}`}
          >
            {t === "hero" ? "Hero Banners" : "Lookbook Gallery"}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <div className="space-y-6">
          {/* Add new banner */}
          <div className="bg-surface-2 border border-white/5 p-6 rounded-sm">
            <h2 className="font-display text-lg tracking-wider mb-5">ADD HERO BANNER</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input value={newBanner.title} onChange={(e) => setNewBanner((b) => ({ ...b, title: e.target.value }))} className={inputClass} placeholder="NEW SEASON NEW RULES" id="banner-title" />
              </div>
              <div>
                <label className={labelClass}>Subtitle</label>
                <input value={newBanner.subtitle} onChange={(e) => setNewBanner((b) => ({ ...b, subtitle: e.target.value }))} className={inputClass} placeholder="Premium streetwear..." id="banner-subtitle" />
              </div>
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input value={newBanner.ctaText} onChange={(e) => setNewBanner((b) => ({ ...b, ctaText: e.target.value }))} className={inputClass} id="banner-cta-text" />
              </div>
              <div>
                <label className={labelClass}>CTA Link</label>
                <input value={newBanner.ctaLink} onChange={(e) => setNewBanner((b) => ({ ...b, ctaLink: e.target.value }))} className={inputClass} id="banner-cta-link" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Banner Image *</label>
                <div
                  className="border-2 border-dashed border-white/10 p-6 text-center cursor-pointer hover:border-brand-pink/50 transition-colors rounded-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  {newBanner.image ? (
                    <div className="relative h-32">
                      <Image src={newBanner.image} alt="Banner preview" fill className="object-cover rounded-sm" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setNewBanner((b) => ({ ...b, image: "" })); }} className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"><X size={10} /></button>
                    </div>
                  ) : uploading ? (
                    <Loader2 size={24} className="mx-auto text-brand-pink animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <Upload size={20} />
                      <p className="text-sm">Click to upload banner image</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleBannerImage(e.target.files)} id="banner-image-input" />
                </div>
              </div>
            </div>
            <button onClick={saveBanner} disabled={saving} className="mt-4 bg-brand-pink text-white px-6 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-brand-pink/80 transition-colors disabled:opacity-50 flex items-center gap-2" id="save-banner-btn">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Plus size={14} /> Add Banner</>}
            </button>
          </div>

          {/* Existing banners */}
          <div className="space-y-3">
            {banners.length === 0 ? <p className="text-text-muted text-sm">No banners yet. Add your first one above.</p> : banners.map((banner) => (
              <div key={banner.id} className="flex gap-4 bg-surface-2 border border-white/5 p-4 rounded-sm">
                <div className="relative w-24 h-16 bg-surface-3 rounded-sm overflow-hidden shrink-0">
                  {banner.image && <Image src={banner.image} alt={banner.title} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{banner.title}</p>
                  {banner.subtitle && <p className="text-text-muted text-xs mt-0.5">{banner.subtitle}</p>}
                  <p className="text-brand-pink text-xs mt-1">{banner.ctaText} → {banner.ctaLink}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 border rounded-full ${banner.isActive ? "border-neon-pink/30 text-neon-pink" : "border-white/10 text-text-muted"}`}>
                    {banner.isActive ? "Active" : "Hidden"}
                  </span>
                  <button onClick={() => deleteBanner(banner.id)} className="text-text-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "lookbook" && (
        <div className="space-y-6">
          <div
            className="border-2 border-dashed border-white/10 p-10 text-center cursor-pointer hover:border-brand-pink/50 transition-colors rounded-sm"
            onClick={() => lookbookFileRef.current?.click()}
          >
            {uploading ? <Loader2 size={24} className="mx-auto text-brand-pink animate-spin" /> : (
              <div className="flex flex-col items-center gap-2 text-text-muted">
                <Upload size={24} />
                <p className="text-sm">Click to upload lookbook images (multiple allowed)</p>
              </div>
            )}
            <input ref={lookbookFileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleLookbookUpload(e.target.files)} id="lookbook-upload" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lookbook.map((img) => (
              <div key={img.id} className="group relative aspect-square bg-surface-3 rounded-sm overflow-hidden">
                <Image src={img.image} alt={img.caption || ""} fill className="object-cover" />
                <button
                  onClick={() => deleteLookbook(img.id)}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={10} />
                </button>
                {img.caption && <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
