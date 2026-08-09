import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = { title: "Collections", description: "Explore all TBS collections." };

export default async function CollectionsPage() {
  let collections: any[] = [];
  try {
    collections = await db.collection.findMany({
      where: { isActive: true }, orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    });
  } catch (e) {
    console.warn("DB connection failed in collections page. Serving mock data.");
  }

  // Fallback mock collections if DB is empty or down
  if (collections.length === 0) {
    collections = [
      {
        id: "mock-c1",
        name: "T-Shirts",
        slug: "t-shirts",
        coverImage: "/images/tbs-col-1.jpg",
        description: "Oversized graphic tees",
        _count: { products: 1 }
      },
      {
        id: "mock-c2",
        name: "Hoodies",
        slug: "hoodies",
        coverImage: "/images/tbs-col-2.jpg",
        description: "Heavyweight fleece",
        _count: { products: 1 }
      },
      {
        id: "mock-c3",
        name: "Pants & Trousers",
        slug: "trousers",
        coverImage: "/images/tbs-col-3.jpg",
        description: "Tactical streetwear",
        _count: { products: 1 }
      },
      {
        id: "mock-c4",
        name: "Accessories",
        slug: "accessories",
        coverImage: "/images/tbs-hero-1.jpg",
        description: "Caps, bags & details",
        _count: { products: 1 }
      }
    ] as any;
  }

  return (
    <div className="min-h-screen pt-44 md:pt-48 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10 border-b border-white/5 pb-8">
          <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em] mb-3">Curated Drops</p>
          <h1 className="font-display text-5xl md:text-6xl text-white">COLLECTIONS</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link key={col.id} href={`/collections/${col.slug}`} className="group block">
              <div className="relative aspect-4/5 overflow-hidden bg-surface-3 rounded-sm">
                {col.coverImage ? (
                  <Image src={col.coverImage} alt={col.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-surface-3 to-surface-4 flex items-end p-6">
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="font-display text-2xl text-white">{col.name}</h2>
                  {col.description && <p className="text-white/70 text-sm mt-1">{col.description}</p>}
                  <p className="text-brand-pink text-xs mt-2 uppercase tracking-wider">{col._count.products} pieces</p>
                </div>
              </div>
            </Link>
          ))}
          {collections.length === 0 && <p className="col-span-full text-text-muted text-sm uppercase tracking-widest text-center py-24">Collections coming soon</p>}
        </div>
      </div>
    </div>
  );
}
