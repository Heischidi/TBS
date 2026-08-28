"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  initialImages: string[];
}

const PINK = "#6B7C3A";

export function AdminGalleryClient({ initialImages }: Props) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const base64 = await toBase64(file);
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        if (data.url) uploaded.push(data.url);
      } catch {
        // continue on individual failure
      }
    }

    setImages((prev) => [...uploaded, ...prev]);
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }, []);

  const handleDelete = async (url: string) => {
    setDeleting(url);
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setImages((prev) => prev.filter((u) => u !== url));
    setDeleting(null);
  };

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Gallery
        </h1>
        <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
          Upload &amp; manage official brand photography and campaign media
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: dragOver ? `1px dashed ${PINK}` : "1px dashed #222224",
          backgroundColor: dragOver ? "rgba(255, 20, 147, 0.05)" : "#111111",
          borderRadius: "8px",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", border: `2px solid ${PINK}`, borderTopColor: "transparent", borderRadius: "50%" }} className="animate-spin" />
            <p style={{ color: "#666666", fontSize: "12px", margin: 0 }}>Uploading...</p>
          </div>
        ) : (
          <>
            <Upload size={22} style={{ color: "#666666" }} />
            <p style={{ color: "#CCCCCC", fontSize: "13px", margin: 0 }}>
              Drop images here or click to upload
            </p>
          </>
        )}
      </div>

      {/* Image count */}
      {images.length > 0 && (
        <p style={{ color: "#666666", fontSize: "11px", margin: 0 }}>
          {images.length} image{images.length !== 1 ? "s" : ""} in gallery
        </p>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1C1C1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={22} style={{ color: "#555555" }} />
          </div>
          <p style={{ color: "#999999", fontSize: "13px", fontWeight: 600, margin: 0 }}>No gallery images yet</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          <AnimatePresence>
            {images.map((url) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group aspect-square rounded-sm overflow-hidden"
                style={{ backgroundColor: "#1C1C1E" }}
              >
                <Image
                  src={url}
                  alt="Gallery image"
                  fill
                  style={{ objectFit: "cover" }}
                  className="cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setPreview(url)}
                />
                <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s ease" }} className="opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(url); }}
                    disabled={deleting === url}
                    style={{ backgroundColor: "#EF4444", border: "none", borderRadius: "50%", padding: "6px", cursor: "pointer", color: "#FFF" }}
                  >
                    {deleting === url ? (
                      <div style={{ width: "14px", height: "14px", border: "2px solid #FFF", borderTopColor: "transparent", borderRadius: "50%" }} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onClick={() => setPreview(null)}
          >
            <button
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#FFFFFF", cursor: "pointer" }}
              onClick={() => setPreview(null)}
            >
              <X size={24} />
            </button>
            <div style={{ position: "relative", maxWidth: "800px", maxHeight: "80vh", width: "100%", height: "100%" }}>
              <Image
                src={preview}
                alt="Preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
