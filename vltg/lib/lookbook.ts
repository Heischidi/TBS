/**
 * Lookbook category configuration — single source of truth shared by the
 * public lookbook page, the admin uploader, and the lookbook API.
 *
 * An image stores exactly one category slug (e.g. "night-owl" or
 * "archives-2024"). The parent "archives" slug is a virtual grouping that
 * matches every "archives-YYYY" image.
 */

export interface LookbookCategory {
  slug: string;
  label: string;
  /** Sub-categories that an image can actually be assigned to. */
  children?: { slug: string; label: string }[];
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

/** Every slug an image may be saved with (leaf categories only). */
export const ASSIGNABLE_CATEGORIES: { slug: string; label: string }[] =
  LOOKBOOK_CATEGORIES.flatMap((c) =>
    c.children
      ? c.children.map((child) => ({
          slug: child.slug,
          label: `${c.label} — ${child.label}`,
        }))
      : [{ slug: c.slug, label: c.label }]
  );

const ASSIGNABLE_SLUGS = new Set(ASSIGNABLE_CATEGORIES.map((c) => c.slug));

export function isAssignableCategory(value: unknown): value is string {
  return typeof value === "string" && ASSIGNABLE_SLUGS.has(value);
}

/** Human readable label for a stored image category (or null if uncategorised). */
export function categoryLabel(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return ASSIGNABLE_CATEGORIES.find((c) => c.slug === slug)?.label ?? null;
}

/**
 * Normalises the `?category=` query value into a known top-level or archive
 * slug. Unknown values fall back to "all" (empty string).
 */
export function resolveCategoryParam(value: string | undefined): string {
  if (!value) return "";
  if (value === "archives") return "archives";
  if (ASSIGNABLE_SLUGS.has(value)) return value;
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

