import { db } from "@/lib/db";
import { AdminGalleryClient } from "@/components/admin/AdminGalleryClient";

export const metadata = { title: "Gallery — TBS Admin" };

export default async function GalleryPage() {
  const setting = await db.setting.findUnique({ where: { key: "gallery_images" } });
  const images: string[] = setting ? JSON.parse(setting.value) : [];

  return <AdminGalleryClient initialImages={images} />;
}
