import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { LookbookSection } from "@/components/shop/home/LookbookSection";
import { LookbookCategoryNav } from "@/components/shop/LookbookCategoryNav";
import { B2B_ENQUIRY_HREF, categoryLabel, resolveCategoryParam } from "@/lib/lookbook";

export const metadata: Metadata = {
  title: "Lookbook — TBS | Editorial",
  description: "Style captured. Culture frozen in time. Browse the TBS editorial lookbook.",
};

// Rendered per request so newly uploaded/recategorised images appear immediately.
export const dynamic = "force-dynamic";

const EMPTY_MESSAGES: Record<string, string> = {
  b2b: "No B2B gallery images yet — use Enquiries for B2B above to drop your request.",
};

export default async function LookbookPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected = resolveCategoryParam(category);

  const where =
    selected === ""
      ? {}
      : selected === "archives"
        ? { category: { startsWith: "archives-" } }
        : { category: selected };

  let images: { id: string; image: string; caption?: string | null }[] = [];
  try {
    images = await db.lookbookImage.findMany({ where, orderBy: { order: "asc" } });
  } catch (error) {
    // DB offline — "All" falls back to LookbookSection's own placeholder tiles.
    console.error("Failed to load lookbook images:", error);
  }

  const heading =
    selected === ""
      ? "Style captured. Culture frozen in time."
      : `${categoryLabel(selected) ?? (selected === "archives" ? "Archives" : "Lookbook")}`;

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Page Header */}
      <div className="site-container pt-12 pb-4">
        <p className="text-white/30 text-xs uppercase tracking-[0.4em] mb-4">Editorial</p>
        <h1 className="font-display text-6xl md:text-8xl text-white tracking-wide">LOOKBOOK</h1>
        <p className="text-white/40 text-sm mt-4 max-w-sm leading-relaxed">{heading}</p>
      </div>

      <div className="site-container pt-6">
        <LookbookCategoryNav selected={selected} />
      </div>

      {selected === "b2b" && (
        <div className="site-container pt-8">
          <div className="bg-surface-2 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-pink" />
            <div className="max-w-xl">
              <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em] mb-2">
                Partnerships &amp; Wholesale
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">
                ENQUIRIES FOR B2B
              </h2>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                Looking to stock TBS, place bulk orders, or collaborate on custom pieces? Drop your request and our team will reach out by email.
              </p>
            </div>
            <Link
              href={B2B_ENQUIRY_HREF}
              className="inline-flex items-center justify-center gap-2.5 bg-white text-black px-7 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand-pink hover:text-white transition-colors shrink-0"
            >
              Drop Your Request
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      <LookbookSection
        images={images}
        showHeader={false}
        usePlaceholders={selected === ""}
        emptyMessage={EMPTY_MESSAGES[selected] ?? "No looks in this category yet — check back soon."}
      />
    </div>
  );
}
