import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full TBS collection. Filter by category, size, color, and price.",
};

export default async function ShopPage() {
  let categories: any[] = [];
  let collections: any[] = [];
  try {
    [categories, collections] = await Promise.all([
      db.category.findMany({ orderBy: { name: "asc" } }),
      db.collection.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    ]);
  } catch (e) {
    console.warn("DB connection failed in shop page. Serving mock metadata.");
  }

  if (categories.length === 0) {
    categories = [
      { id: "mock-c1", name: "T-Shirts", slug: "t-shirts" },
      { id: "mock-c2", name: "Hoodies", slug: "hoodies" },
      { id: "mock-c3", name: "Pants & Trousers", slug: "trousers" },
      { id: "mock-c4", name: "Accessories", slug: "accessories" }
    ];
  }

  if (collections.length === 0) {
    collections = [
      { id: "mock-col-1", name: "Core Essentials", slug: "core-essentials" },
      { id: "mock-col-2", name: "SS25 Drop 01", slug: "ss25-drop-01" }
    ];
  }

  return <ShopClient categories={categories} collections={collections} />;
}
