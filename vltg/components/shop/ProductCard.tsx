"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  stock?: number;
  className?: string;
  /** Pass "compact" for 5-col dense grid mode */
  variant?: "default" | "compact";
}

// Deterministic pseudo-rating based on product id
function getRating(id: string): number {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 3.8 + (hash % 12) / 10; // 3.8 – 4.9
}
function getSoldCount(id: string): number {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 50 + (hash % 950); // 50 – 999
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn("text-[10px]", i <= full ? "star-filled" : half && i === full + 1 ? "star-filled opacity-60" : "star-empty")}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  comparePrice,
  image,
  images,
  sizes,
  colors,
  isNewArrival,
  isBestSeller,
  isTrending,
  stock = 0,
  className,
  variant = "default",
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const secondImage = images?.[1] || image;
  const isWishlisted = isInWishlist(id);
  const outOfStock = stock === 0;
  const discountPct =
    comparePrice && comparePrice > price
      ? Math.round((1 - price / comparePrice) * 100)
      : 0;
  const rating = getRating(id);
  const soldCount = getSoldCount(id);
  const isCompact = variant === "compact";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: id,
      name,
      price,
      image,
      size: sizes?.[0] || "One Size",
      color: colors?.[0]?.name || "Black",
      quantity: 1,
      slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ productId: id, name, price, image, slug });
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn("group relative", isCompact && "product-card-compact", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${slug}`}>
        {/* Image Container */}
        <div className={cn("relative overflow-hidden bg-surface-3 rounded-sm", isCompact ? "aspect-square" : "aspect-3/4")}>
          {/* Main image */}
          <Image
            src={image || "/placeholder-product.jpg"}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              hovered && secondImage !== image ? "opacity-0" : "opacity-100"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Hover image */}
          {secondImage !== image && (
            <Image
              src={secondImage}
              alt={name}
              fill
              className={cn(
                "object-cover transition-all duration-700",
                hovered ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 product-card-overlay" />

          {/* TOP-LEFT Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPct > 0 && (
              <span className="sale-badge-red">-{discountPct}%</span>
            )}
            {isNewArrival && discountPct === 0 && (
              <span className="sale-badge">New</span>
            )}
            {isBestSeller && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide bg-neon-pink text-white">
                Best Seller
              </span>
            )}
            {outOfStock && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide bg-black/80 text-text-secondary">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist button — always top-right */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all",
              isWishlisted
                ? "bg-brand-pink text-white"
                : "bg-black/50 text-white/70 hover:bg-brand-pink hover:text-white opacity-0 group-hover:opacity-100"
            )}
            aria-label="Add to wishlist"
          >
            <Heart size={12} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick Add — bottom hover bar */}
          {!isCompact && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0"
            >
              <button
                onClick={handleQuickAdd}
                disabled={outOfStock}
                className={cn(
                  "w-full py-3 text-[10px] font-semibold uppercase tracking-widest transition-all border-t border-white/10 backdrop-blur-md",
                  added
                    ? "bg-white/10 text-white"
                    : outOfStock
                    ? "bg-black/70 text-text-muted cursor-not-allowed"
                    : "bg-black/40 text-white hover:bg-white hover:text-black"
                )}
                id={`quick-add-${slug}`}
              >
                {added ? "Added ✓" : outOfStock ? "Sold Out" : "Quick Add"}
              </button>
            </motion.div>
          )}

          {/* Size pills on hover */}
          {!isCompact && sizes && sizes.length > 0 && hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-10 right-2 flex flex-col gap-0.5"
            >
              {sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-[9px] font-bold bg-black/70 text-white px-1.5 py-0.5 tracking-wider text-right"
                >
                  {size}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className={cn("mt-2 px-0.5 product-card-info", isCompact ? "mt-1.5" : "mt-3")}>
          {/* Name */}
          <h3
            className={cn(
              "font-medium text-text-primary group-hover:text-brand-pink transition-colors leading-tight line-clamp-2",
              isCompact ? "text-[11px]" : "text-sm"
            )}
          >
            {name}
          </h3>

          {/* Removed rating and sold count for a more premium look */}

          {/* Price row */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn("font-bold text-white", isCompact ? "text-xs" : "text-sm")}>
              {formatPrice(price)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-text-muted text-xs line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
            {discountPct > 0 && (
              <span className="text-brand-pink text-[10px] font-bold">-{discountPct}%</span>
            )}
          </div>

          {/* Color swatches + count */}
          {colors && colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  title={color.name}
                  className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-text-muted text-[10px]">+{colors.length - 4}</span>
              )}
              {colors.length > 1 && (
                <span className="text-text-muted text-[10px] ml-auto">
                  {colors.length} Colors
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
