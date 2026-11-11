import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { isAssignableCategory } from "@/lib/lookbook";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || !("category" in body)) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  const category = body.category === "" || body.category === null ? null : body.category;
  if (category !== null && !isAssignableCategory(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const image = await db.lookbookImage.update({ where: { id }, data: { category } });
    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  try {
    await db.lookbookImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
