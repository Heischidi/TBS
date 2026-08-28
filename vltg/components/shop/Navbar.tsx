"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, Menu, X, Flame, ChevronDown, User as UserIcon } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

// Primary nav — always visible
const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/contact", label: "Contact" },
];

// Dropdown nav — hidden behind "More"
const moreLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/about", label: "About" },
];

// Keep for mobile menu
const allNavLinks = [...primaryLinks, ...moreLinks];

const categoryPills = [
  { href: "/shop", label: "All" },
  { href: "/new-arrivals", label: "New In ✨" },
  { href: "/best-sellers", label: "Sale 🔥", hot: true },
  { href: "/shop?category=t-shirts", label: "T-Shirts" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=trousers", label: "Trousers" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/collections", label: "Collections" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { totalItems, toggleCart } = useCartStore();
  const { totalItems: wishlistTotal } = useWishlistStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const isHome = pathname === "/";
  const scrolledOrNotHome = scrolled || !isHome;

  // Only show category pills on shopping/browsing pages
  const SHOP_PILL_ROUTES = ["/shop", "/collections", "/products", "/new-arrivals", "/best-sellers", "/cart", "/checkout"];
  const showCategoryPills = SHOP_PILL_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolledOrNotHome
            ? "bg-black/97 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        )}
        style={{ marginTop: "var(--announcement-height, 0px)" }}
      >
        {/* Main nav row */}
        <div style={{ maxWidth: 1320, margin: "0 auto", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}>
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="relative z-10 shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="font-brand text-2xl md:text-3xl tracking-widest text-white"
              >
                TBS
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* Primary direct links */}
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-medium uppercase tracking-widest transition-colors duration-200 relative group",
                    pathname === link.href
                      ? "text-brand-pink"
                      : "text-text-secondary hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px bg-brand-pink transition-all duration-200",
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              ))}

              {/* More dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium uppercase tracking-widest transition-colors duration-200",
                    moreLinks.some((l) => pathname === l.href)
                      ? "text-brand-pink"
                      : "text-text-secondary hover:text-white"
                  )}
                  id="nav-more-btn"
                >
                  More
                  <ChevronDown
                    size={12}
                    className={cn(
                      "transition-transform duration-200",
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-black/95 backdrop-blur-xl border border-white/8 shadow-2xl"
                    >
                      {moreLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center px-4 py-3 text-xs uppercase tracking-widest transition-colors border-b border-white/5 last:border-0",
                            pathname === link.href
                              ? "text-brand-pink bg-white/3"
                              : "text-text-secondary hover:text-white hover:bg-white/5"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                      {/* Sale badge inside dropdown */}
                      <Link
                        href="/best-sellers"
                        className="flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-widest text-brand-pink hover:bg-white/5 transition-colors"
                      >
                        <Flame size={11} className="fill-brand-pink" />
                        Sale
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search — desktop expandable */}
              <div className="hidden md:flex items-center">
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.form
                      key="search-open"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      action="/shop"
                      method="get"
                      className="flex items-center border border-white/15 bg-white/5 overflow-hidden"
                    >
                      <input
                        autoFocus
                        type="text"
                        name="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search products…"
                        className="bg-transparent text-white text-xs px-3 py-2 flex-1 outline-none placeholder-text-muted"
                        id="navbar-search-input"
                      />
                      <button
                        type="button"
                        onClick={() => { setSearchOpen(false); setSearchValue(""); }}
                        className="px-2 text-text-muted hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="search-icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSearchOpen(true)}
                      className="text-text-secondary hover:text-white transition-colors"
                      aria-label="Search"
                    >
                      <Search size={17} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative text-text-secondary hover:text-white transition-colors p-2 -mr-1"
                aria-label="Wishlist"
              >
                <Heart size={17} />
                {wishlistTotal() > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand-pink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistTotal()}
                  </span>
                )}
              </Link>

              {/* Account / Login */}
              {session?.user ? (
                <Link
                  href="/profile"
                  className="text-text-secondary hover:text-white transition-colors flex items-center gap-1"
                  aria-label="Account"
                >
                  <UserIcon size={17} className="text-brand-pink" />
                  <span className="hidden sm:inline text-[10px] uppercase font-semibold tracking-wider max-w-15 truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-white transition-colors"
                  aria-label="Login"
                >
                  <UserIcon size={17} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative text-text-secondary hover:text-white transition-colors p-2 -mr-1"
                aria-label="Cart"
                id="cart-trigger"
              >
                <ShoppingBag size={17} />
                {totalItems() > 0 && (
                  <motion.span
                    key={totalItems()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 bg-brand-pink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems()}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white p-2 -mr-2"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category pills row — desktop only, shopping pages only */}
        <div
          className={cn(
            "hidden lg:block border-t border-white/5 transition-all duration-300",
            showCategoryPills && scrolledOrNotHome ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
          )}
        >
          <div style={{ maxWidth: 1320, margin: "0 auto", paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}>
            <div className="h-scroll-track py-2.5 gap-2.5 overflow-x-auto">
              {categoryPills.map((pill) => (
                <Link
                  key={pill.href}
                  href={pill.href}
                  className={cn(
                    "filter-chip shrink-0 text-[11px]",
                    pill.hot && "border-brand-pink/40 text-brand-pink",
                    pathname === pill.href && "active"
                  )}
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-black/98 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              {/* Mobile search */}
              <div className="px-4 pt-4">
                <form action="/shop" method="get" className="flex items-center border border-white/15 bg-white/5">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products…"
                    className="bg-transparent text-white text-sm px-4 py-3 flex-1 outline-none placeholder-text-muted"
                    id="mobile-search-input"
                  />
                  <button type="submit" className="px-3 text-text-muted hover:text-white">
                    <Search size={16} />
                  </button>
                </form>
              </div>

              {/* Mobile category pills */}
              <div className="px-4 py-3">
                <div className="h-scroll-track">
                  {categoryPills.map((pill) => (
                    <Link
                      key={pill.href}
                      href={pill.href}
                      className={cn(
                        "filter-chip shrink-0 text-[11px]",
                        pill.hot && "border-brand-pink/40 text-brand-pink"
                      )}
                    >
                      {pill.label}
                    </Link>
                  ))}
                </div>
              </div>

              <nav className="px-4 pb-6 flex flex-col gap-1">
                {allNavLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block font-display text-xl tracking-widest py-2 border-b border-white/4",
                        pathname === link.href ? "text-brand-pink" : "text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {session?.user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      href="/profile"
                      className="block font-display text-xl tracking-widest py-2 border-b border-white/4 text-brand-pink"
                    >
                      My Profile
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      href="/login"
                      className="block font-display text-xl tracking-widest py-2 border-b border-white/4 text-white"
                    >
                      Login / Register
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}
