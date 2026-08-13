import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

const GALLERY_SETTING_KEY = "gallery_images";

// GET — fetch all gallery images
export async function GET() {
  try {
    const setting = await db.setting.findUnique({ where: { key: GALLERY_SETTING_KEY } });
    const images: string[] = setting ? JSON.parse(setting.value) : [];
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST — upload a new image (base64)
export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const result = await cloudinary.uploader.upload(image, {
      folder: "tbs-gallery",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    // Append URL to the stored list
    const setting = await db.setting.findUnique({ where: { key: GALLERY_SETTING_KEY } });
    const existing: string[] = setting ? JSON.parse(setting.value) : [];
    const updated = [result.secure_url, ...existing];

    await db.setting.upsert({
      where: { key: GALLERY_SETTING_KEY },
      update: { value: JSON.stringify(updated) },
      create: { key: GALLERY_SETTING_KEY, value: JSON.stringify(updated) },
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// DELETE — remove an image by URL
export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    // Extract public_id from the Cloudinary URL to delete from cloud
    const matches = url.match(/\/tbs-gallery\/([^/.]+)/);
    if (matches?.[1]) {
      await cloudinary.uploader.destroy(`tbs-gallery/${matches[1]}`);
    }

    // Remove from stored list
    const setting = await db.setting.findUnique({ where: { key: GALLERY_SETTING_KEY } });
    const existing: string[] = setting ? JSON.parse(setting.value) : [];
    const updated = existing.filter((u) => u !== url);

    await db.setting.upsert({
      where: { key: GALLERY_SETTING_KEY },
      update: { value: JSON.stringify(updated) },
      create: { key: GALLERY_SETTING_KEY, value: JSON.stringify(updated) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
