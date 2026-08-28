import type { Metadata } from "next";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { HeroSection } from "@/components/shop/home/HeroSection";
import { MarqueeStrip } from "@/components/shop/home/MarqueeStrip";
import { CategoryGrid } from "@/components/shop/home/CategoryGrid";
import { FlashSale } from "@/components/shop/home/FlashSale";
import { FeaturedCollection } from "@/components/shop/home/FeaturedCollection";
import { NewArrivals } from "@/components/shop/home/NewArrivals";
import { PromoBanners } from "@/components/shop/home/PromoBanners";
import { BestSellers } from "@/components/shop/home/BestSellers";
import { TrustBadges } from "@/components/shop/home/TrustBadges";
import { TrendingSection } from "@/components/shop/home/TrendingSection";
import { Newsletter } from "@/components/shop/home/Newsletter";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "TBS — Premium Fashion Store | New Arrivals & Flash Sales",
  description:
    "Shop the latest premium streetwear from TBS. Flash sales, new arrivals, and limited drops. Free shipping on orders over ₦50,000.",
};

async function getHomeData() {
  const [
    heroBanners,
    featuredProducts,
    newArrivals,
    bestSellers,
    trendingProducts,
    collections,
  ] = await Promise.all([
    db.heroBanner.findMany({ where: { isActive: true }, orderBy: { order: "asc" }, take: 3 }),
    db.product.findMany({ where: { isFeatured: true, isPublished: true }, take: 6, include: { category: true } }),
    db.product.findMany({ where: { isNewArrival: true, isPublished: true }, take: 10, include: { category: true } }),
    db.product.findMany({ where: { isBestSeller: true, isPublished: true }, take: 10, include: { category: true } }),
    db.product.findMany({ where: { isTrending: true, isPublished: true }, take: 4, include: { category: true } }),
    db.collection.findMany({ where: { isActive: true }, take: 4 }),
  ]);

  return { heroBanners, featuredProducts, newArrivals, bestSellers, trendingProducts, collections };
}

