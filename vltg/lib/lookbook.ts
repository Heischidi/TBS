/**
 * Lookbook category configuration — shared by the public lookbook page,
 * the admin uploader, and the lookbook APIs.
 *
 * Built-in categories are always available; admins can also add custom
 * LookbookCategory records in the database which are merged in cleanly.
 *
 * An image stores one category slug (e.g. "night-owl", "archives-2024", or a
 * custom slug). The parent "archives" slug is a virtual grouping that matches
 * every "archives-YYYY" image.
 */

export interface LookbookCategory {
  slug: string;
  label: string;
  /** Sub-categories that an image can actually be assigned to. */
  children?: { slug: string; label: string }[];
}

export interface CustomLookbookCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export const ARCHIVE_YEARS = ["2023", "2024", "2025", "2026"] as const;

export const LOOKBOOK_CATEGORIES: LookbookCategory[] = [
  { slug: "charity-festival-1-0", label: "Charity Festival 1.0" },
  { slug: "night-owl", label: "Night Owl" },
  {
    slug: "archives",
    label: "Archives",
    children: ARCHIVE_YEARS.map((year) => ({
      slug: `archives-${year}`,
      label: year,
    })),
  },
  { slug: "b2b", label: "B2B" },
  { slug: "welcome-to-nigeria", label: "Welcome to Nigeria" },
];

/** Route of the B2B enquiry page. */
export const B2B_ENQUIRY_HREF = "/lookbook/b2b/enquiries";

/** Flattens a category list into leaf slugs that images can be saved with. */
export function buildAssignableCategories(
  categories: LookbookCategory[] = LOOKBOOK_CATEGORIES
): { slug: string; label: string }[] {
  return categories.flatMap((c) =>
    c.children
      ? c.children.map((child) => ({
          slug: child.slug,
          label: `${c.label} — ${child.label}`,
        }))
      : [{ slug: c.slug, label: c.label }]
  );
}

/** Built-in assignable leaf categories. */
export const ASSIGNABLE_CATEGORIES: { slug: string; label: string }[] =
  buildAssignableCategories(LOOKBOOK_CATEGORIES);

const BUILTIN_SLUGS = new Set([
  "all",
  "archives",
  ...ASSIGNABLE_CATEGORIES.map((c) => c.slug),
]);

/** Converts a display name into a clean URL/DB slug. */
export function slugifyLookbookCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** True when a slug collides with a built-in/reserved Lookbook slug. */
export function isReservedLookbookSlug(slug: string): boolean {
  return !slug || BUILTIN_SLUGS.has(slug) || slug.startsWith("archives-");
}

/** Appends custom DB categories after the built-in ones, deduplicating by slug. */
export function mergeLookbookCategories(
  custom: Pick<CustomLookbookCategory, "name" | "slug">[]
): LookbookCategory[] {
  const seen = new Set(BUILTIN_SLUGS);
  const extras: LookbookCategory[] = [];
  for (const item of custom) {
    if (!item.slug || seen.has(item.slug)) continue;
    seen.add(item.slug);
    extras.push({ slug: item.slug, label: item.name });
  }
  return [...LOOKBOOK_CATEGORIES, ...extras];
}

export function isAssignableCategory(
  value: unknown,
  categories: LookbookCategory[] = LOOKBOOK_CATEGORIES
): value is string {
  if (typeof value !== "string" || !value) return false;
  return buildAssignableCategories(categories).some((c) => c.slug === value);
}

/** Human readable label for a stored image category (or null if uncategorised). */
export function categoryLabel(
  slug: string | null | undefined,
  categories: LookbookCategory[] = LOOKBOOK_CATEGORIES
): string | null {
  if (!slug) return null;
  return buildAssignableCategories(categories).find((c) => c.slug === slug)?.label ?? null;
}

/**
 * Normalises the `?category=` query value into a known top-level or archive
 * slug. Unknown values fall back to "all" (empty string).
 */
export function resolveCategoryParam(
  value: string | undefined,
  categories: LookbookCategory[] = LOOKBOOK_CATEGORIES
): string {
  if (!value) return "";
  if (value === "archives") return "archives";
  if (buildAssignableCategories(categories).some((c) => c.slug === value)) return value;
  return "";
}

/** Which top-level tab a resolved slug belongs to ("" for All). */
export function topLevelOf(slug: string): string {
  if (slug.startsWith("archives")) return "archives";
  return slug;
}

/** Whether an image's stored category belongs in the selected view. */
export function matchesCategory(
  imageCategory: string | null | undefined,
  selected: string
): boolean {
  if (!selected) return true; // "All"
  if (!imageCategory) return false;
  if (selected === "archives") return imageCategory.startsWith("archives-");
  return imageCategory === selected;
}
