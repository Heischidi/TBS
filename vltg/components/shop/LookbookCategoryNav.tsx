import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  B2B_ENQUIRY_HREF,
  LOOKBOOK_CATEGORIES,
  topLevelOf,
} from "@/lib/lookbook";

const hrefFor = (slug: string) => (slug ? `/lookbook?category=${slug}` : "/lookbook");

/**
 * Category tabs for the lookbook. `selected` is the resolved slug from the URL
 * ("" = All, "archives" = every year, "archives-2024", "b2b", ...).
 */
export function LookbookCategoryNav({ selected }: { selected: string }) {
  const active = topLevelOf(selected);
  const activeCategory = LOOKBOOK_CATEGORIES.find((c) => c.slug === active);

  return (
    <div className="space-y-3">
      {/* Primary categories */}
      <nav aria-label="Lookbook categories" className="h-scroll-track">
        <Link
          href={hrefFor("")}
          aria-current={selected === "" ? "page" : undefined}
          className={cn("filter-chip shrink-0", selected === "" && "active")}
        >
          All
        </Link>
        {LOOKBOOK_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={hrefFor(cat.slug)}
            aria-current={active === cat.slug ? "page" : undefined}
            className={cn("filter-chip shrink-0", active === cat.slug && "active")}
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      {/* Archives: year selector */}
      {activeCategory?.slug === "archives" && activeCategory.children && (
        <nav aria-label="Archive years" className="h-scroll-track">
          <Link
            href={hrefFor("archives")}
            aria-current={selected === "archives" ? "page" : undefined}
            className={cn("filter-chip shrink-0 text-[11px]", selected === "archives" && "active")}
          >
            All Years
          </Link>
          {activeCategory.children.map((year) => (
            <Link
              key={year.slug}
              href={hrefFor(year.slug)}
              aria-current={selected === year.slug ? "page" : undefined}
              className={cn("filter-chip shrink-0 text-[11px]", selected === year.slug && "active")}
            >
              {year.label}
            </Link>
          ))}
        </nav>
      )}

      {/* B2B: gallery + the enquiry option */}
      {activeCategory?.slug === "b2b" && (
        <nav aria-label="B2B options" className="h-scroll-track">
          <Link
            href={hrefFor("b2b")}
            aria-current="page"
            className="filter-chip shrink-0 text-[11px] active"
          >
            Gallery
          </Link>
          <Link
            href={B2B_ENQUIRY_HREF}
            className="filter-chip shrink-0 text-[11px] border-brand-pink/40 text-brand-pink"
          >
            Enquiries for B2B
            <ArrowUpRight size={12} />
          </Link>
        </nav>
      )}
    </div>
  );
}

