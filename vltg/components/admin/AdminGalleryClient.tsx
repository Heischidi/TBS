"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  initialImages: string[];
}

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
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-white tracking-widest">GALLERY</h1>
        <p className="text-text-muted text-xs mt-1 uppercase tracking-widest">Brand Images</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border border-dashed transition-colors cursor-pointer py-14 flex flex-col items-center justify-center gap-3 ${
          dragOver ? "border-brand-pink bg-brand-pink/5" : "border-white/10 hover:border-white/20"
        }`}
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
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
            <p className="text-text-muted text-xs uppercase tracking-widest">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload size={20} className="text-text-muted" />
            <p className="text-text-muted text-xs uppercase tracking-widest">
              Drop images here or click to upload
            </p>
          </>
        )}
      </div>

      {/* Image count */}
      {images.length > 0 && (
        <p className="text-text-muted text-[10px] uppercase tracking-widest">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-white/5">
          <ImageIcon size={32} className="text-white/10" />
          <p className="text-text-muted text-xs uppercase tracking-widest">No images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((url) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group aspect-square bg-surface-3 overflow-hidden"
              >
                <Image
                  src={url}
                  alt="Gallery image"
                  fill
                  className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setPreview(url)}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(url); }}
                    disabled={deleting === url}
                    className="p-2 border border-white/20 hover:border-red-400 hover:text-red-400 text-white transition-colors"
                  >
                    {deleting === url ? (
                      <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
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
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
            onClick={() => setPreview(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              onClick={() => setPreview(null)}
            >
              <X size={20} />
            </button>
            <div className="relative max-w-3xl max-h-[85vh] w-full h-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
