/**
 * Lookbook category configuration — shared by the public lookbook page,
 * the admin uploader, and the lookbook APIs.
 *
 * Built-in categories are always available; admins can also add custom
 * LookbookCategory records in the database (both top-level categories and
 * subtopics/tags nested under an Archive year such as "archives-2023").
 *
 * An image stores one leaf category slug (e.g. "night-owl", "archives-2023",
 * "archives-2023-lagos-popup", or a custom slug). Parent slugs ("archives" and
 * "archives-YYYY") automatically include images from their child subtopics.
 */

export interface LookbookSubtopic {
  slug: string;
  label: string;
}

export interface LookbookChildCategory {
  slug: string;
  label: string;
  subtopics?: LookbookSubtopic[];
}

export interface LookbookCategory {
  slug: string;
  label: string;
  /** Sub-categories (e.g. Archive years) that an image can be assigned to. */
  children?: LookbookChildCategory[];
}

export interface CustomLookbookCategory {
  id: string;
  name: string;
  slug: string;
  parentSlug?: string | null;
  order: number;
}

export const ARCHIVE_YEARS = ["2023", "2024", "2025", "2026"] as const;

export const ARCHIVE_YEAR_SLUGS: string[] = ARCHIVE_YEARS.map(
  (year) => `archives-${year}`
);

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

/** Returns true when `slug` is one of the Archive year slugs ("archives-YYYY"). */
export function isArchiveYearSlug(slug: string | null | undefined): slug is string {
  return typeof slug === "string" && ARCHIVE_YEAR_SLUGS.includes(slug);
}

/** Which Archive year slug ("archives-YYYY") a year or subtopic belongs to, or null. */
export function archiveYearOf(slug: string | null | undefined): string | null {
  if (!slug) return null;
  for (const yearSlug of ARCHIVE_YEAR_SLUGS) {
    if (slug === yearSlug || slug.startsWith(`${yearSlug}-`)) {
      return yearSlug;
    }
  }
  return null;
}

/** Flattens a category tree into leaf slugs that images can be saved with. */
export function buildAssignableCategories(
  categories: LookbookCategory[] = LOOKBOOK_CATEGORIES
): { slug: string; label: string }[] {
  return categories.flatMap((c) => {
    if (!c.children) return [{ slug: c.slug, label: c.label }];
    return c.children.flatMap((child) => {
      const yearItem = { slug: child.slug, label: `${c.label} — ${child.label}` };
      const subItems = (child.subtopics ?? []).map((sub) => ({
        slug: sub.slug,
        label: `${c.label} — ${child.label} / ${sub.label}`,
      }));
      return [yearItem, ...subItems];
    });
  });
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

/** True when a top-level slug collides with a built-in/reserved Lookbook slug. */
export function isReservedLookbookSlug(slug: string): boolean {
  return !slug || BUILTIN_SLUGS.has(slug) || slug.startsWith("archives-");
}

/**
 * Merges DB custom categories into the built-in tree:
 * - entries with `parentSlug` matching an Archive year become `subtopics` under that year
 * - entries without `parentSlug` are appended as top-level categories
 */
export function mergeLookbookCategories(
  custom: Pick<CustomLookbookCategory, "name" | "slug" | "parentSlug">[]
): LookbookCategory[] {
  const baseCategories: LookbookCategory[] = LOOKBOOK_CATEGORIES.map((c) =>
    c.children
      ? {
        ...c,
        children: c.children.map((child) => ({ ...child, subtopics: [] })),
      }
      : { ...c }
  );

  const archives = baseCategories.find((c) => c.slug === "archives");
  const seenTopLevel = new Set(BUILTIN_SLUGS);
  const seenSubtopics = new Set<string>();
  const extras: LookbookCategory[] = [];

  for (const item of custom) {
    if (!item.slug) continue;

    if (item.parentSlug && isArchiveYearSlug(item.parentSlug)) {
      if (seenSubtopics.has(item.slug)) continue;
      const yearNode = archives?.children?.find((y) => y.slug === item.parentSlug);
      if (yearNode) {
        seenSubtopics.add(item.slug);
        yearNode.subtopics = yearNode.subtopics ?? [];
        yearNode.subtopics.push({ slug: item.slug, label: item.name });
      }
      continue;
    }

    if (seenTopLevel.has(item.slug)) continue;
    seenTopLevel.add(item.slug);
    extras.push({ slug: item.slug, label: item.name });
  }

  return [...baseCategories, ...extras];
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

/** Short subtopic tag label when an image belongs to an Archive year subtopic, else null. */
export function archiveSubtopicLabel(
  slug: string | null | undefined,
  categories: LookbookCategory[] = LOOKBOOK_CATEGORIES
): string | null {
  if (!slug) return null;
  const archives = categories.find((c) => c.slug === "archives");
  for (const year of archives?.children ?? []) {
    const sub = year.subtopics?.find((s) => s.slug === slug);
    if (sub) return sub.label;
  }
  return null;
}

/**
 * Normalises the `?category=` query value into a known top-level, archive year,
 * or archive subtopic slug. Unknown values fall back to "all" (empty string).
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
  if (isArchiveYearSlug(selected)) {
    return imageCategory === selected || imageCategory.startsWith(`${selected}-`);
  }
  return imageCategory === selected;
}

/** Prisma `where` filter matching `LookbookImage` rows for a resolved selection. */
export function lookbookWhereForCategory(selected: string) {
  if (!selected) return {};
  if (selected === "archives") return { category: { startsWith: "archives-" } };
  if (isArchiveYearSlug(selected)) {
    return {
      OR: [
        { category: selected },
        { category: { startsWith: `${selected}-` } },
      ],
    };
  }
  return { category: selected };
}
