import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { isReservedLookbookSlug, slugifyLookbookCategory } from "@/lib/lookbook";
import { getLookbookCategories } from "@/lib/lookbook-server";

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(60, "Category name must be 60 characters or less"),
});

export async function GET() {
  const data = await getLookbookCategories();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid category name" },
      { status: 400 }
    );
  }

  const name = parsed.data.name;
  const slug = slugifyLookbookCategory(name);
  if (!slug) {
    return NextResponse.json(
      { error: "Please include letters or numbers in the category name" },
      { status: 400 }
    );
  }

  if (isReservedLookbookSlug(slug)) {
    return NextResponse.json(
      { error: "That category already exists or is reserved" },
      { status: 409 }
    );
  }

  const existing = await db.lookbookCategory.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "A category with that name already exists" },
      { status: 409 }
    );
  }

  const count = await db.lookbookCategory.count();
  const category = await db.lookbookCategory.create({
    data: { name, slug, order: count },
    select: { id: true, name: true, slug: true, order: true },
  });

  return NextResponse.json(category, { status: 201 });
}

