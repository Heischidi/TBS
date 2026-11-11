import { db } from "@/lib/db";
import { AdminContentClient } from "@/components/admin/AdminContentClient";
import { getLookbookCategories } from "@/lib/lookbook-server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Content | TBS Admin" };

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [banners, lookbook, { customCategories }] = await Promise.all([
    db.heroBanner.findMany({ orderBy: { order: "asc" } }),
    db.lookbookImage.findMany({ orderBy: { order: "asc" } }),
    getLookbookCategories(),
  ]);
  return (
    <AdminContentClient
      banners={banners}
      lookbook={lookbook}
      lookbookCategories={customCategories}
    />
  );
}
