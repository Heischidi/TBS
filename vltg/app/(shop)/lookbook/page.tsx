import type { Metadata } from "next";
import { db } from "@/lib/db";
import { LookbookSection } from "@/components/shop/home/LookbookSection";

export const metadata: Metadata = {
  title: "Lookbook — TBS | Editorial",
  description: "Style captured. Culture frozen in time. Browse the TBS editorial lookbook.",
};

export default async function LookbookPage() {
  let images: { id: string; image: string; caption?: string | null }[] = [];
  try {
    images = await db.lookbookImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    // DB offline — LookbookSection will use its own placeholder images
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-4">
        <p className="text-white/30 text-xs uppercase tracking-[0.4em] mb-4">Editorial</p>
        <h1 className="font-display text-6xl md:text-8xl text-white tracking-wide">LOOKBOOK</h1>
        <p className="text-white/40 text-sm mt-4 max-w-sm leading-relaxed">
          Style captured. Culture frozen in time.
        </p>
      </div>

      <LookbookSection images={images} />
    </div>
  );
}
