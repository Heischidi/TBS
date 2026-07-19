import type { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductCard } from "@/components/shop/ProductCard";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const col = await db.collection.findUnique({ where: { slug } });
    return col ? { title: col.name, description: col.description || undefined } : { title: "Collection" };
  } catch {
    return { title: `Collection - ${slug}` };
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  let collection: any = null;
  try {
    collection = await db.collection.findUnique({
      where: { slug, isActive: true },
      include: {
        products: {
          where: { isPublished: true },
          include: { category: true },
        },
      },
    });
  } catch (e) {
    console.warn("DB connection failed in collection detail page. Serving mock data.");
  }

  // Fallback mock collection if DB is offline or empty
  if (!collection) {
    const mockCollections: Record<string, any> = {
      "t-shirts": {
        name: "T-Shirts",
        description: "Oversized graphic tees made with heavy 300GSM cotton.",
        coverImage: "/images/tbs-col-1.jpg",
        products: [
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
          }
        ]
      },
      "hoodies": {
        name: "Hoodies",
        description: "Heavyweight fleece hoodies with custom brushed interior.",
        coverImage: "/images/tbs-col-2.jpg",
        products: [
          {
            id: "mock-p2",
            slug: "heavyweight-fleece-hoodie",
            name: "Heavyweight Fleece Hoodie",
            price: 38000,
            comparePrice: 45000,
            images: ["/images/tbs-col-2.jpg", "/images/tbs-hero-2.jpg"],
            sizes: ["M", "L", "XL"],
            colors: [{ name: "Olive", hex: "#4A4A2A" }, { name: "Black", hex: "#000000" }],
            isNewArrival: true,
            isBestSeller: false,
            isTrending: true,
            stock: 8
          }
        ]
      },
      "trousers": {
        name: "Pants & Trousers",
        description: "Tactical streetwear pants with heavy metal hardware.",
        coverImage: "/images/tbs-col-3.jpg",
        products: [
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
          }
        ]
      },
      "accessories": {
        name: "Accessories",
        description: "Complete your look with our premium collection of accessories.",
        coverImage: "/images/tbs-hero-1.jpg",
        products: [
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
        ]
      }
    };
    collection = mockCollections[slug];
  }

  if (!collection) notFound();

  return (
    <div className="min-h-screen pt-0 pb-24">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-surface-2">
        {collection.coverImage && <Image src={collection.coverImage} alt={collection.name} fill className="object-cover opacity-60" />}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-brand-pink text-xs font-bold uppercase tracking-[0.4em] mb-2">Collection</p>
          <h1 className="font-display text-5xl md:text-6xl text-white">{collection.name}</h1>
          {collection.description && <p className="text-text-secondary mt-3">{collection.description}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <p className="text-text-muted text-sm mb-8">{collection.products.length} pieces</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {collection.products.map((p: any) => (
            <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={Number(p.price)} image={p.images[0] || ""} images={p.images} sizes={p.sizes} colors={p.colors as any} stock={p.stock} isNewArrival={p.isNewArrival} isBestSeller={p.isBestSeller} isTrending={p.isTrending} />
          ))}
          {collection.products.length === 0 && <div className="col-span-full text-center py-16"><p className="text-text-muted text-sm uppercase tracking-widest">Products coming soon to this collection</p></div>}
        </div>
      </div>
    </div>
  );
}
