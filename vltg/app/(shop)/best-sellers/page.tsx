import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = { title: "Best Sellers", description: "Shop TBS best selling products." };

export default async function BestSellersPage() {
  let products: any[] = [];
  try {
    products = await db.product.findMany({
      where: { isBestSeller: true, isPublished: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  } catch (e) {
    console.warn("DB connection failed in best-sellers page. Serving mock data.");
  }

  // Fallback mock products if DB is empty or down
  if (products.length === 0) {
    products = [
      {
        id: "mock-p1",
        slug: "signature-oversized-tee",
        name: "Signature Oversized Tee",
        price: 18500,
        comparePrice: 24000,
        images: ["/images/tbs-col-1.jpg", "/images/tbs-hero-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Off-White", hex: "#F5F5F0" }, { name: "Black", hex: "#000000" }],
        isNewArrival: true,
        isBestSeller: true,
        isTrending: true,
        stock: 12
      },
      {
        id: "mock-p3",
        slug: "tactical-cargo-pants",
        name: "Tactical Cargo Pants",
        price: 32000,
        comparePrice: null,
        images: ["/images/tbs-col-3.jpg"],
        sizes: ["30", "32", "34", "36"],
        colors: [{ name: "Midnight Grey", hex: "#2E3033" }],
        isNewArrival: false,
        isBestSeller: true,
        isTrending: true,
        stock: 15
      },
      {
        id: "mock-p4",
        slug: "tbs-trucker-cap",
        name: "TBS Arch Trucker Cap",
        price: 12000,
        comparePrice: 15000,
        images: ["/images/tbs-hero-1.jpg"],
        sizes: ["One Size"],
        colors: [{ name: "Black", hex: "#000000" }, { name: "Brown", hex: "#4A2C17" }],
        isNewArrival: true,
        isBestSeller: true,
        isTrending: false,
        stock: 20
      }
    ] as any;
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <p className="text-brand-pink text-xs font-bold uppercase tracking-[0.4em] mb-3">Most Wanted</p>
          <h1 className="font-display text-5xl md:text-6xl text-white">BEST SELLERS</h1>
          <p className="text-text-muted text-sm mt-3">{products.length} top products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={Number(p.price)} image={p.images[0] || ""} images={p.images} sizes={p.sizes} colors={p.colors as any} isBestSeller stock={p.stock} isNewArrival={p.isNewArrival} isTrending={p.isTrending} />
          ))}
          {products.length === 0 && <div className="col-span-full text-center py-24"><p className="text-text-muted text-sm uppercase tracking-widest">Coming soon</p></div>}
        </div>
      </div>
    </div>
  );
}
