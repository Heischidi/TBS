import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) return { title: "Product Not Found" };
    return {
      title: product.name,
      description: product.description ? product.description.slice(0, 160) : undefined,
      openGraph: { images: product.images[0] ? [product.images[0]] : [] },
    };
  } catch {
    return { title: `Product - ${slug}` };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: any = null;
  let related: any[] = [];
  try {
    product = await db.product.findUnique({
      where: { slug, isPublished: true },
      include: { category: true, collection: true },
    });
    if (product) {
      related = await db.product.findMany({
        where: { categoryId: product.categoryId, isPublished: true, id: { not: product.id } },
        take: 4,
        include: { category: true },
      });
    }
  } catch (e) {
    console.warn("DB connection failed in product detail page. Serving mock data.");
  }

  // Fallback mock products if DB is offline or empty
  if (!product) {
    const mockProducts: Record<string, any> = {
      "signature-oversized-tee": {
        id: "mock-p1",
        slug: "signature-oversized-tee",
        name: "Signature Oversized Tee",
        description: "Premium oversized t-shirt designed for ultimate comfort and high-end streetwear style.",
        price: 18500,
        comparePrice: 24000,
        images: ["/images/tbs-col-1.jpg", "/images/tbs-hero-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Off-White", hex: "#F5F5F0" }, { name: "Black", hex: "#000000" }],
        isNewArrival: true,
        isBestSeller: true,
        isTrending: true,
        stock: 12,
        category: { name: "T-Shirts", slug: "t-shirts" },
        collection: { name: "Core Essentials", slug: "core-essentials" }
      },
      "heavyweight-fleece-hoodie": {
        id: "mock-p2",
        slug: "heavyweight-fleece-hoodie",
        name: "Heavyweight Fleece Hoodie",
        description: "Brushed fleece interior and double-lined hood. Built to last.",
        price: 38000,
        comparePrice: 45000,
        images: ["/images/tbs-col-2.jpg", "/images/tbs-hero-2.jpg"],
        sizes: ["M", "L", "XL"],
        colors: [{ name: "Olive", hex: "#4A4A2A" }, { name: "Black", hex: "#000000" }],
        isNewArrival: true,
        isBestSeller: false,
        isTrending: true,
        stock: 8,
        category: { name: "Hoodies", slug: "hoodies" },
        collection: { name: "Core Essentials", slug: "core-essentials" }
      },
      "tactical-cargo-pants": {
        id: "mock-p3",
        slug: "tactical-cargo-pants",
        name: "Tactical Cargo Pants",
        description: "Heavy cotton canvas with deep utility cargo pockets and metal buckles.",
        price: 32000,
        comparePrice: null,
        images: ["/images/tbs-col-3.jpg"],
        sizes: ["30", "32", "34", "36"],
        colors: [{ name: "Midnight Grey", hex: "#2E3033" }],
        isNewArrival: false,
        isBestSeller: true,
        isTrending: true,
        stock: 15,
        category: { name: "Pants & Trousers", slug: "trousers" },
        collection: { name: "SS25 Drop 01", slug: "ss25-drop-01" }
      },
      "tbs-trucker-cap": {
        id: "mock-p4",
        slug: "tbs-trucker-cap",
        name: "TBS Arch Trucker Cap",
        description: "Structured high-crown mesh trucker cap with puff embroidery.",
        price: 12000,
        comparePrice: 15000,
        images: ["/images/tbs-hero-1.jpg"],
        sizes: ["One Size"],
        colors: [{ name: "Black", hex: "#000000" }, { name: "Brown", hex: "#4A2C17" }],
        isNewArrival: true,
        isBestSeller: true,
        isTrending: false,
        stock: 20,
        category: { name: "Accessories", slug: "accessories" },
        collection: { name: "SS25 Drop 01", slug: "ss25-drop-01" }
      }
    };

    product = mockProducts[slug];
    
    // Serve other products as related products
    if (product) {
      related = Object.values(mockProducts).filter((p: any) => p.slug !== slug).slice(0, 4);
    }
  }

  if (!product) notFound();

  return <ProductDetailClient product={product as any} related={related as any} />;
}
