"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, X, Loader2 } from "lucide-react";

interface HeroBanner {
  id: string; title: string; subtitle?: string | null;
  image: string; ctaText?: string | null; ctaLink?: string | null; isActive: boolean; order: number;
}
interface LookbookImage { id: string; image: string; caption?: string | null; order: number; }

const PINK = "#FF1493";

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

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Content Management
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          Manage homepage banners and editorial lookbooks
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", backgroundColor: "#111111", border: "1px solid #1F1F1F", padding: "4px", borderRadius: "6px", width: "fit-content" }}>
        {(["hero", "lookbook"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: tab === t ? PINK : "transparent",
              color: tab === t ? "#000000" : "#888888",
              transition: "all 0.15s ease",
            }}
          >
            {t === "hero" ? "Hero Banners" : "Lookbook Gallery"}
          </button>
        ))}
      </div>

      {tab === "hero" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Add new banner box */}
          <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
            <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Add Hero Banner
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>Title *</label>
                <input value={newBanner.title} onChange={(e) => setNewBanner((b) => ({ ...b, title: e.target.value }))} style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }} placeholder="NEW SEASON NEW RULES" id="banner-title" />
              </div>
              <div>
                <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>Subtitle</label>
                <input value={newBanner.subtitle} onChange={(e) => setNewBanner((b) => ({ ...b, subtitle: e.target.value }))} style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }} placeholder="Premium streetwear..." id="banner-subtitle" />
              </div>
              <div>
                <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>CTA Button Text</label>
                <input value={newBanner.ctaText} onChange={(e) => setNewBanner((b) => ({ ...b, ctaText: e.target.value }))} style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }} id="banner-cta-text" />
              </div>
              <div>
                <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>CTA Link</label>
                <input value={newBanner.ctaLink} onChange={(e) => setNewBanner((b) => ({ ...b, ctaLink: e.target.value }))} style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "10px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }} id="banner-cta-link" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>Banner Image *</label>
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
                  {newBanner.image ? (
                    <div style={{ position: "relative", height: "120px" }}>
                      <Image src={newBanner.image} alt="Banner preview" fill style={{ objectFit: "cover", borderRadius: "4px" }} />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setNewBanner((b) => ({ ...b, image: "" })); }} style={{ position: "absolute", top: "6px", right: "6px", backgroundColor: "#EF4444", border: "none", borderRadius: "50%", padding: "4px", cursor: "pointer", color: "#FFF" }}><X size={12} /></button>
                    </div>
                  ) : uploading ? (
                    <Loader2 size={22} style={{ margin: "0 auto", color: PINK }} className="animate-spin" />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "#666666" }}>
                      <Upload size={18} />
                      <p style={{ fontSize: "12px", margin: 0 }}>Click to upload banner image</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleBannerImage(e.target.files)} id="banner-image-input" />
                </div>
              </div>
            </div>
            <button
              onClick={saveBanner}
              disabled={saving}
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
                opacity: saving ? 0.5 : 1,
              }}
              id="save-banner-btn"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Plus size={14} /> Add Banner</>}
            </button>
          </div>

          {/* Banners List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {banners.length === 0 ? <p style={{ color: "#666666", fontSize: "13px" }}>No banners yet. Add your first one above.</p> : banners.map((banner) => (
              <div key={banner.id} style={{ display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#111111", border: "1px solid #1F1F1F", padding: "14px 16px", borderRadius: "8px" }}>
                <div style={{ position: "relative", width: "80px", height: "50px", backgroundColor: "#1C1C1E", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                  {banner.image && <Image src={banner.image} alt={banner.title} fill style={{ objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: 0 }}>{banner.title}</p>
                  {banner.subtitle && <p style={{ color: "#AAAAAA", fontSize: "12px", margin: "2px 0 0 0" }}>{banner.subtitle}</p>}
                  <p style={{ color: PINK, fontSize: "11px", margin: "4px 0 0 0" }}>{banner.ctaText} &rarr; {banner.ctaLink}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "12px", border: banner.isActive ? `1px solid ${PINK}` : "1px solid #333333", color: banner.isActive ? PINK : "#666666" }}>
                    {banner.isActive ? "Active" : "Hidden"}
                  </span>
                  <button onClick={() => deleteBanner(banner.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#666666" }} className="hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "lookbook" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{ border: "1px dashed #222224", borderRadius: "8px", padding: "36px", textAlign: "center", cursor: "pointer", backgroundColor: "#111111" }}
            onClick={() => lookbookFileRef.current?.click()}
            className="hover:border-white/20 transition-colors"
          >
            {uploading ? <Loader2 size={24} style={{ margin: "0 auto", color: PINK }} className="animate-spin" /> : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "#666666" }}>
                <Upload size={24} />
                <p style={{ fontSize: "13px", margin: 0 }}>Click to upload lookbook images (multiple allowed)</p>
              </div>
            )}
            <input ref={lookbookFileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleLookbookUpload(e.target.files)} id="lookbook-upload" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
            {lookbook.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-sm overflow-hidden" style={{ backgroundColor: "#1C1C1E" }}>
                <Image src={img.image} alt={img.caption || ""} fill style={{ objectFit: "cover" }} />
                <button
                  onClick={() => deleteLookbook(img.id)}
                  style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#EF4444", border: "none", borderRadius: "50%", padding: "4px", cursor: "pointer", color: "#FFF" }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