export default async function HomePage() {
  let dbData = await getHomeData().catch(() => null);

  let data = dbData;

  // Fallback to high-fidelity mock data if DB is empty/unavailable
  if (!data || data.collections.length === 0 || data.featuredProducts.length === 0) {
    const mockHeroBanners = [
      {
        id: "mock-h1",
        title: "NEW SEASON\nNEW RULES",
        subtitle: "Premium streetwear for those who move culture forward.",
        image: "/images/tbs-hero-1.jpg",
        ctaText: "Shop Now",
        ctaLink: "/shop",
        order: 0,
        isActive: true,
      },
      {
        id: "mock-h2",
        title: "LIMITED\nDROPS ONLY",
        subtitle: "Exclusive pieces. Never restocked. Always remembered.",
        image: "/images/tbs-hero-2.jpg",
        ctaText: "View Collection",
        ctaLink: "/collections",
        order: 1,
        isActive: true,
      },
    ];

    const mockCollections = [
      { id: "mock-c1", name: "T-Shirts", slug: "t-shirts", coverImage: "/images/tbs-col-1.jpg", description: "Oversized graphic tees", isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "mock-c2", name: "Hoodies", slug: "hoodies", coverImage: "/images/tbs-col-2.jpg", description: "Heavyweight fleece", isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "mock-c3", name: "Pants & Trousers", slug: "trousers", coverImage: "/images/tbs-col-3.jpg", description: "Tactical streetwear", isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "mock-c4", name: "Accessories", slug: "accessories", coverImage: "/images/tbs-hero-1.jpg", description: "Caps, bags & details", isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    const mockProducts = [
      {
        id: "mock-p1",
        slug: "signature-oversized-tee",
        name: "Signature Oversized Tee",
        price: 18500,
        comparePrice: 24000,
        images: ["/images/tbs-col-1.jpg", "/images/tbs-hero-1.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Off-White", hex: "#F5F5F0" }, { name: "Black", hex: "#000000" }],
        isNewArrival: true, isBestSeller: true, isTrending: true, isFeatured: true,
        stock: 12, categoryId: "mock-c1",
        category: { name: "T-Shirts", slug: "t-shirts" },
        isPublished: true, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: "mock-p2",
        slug: "heavyweight-fleece-hoodie",
        name: "Heavyweight Fleece Hoodie",
        price: 38000,
        comparePrice: 45000,
        images: ["/images/tbs-col-2.jpg", "/images/tbs-hero-2.jpg"],
        sizes: ["M", "L", "XL"],
        colors: [{ name: "Olive", hex: "#4A4A2A" }, { name: "Black", hex: "#000000" }],
        isNewArrival: true, isBestSeller: false, isTrending: true, isFeatured: true,
        stock: 8, categoryId: "mock-c2",
        category: { name: "Hoodies", slug: "hoodies" },
        isPublished: true, createdAt: new Date(), updatedAt: new Date(),
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
        isNewArrival: false, isBestSeller: true, isTrending: true, isFeatured: true,
        stock: 15, categoryId: "mock-c3",
        category: { name: "Trousers", slug: "trousers" },
        isPublished: true, createdAt: new Date(), updatedAt: new Date(),
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
        isNewArrival: true, isBestSeller: true, isTrending: false, isFeatured: true,
        stock: 20, categoryId: "mock-c4",
        category: { name: "Accessories", slug: "accessories" },
        isPublished: true, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: "mock-p5",
        slug: "washed-graphic-tee",
        name: "Washed Graphic Tee",
        price: 16000,
        comparePrice: 22000,
        images: ["/images/tbs-hero-2.jpg"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [{ name: "Washed Black", hex: "#1A1A1A" }, { name: "Stone", hex: "#C0B8B0" }],
        isNewArrival: true, isBestSeller: false, isTrending: false, isFeatured: false,
        stock: 25, categoryId: "mock-c1",
        category: { name: "T-Shirts", slug: "t-shirts" },
        isPublished: true, createdAt: new Date(), updatedAt: new Date(),
      },
      {
        id: "mock-p6",
        slug: "zip-up-hoodie",
        name: "TBS Zip-Up Hoodie",
        price: 42000,
        comparePrice: 55000,
        images: ["/images/tbs-col-2.jpg"],
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Charcoal", hex: "#36393F" }, { name: "Black", hex: "#000000" }],
        isNewArrival: true, isBestSeller: true, isTrending: false, isFeatured: false,
        stock: 7, categoryId: "mock-c2",
        category: { name: "Hoodies", slug: "hoodies" },
        isPublished: true, createdAt: new Date(), updatedAt: new Date(),
      },
    ];


    data = {
      heroBanners: mockHeroBanners as any,
      featuredProducts: mockProducts as any,
      newArrivals: mockProducts.filter((p) => p.isNewArrival) as any,
      bestSellers: mockProducts.filter((p) => p.isBestSeller) as any,
      trendingProducts: mockProducts.filter((p) => p.isTrending) as any,
      collections: mockCollections as any,
    };
  }

  const renderData = data || {
    heroBanners: [],
    featuredProducts: [],
    newArrivals: [],
    bestSellers: [],
    trendingProducts: [],
    collections: [],
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* 1. Full-screen hero slideshow */}
        <HeroSection banners={renderData.heroBanners} />

        {/* 2. Marquee strip */}
        <MarqueeStrip />

        {/* 3. Category icon grid — Shein-style shop by category */}
        <CategoryGrid />

        {/* 4. Trust badges — free delivery, returns, secure payment */}
        <TrustBadges />

        {/* 5. Flash Sale with countdown timer */}
        <FlashSale />

        {/* 6. Featured collections + featured products */}
        <FeaturedCollection
          products={renderData.featuredProducts}
          collections={renderData.collections}
        />

        {/* 7. New arrivals — horizontal scroll on mobile */}
        <NewArrivals products={renderData.newArrivals} />

        {/* 8. Promotional double banners */}
        <PromoBanners />

        {/* 9. Best sellers — horizontal scroll on mobile */}
        <BestSellers products={renderData.bestSellers} />

        {/* 10. Trending section — big feature layout */}
        <TrendingSection products={renderData.trendingProducts} />

        {/* 11. Newsletter sign-up */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
