import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { isAssignableCategory } from "@/lib/lookbook";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.image !== "string" || !body.image) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  if (body.category != null && body.category !== "" && !isAssignableCategory(body.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const image = await db.lookbookImage.create({
    data: {
      image: body.image,
      caption: typeof body.caption === "string" ? body.caption : null,
      category: body.category || null,
      order: Number.isInteger(body.order) ? body.order : 0,
    },
  });
  return NextResponse.json(image, { status: 201 });
}
