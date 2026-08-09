import { db } from "@/lib/db";
import { AdminContentClient } from "@/components/admin/AdminContentClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Content | TBS Admin" };

export default async function AdminContentPage() {
  const [banners, lookbook] = await Promise.all([
    db.heroBanner.findMany({ orderBy: { order: "asc" } }),
    db.lookbookImage.findMany({ orderBy: { order: "asc" } }),
  ]);
  return <AdminContentClient banners={banners} lookbook={lookbook} />;
}
