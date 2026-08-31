"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, LayoutGrid, Grid2x2, Grid3x3, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string; slug: string; }
interface Collection { id: string; name: string; slug: string; }
interface Product {
  id: string; slug: string; name: string; price: any; comparePrice?: any;
  images: string[]; sizes: string[]; colors: any;
  isNewArrival: boolean; isBestSeller: boolean; isTrending: boolean; stock: number;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const DENSITY_OPTIONS = [
  { cols: 2, icon: Grid2x2, label: "2 col" },
  { cols: 4, icon: LayoutGrid, label: "4 col" },
  { cols: 5, icon: Grid3x3, label: "5 col" },
] as const;

type ColCount = 2 | 4 | 5;

const PAGE_SIZE = 24;

export function ShopClient({ categories, collections }: { categories: Category[]; collections: Collection[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sort, setSort] = useState("createdAt_desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cols, setCols] = useState<ColCount>(4);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const fetchProducts = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    resetPage ? setLoading(true) : setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(PAGE_SIZE), sort });
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedCollection) params.set("collection", selectedCollection);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (resetPage) {
        setProducts(data.products || []);
        setPage(1);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }
      setTotal(data.total || 0);
    } catch {
      if (resetPage) setProducts([]);
    }
    setLoading(false);
    setLoadingMore(false);
  }, [page, search, selectedCategory, selectedCollection, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, selectedCollection, sort, minPrice, maxPrice]);

  const loadMore = () => {
    setPage((p) => {
      const next = p + 1;
      // Trigger fetch with updated page by calling directly
      return next;
    });
  };

  useEffect(() => {
    if (page > 1) fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const clearFilters = () => {
    setSearch(""); setSelectedCategory(""); setSelectedCollection("");
    setSelectedSizes([]); setMinPrice(""); setMaxPrice("");
  };

  const hasFilters = search || selectedCategory || selectedCollection || selectedSizes.length || minPrice || maxPrice;
  const hasMore = products.length < total;

  const gridClass = {
    2: "grid-cols-2",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  }[cols];

  return (
    <div className="min-h-screen pt-44 md:pt-48">
      {/* Top bar */}
      <div className="bg-surface-1 border-b border-white/5 px-4 md:px-8 py-5 sticky top-14 md:top-16 z-30 backdrop-blur-lg bg-black/90">
        <div className="max-w-7xl mx-auto">
          {/* Row 1: title + search + sort + density */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-white">SHOP ALL</h1>
              <p className="text-text-muted text-xs mt-0.5">{total} products</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); }}
                  placeholder="Search…"
                  className="input-dark pl-8 pr-4 py-2 text-xs w-36 focus:w-52 transition-all rounded-full"
                  id="shop-search"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-dark text-[11px] py-2 pl-3 pr-7 uppercase tracking-wider appearance-none cursor-pointer rounded-full"
                  id="shop-sort"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
              </div>

              {/* Grid density */}
              <div className="hidden md:flex items-center border border-white/10 divide-x divide-white/10">
                {DENSITY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.cols}
                      onClick={() => setCols(opt.cols)}
                      className={cn(
                        "px-2.5 py-2 transition-colors",
                        cols === opt.cols ? "bg-brand-pink/15 text-brand-pink" : "text-text-muted hover:text-white"
                      )}
                      title={opt.label}
                    >
                      <Icon size={14} />
                    </button>
                  );
                })}
              </div>

              {/* Filter drawer toggle (mobile) */}
              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 border text-[11px] uppercase tracking-wider rounded-full transition-colors",
                  filterDrawerOpen || hasFilters
                    ? "border-brand-pink text-brand-pink"
                    : "border-white/15 text-text-secondary hover:border-white hover:text-white"
                )}
                id="filter-toggle"
              >
                <SlidersHorizontal size={13} />
                Filters
                {hasFilters && <span className="w-1.5 h-1.5 bg-brand-pink rounded-full" />}
              </button>
            </div>
          </div>

          {/* Row 2: Horizontal filter chips */}
          <div className="h-scroll-track -mx-1 px-1">
            {/* Category chips */}
            <button
              onClick={() => setSelectedCategory("")}
              className={cn("filter-chip shrink-0", !selectedCategory && "active")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                className={cn("filter-chip shrink-0", selectedCategory === cat.slug && "active")}
              >
                {cat.name}
                {selectedCategory === cat.slug && (
                  <X size={10} className="ml-1" />
                )}
              </button>
            ))}

            {/* Collection chips */}
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelectedCollection(selectedCollection === col.slug ? "" : col.slug)}
                className={cn("filter-chip shrink-0", selectedCollection === col.slug && "active")}
              >
                {col.name}
                {selectedCollection === col.slug && (
                  <X size={10} className="ml-1" />
                )}
              </button>
            ))}



            {/* Clear all */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="filter-chip shrink-0 text-[10px] border-red-400/30 text-red-400 hover:border-red-400"
              >
                <X size={10} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter drawer (mobile price range) */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface-2 border-b border-white/5 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted uppercase tracking-wider">Price (₦)</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-dark px-3 py-1.5 text-xs w-24 rounded"
                />
                <span className="text-text-muted">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-dark px-3 py-1.5 text-xs w-24 rounded"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className={cn("grid gap-3 md:gap-4", gridClass)}>
            {Array(12).fill(null).map((_, i) => (
              <div key={i} className="aspect-3/4 skeleton rounded-sm" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-text-muted">NO PRODUCTS FOUND</p>
            <p className="text-text-muted text-sm mt-2">Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-6 text-brand-pink text-sm uppercase tracking-widest hover:underline">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className={cn("grid gap-3 md:gap-4", gridClass)}>
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4) }}
                >
                  <ProductCard
                    id={p.id} slug={p.slug} name={p.name}
                    price={Number(p.price)}
                    comparePrice={p.comparePrice ? Number(p.comparePrice) : undefined}
                    image={p.images[0] || ""} images={p.images}
                    sizes={p.sizes} colors={p.colors}
                    isNewArrival={p.isNewArrival} isBestSeller={p.isBestSeller}
                    isTrending={p.isTrending} stock={p.stock}
                    variant={cols === 5 ? "compact" : "default"}
                  />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-12 py-3.5 border border-white/20 text-text-secondary hover:border-brand-pink hover:text-brand-pink text-sm font-medium uppercase tracking-widest transition-all disabled:opacity-50"
                  id="load-more-btn"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    `Load More (${total - products.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
