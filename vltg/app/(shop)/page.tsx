import type { Metadata } from "next";
import { HeroSection } from "@/components/shop/home/HeroSection";
import { MarqueeStrip } from "@/components/shop/home/MarqueeStrip";
import { FeaturedCollection } from "@/components/shop/home/FeaturedCollection";
import { NewArrivals } from "@/components/shop/home/NewArrivals";
import { BestSellers } from "@/components/shop/home/BestSellers";
import { TrendingSection } from "@/components/shop/home/TrendingSection";
import { LookbookSection } from "@/components/shop/home/LookbookSection";
import { Newsletter } from "@/components/shop/home/Newsletter";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "TBS — Premium Streetwear | Home",
  description:
    "Shop the latest premium streetwear from TBS. Bold designs, limited drops, and timeless quality.",
};

async function getHomeData() {
  const [
    heroBanners,
    featuredProducts,
    newArrivals,
    bestSellers,
    trendingProducts,
    lookbookImages,
    collections,
  ] = await Promise.all([
    db.heroBanner.findMany({ where: { isActive: true }, orderBy: { order: "asc" }, take: 3 }),
    db.product.findMany({ where: { isFeatured: true, isPublished: true }, take: 6, include: { category: true } }),
    db.product.findMany({ where: { isNewArrival: true, isPublished: true }, take: 8, include: { category: true } }),
    db.product.findMany({ where: { isBestSeller: true, isPublished: true }, take: 8, include: { category: true } }),
    db.product.findMany({ where: { isTrending: true, isPublished: true }, take: 4, include: { category: true } }),
    db.lookbookImage.findMany({ orderBy: { order: "asc" }, take: 9 }),
    db.collection.findMany({ where: { isActive: true }, take: 4 }),
  ]);

  return { heroBanners, featuredProducts, newArrivals, bestSellers, trendingProducts, lookbookImages, collections };
}

export default async function HomePage() {
  const data = await getHomeData().catch(() => ({
    heroBanners: [],
    featuredProducts: [],
    newArrivals: [],
    bestSellers: [],
    trendingProducts: [],
    lookbookImages: [],
    collections: [],
  }));

  return (
    <>
      <HeroSection banners={data.heroBanners} />
      <MarqueeStrip />
      <FeaturedCollection products={data.featuredProducts} collections={data.collections} />
      <NewArrivals products={data.newArrivals} />
      <BestSellers products={data.bestSellers} />
      <TrendingSection products={data.trendingProducts} />
      <LookbookSection images={data.lookbookImages} />
      <Newsletter />
    </>
  );
}
