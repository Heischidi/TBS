"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface LookbookImage {
  id: string; image: string; caption?: string | null;
}

const placeholderImages = [
  { id: "p1", image: "", caption: "SS25 Collection" },
  { id: "p2", image: "", caption: "Urban Edge" },
  { id: "p3", image: "", caption: "Night Moves" },
  { id: "p4", image: "", caption: "The Drop" },
  { id: "p5", image: "", caption: "Statement Piece" },
  { id: "p6", image: "", caption: "Culture Forward" },
];

export function LookbookSection({ images }: { images: LookbookImage[] }) {
  const displayImages = images.length > 0 ? images : placeholderImages;
  const [selected, setSelected] = useState<LookbookImage | null>(null);

  return (
    <>
      <section className="section">
        <div className="section-inner">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center section-header"
          >
            <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.5em] mb-3">Editorial</p>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">LOOKBOOK</h2>
            <p className="text-text-secondary text-sm mt-4 max-w-md mx-auto leading-relaxed">
              Style captured. Culture frozen in time.
            </p>
          </motion.div>

          {/* Masonry grid */}
          <div className="columns-2 md:columns-3 gap-5 space-y-5">
            {displayImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="break-inside-avoid group relative overflow-hidden bg-surface-3 rounded-md cursor-pointer"
                onClick={() => img.image && setSelected(img)}
              >
                <div className={`relative ${i % 3 === 0 ? "aspect-3/4" : "aspect-square"} overflow-hidden`}>
                  {img.image ? (
                    <Image
                      src={img.image} alt={img.caption || "Lookbook"} fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full bg-linear-to-br ${
                      ["from-brand-green/30 to-black", "from-brand-maroon/30 to-black", "from-brand-pink/20 to-black"][i % 3]
                    } flex items-center justify-center`}>
                      <span className="font-display text-5xl text-white/10 tracking-widest">TBS</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs uppercase tracking-widest">{img.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all">
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative max-w-2xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selected.image} alt={selected.caption || ""} width={800} height={1000} className="object-contain max-h-[90vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
