import { db } from "@/lib/db";
import {
  CustomLookbookCategory,
  LookbookCategory,
  isAssignableCategory,
  mergeLookbookCategories,
} from "@/lib/lookbook";

/**
 * Loads custom lookbook categories from the database and merges them with the
 * built-in defaults. Falls back gracefully to defaults if the DB is offline.
 */
export async function getLookbookCategories(): Promise<{
  categories: LookbookCategory[];
  customCategories: CustomLookbookCategory[];
}> {
  let customCategories: CustomLookbookCategory[] = [];
  try {
    customCategories = await db.lookbookCategory.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, slug: true, parentSlug: true, order: true },
    });
  } catch (error) {
    console.error("Failed to load lookbook categories:", error);
  }
  return {
    categories: mergeLookbookCategories(customCategories),
    customCategories,
  };
}

/**
 * Validates that an image category slug matches either a built-in assignable
 * category or an existing custom category stored in the database.
 */
export async function isValidAssignableLookbookCategory(value: unknown): Promise<boolean> {
  if (typeof value !== "string" || !value) return false;
  if (isAssignableCategory(value)) return true;
  const found = await db.lookbookCategory.findUnique({
    where: { slug: value },
    select: { id: true },
  });
  return Boolean(found);
}

