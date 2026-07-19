import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Product | TBS Admin" };

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.collection.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);
  return <ProductForm categories={categories} collections={collections} />;
}
