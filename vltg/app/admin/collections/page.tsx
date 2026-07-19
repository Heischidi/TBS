import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminCollectionsClient } from "@/components/admin/AdminCollectionsClient";

export const metadata: Metadata = { title: "Collections | TBS Admin" };

export default async function AdminCollectionsPage() {
  const [collections, categories] = await Promise.all([
    db.collection.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { products: true } } } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <AdminCollectionsClient collections={collections as any} categories={categories} />;
}
