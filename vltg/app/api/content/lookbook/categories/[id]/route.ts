import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const existing = await db.lookbookCategory.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Archive subtopic images stay grouped under their parent year instead of losing their year.
  const fallbackCategory = existing.parentSlug ?? null;

  await db.$transaction([
    db.lookbookImage.updateMany({
      where: { category: existing.slug },
      data: { category: fallbackCategory },
    }),
    db.lookbookCategory.delete({ where: { id } }),
  ]);

  revalidatePath("/lookbook");
  return NextResponse.json({
    success: true,
    slug: existing.slug,
    fallbackCategory,
  });
}
