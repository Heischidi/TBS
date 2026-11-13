import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import {
  isArchiveYearSlug,
  isReservedLookbookSlug,
  slugifyLookbookCategory,
} from "@/lib/lookbook";
import { getLookbookCategories } from "@/lib/lookbook-server";

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a name")
    .max(60, "Name must be 60 characters or less"),
  parentSlug: z.string().trim().optional().nullable(),
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
  const parentSlug = parsed.data.parentSlug || null;
  const baseSlug = slugifyLookbookCategory(name);
  if (!baseSlug) {
    return NextResponse.json(
      { error: "Please include letters or numbers in the name" },
      { status: 400 }
    );
  }

  let slug = baseSlug;
  if (parentSlug) {
    if (!isArchiveYearSlug(parentSlug)) {
      return NextResponse.json(
        { error: "Subtopics can only be added under an Archive year (2023–2026)" },
        { status: 400 }
      );
    }
    slug = `${parentSlug}-${baseSlug}`;
  } else {
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Category name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (isReservedLookbookSlug(slug)) {
      return NextResponse.json(
        { error: "That category already exists or is reserved" },
        { status: 409 }
      );
    }
  }

  const existing = await db.lookbookCategory.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: parentSlug ? "That subtopic already exists for this year" : "A category with that name already exists" },
      { status: 409 }
    );
  }

  const count = await db.lookbookCategory.count();
  const category = await db.lookbookCategory.create({
    data: { name, slug, parentSlug, order: count },
    select: { id: true, name: true, slug: true, parentSlug: true, order: true },
  });

  revalidatePath("/lookbook");
  return NextResponse.json(category, { status: 201 });
}
