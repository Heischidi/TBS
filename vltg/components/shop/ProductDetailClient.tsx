"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus,
  Check, ZoomIn, Ruler, X, Truck, RotateCcw, Eye,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string; slug: string; name: string; description: string;
  price: any; comparePrice?: any; images: string[]; sizes: string[]; colors: any;
  stock: number; isNewArrival: boolean; isBestSeller: boolean; isTrending: boolean;
  category: { name: string; slug: string };
  collection?: { name: string; slug: string } | null;
}

const SIZE_GUIDE: Record<string, { chest: string; waist: string; hip: string }> = {
  XS:  { chest: "81–86",  waist: "61–66",  hip: "86–91"  },
  S:   { chest: "86–91",  waist: "66–71",  hip: "91–96"  },
  M:   { chest: "91–96",  waist: "71–76",  hip: "96–101" },
  L:   { chest: "96–101", waist: "76–81",  hip: "101–106" },
  XL:  { chest: "101–106",waist: "81–86",  hip: "106–111" },
  XXL: { chest: "106–111",waist: "86–91",  hip: "111–116" },
};

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-2 border border-white/8 w-full max-w-lg rounded-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-2">
            <Ruler size={16} className="text-brand-pink" />
            <span className="font-display text-xl tracking-wider">SIZE GUIDE</span>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-text-muted text-xs mb-4 uppercase tracking-widest">All measurements in centimetres (cm)</p>
          <div className="overflow-x-auto">
            <table className="w-full size-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Hip</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(SIZE_GUIDE).map(([size, dims]) => (
                  <tr key={size}>
                    <td className="font-bold text-white">{size}</td>
                    <td>{dims.chest}</td>
                    <td>{dims.waist}</td>
                    <td>{dims.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-muted text-xs mt-4">
            💡 Tip: If between sizes, we recommend sizing up for a relaxed fit.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Deterministic viewer count
function getViewers(id: string) {
  const h = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 12 + (h % 89);
}

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const colors = Array.isArray(product.colors) ? product.colors : [];
  const isWishlisted = isInWishlist(product.id);
  const outOfStock = product.stock === 0;
  const viewers = getViewers(product.id);

  const discountPct =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
      : 0;

  // Show sticky bar after scrolling past the add-to-cart button
  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    if (!selectedColor && colors.length > 0) {
      alert("Please select a color");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] || "",
      size: selectedSize || "One Size",
      color: selectedColor || "Default",
      quantity,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] text-text-muted uppercase tracking-wider py-5">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-white transition-colors">Shop</a>
          <span>/</span>
          <a href={`/shop?category=${product.category.slug}`} className="hover:text-white transition-colors">
            {product.category.name}
          </a>
          <span>/</span>
          <span className="text-text-secondary line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Images ── */}
          <div>
            {/* Main image */}
            <div
              className="relative aspect-3/4 overflow-hidden bg-surface-3 rounded-sm cursor-zoom-in group"
              onClick={() => setZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {product.images[selectedImage] ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-surface-3 to-surface-4 flex items-center justify-center">
                      <span className="font-display text-8xl text-white/5 tracking-widest">TBS</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discountPct > 0 && (
                  <span className="sale-badge-red">-{discountPct}%</span>
                )}
                {product.isNewArrival && discountPct === 0 && (
                  <span className="sale-badge">New</span>
                )}
                {product.isBestSeller && (
                  <span className="text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide bg-neon-pink text-white">
                    Best Seller
                  </span>
                )}
                {outOfStock && (
                  <span className="text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide bg-black/80 text-text-secondary">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p - 1 + product.images.length) % product.images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => (p + 1) % product.images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 p-1.5 rounded"><ZoomIn size={14} /></div>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative aspect-square overflow-hidden bg-surface-3 rounded-sm border-2 transition-colors",
                      i === selectedImage ? "border-brand-pink" : "border-transparent hover:border-white/30"
                    )}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info panel ── */}
          <div className="lg:py-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Category */}
              <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em] mb-2">
                {product.category.name}
              </p>

              {/* Name */}
              <h1 className="font-display text-4xl md:text-5xl text-white leading-none mb-3">
                {product.name}
              </h1>

              {/* Urgency / social proof */}
              {!outOfStock && (
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="urgency-pill">
                    <Eye size={10} /> {viewers} people viewing this
                  </span>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-[11px] text-yellow-400 font-semibold">
                      ⚡ Only {product.stock} left in stock
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-2xl font-bold text-white">{formatPrice(Number(product.price))}</span>
                {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                  <span className="text-text-muted line-through text-base">
                    {formatPrice(Number(product.comparePrice))}
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="sale-badge">Save {discountPct}% OFF</span>
                )}
              </div>

              {/* Free shipping callout */}
              <div className="flex items-center gap-2 text-xs text-neon-pink font-medium mb-5 bg-neon-pink/8 border border-neon-pink/20 px-3 py-2 rounded-sm w-fit">
                <Truck size={13} />
                Free delivery on orders over ₦50,000
              </div>

              {/* Stock status */}
              <p className={cn("text-xs uppercase tracking-widest mb-5 font-semibold", outOfStock ? "text-red-400" : product.stock <= 5 ? "text-yellow-400" : "text-neon-pink")}>
                {outOfStock ? "● Out of Stock" : product.stock <= 5 ? `● Only ${product.stock} left` : "● In Stock — Ready to Ship"}
              </p>

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                    Color: <span className="text-white font-medium">{selectedColor || "Select"}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color: { name: string; hex: string }) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          selectedColor === color.name ? "border-white scale-110 shadow-glow-pink" : "border-white/20 hover:border-white/60"
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase tracking-widest text-text-secondary">
                      Size: <span className="text-white font-medium">{selectedSize || "Select"}</span>
                    </p>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="flex items-center gap-1 text-[11px] text-brand-pink hover:underline"
                    >
                      <Ruler size={11} /> Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-11 h-10 px-3 border text-sm font-medium uppercase tracking-wide transition-all",
                          selectedSize === size
                            ? "border-brand-pink bg-brand-pink/10 text-white"
                            : "border-white/10 text-text-secondary hover:border-white hover:text-white"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <p className="text-xs uppercase tracking-widest text-text-secondary">Qty</p>
                <div className="flex items-center border border-white/10">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 font-semibold uppercase tracking-widest text-sm transition-all",
                    added
                      ? "bg-white text-black"
                      : outOfStock
                      ? "bg-surface-3 text-text-muted cursor-not-allowed"
                      : "bg-brand-pink text-white hover:bg-brand-pink/85"
                  )}
                  id="add-to-cart-btn"
                >
                  {added ? (
                    <><Check size={16} /> Added to Cart</>
                  ) : (
                    <><ShoppingBag size={16} /> {outOfStock ? "Sold Out" : "Add to Bag"}</>
                  )}
                </button>
                <button
                  onClick={() =>
                    toggleItem({
                      productId: product.id,
                      name: product.name,
                      price: Number(product.price),
                      image: product.images[0] || "",
                      slug: product.slug,
                    })
                  }
                  className={cn(
                    "w-14 h-14 border flex items-center justify-center transition-all",
                    isWishlisted
                      ? "border-brand-pink bg-brand-pink/10 text-brand-pink"
                      : "border-white/10 text-text-secondary hover:border-brand-pink hover:text-brand-pink"
                  )}
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Trust row */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-text-muted border-t border-white/5 pt-5">
                <span className="flex items-center gap-1.5">
                  <Truck size={12} className="text-text-muted" /> Free delivery ₦50k+
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw size={12} className="text-text-muted" /> 30-day returns
                </span>
                <span className="flex items-center gap-1.5">
                  🔒 Secure checkout
                </span>
              </div>

              {/* Description */}
              <div className="mt-7 pt-6 border-t border-white/5">
                <h3 className="font-display text-base tracking-wider mb-3">DESCRIPTION</h3>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Details */}
              <div className="mt-5 pt-5 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted text-xs uppercase tracking-wider">SKU</span>
                    <p className="text-text-secondary mt-1">{product.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-text-muted text-xs uppercase tracking-wider">Category</span>
                    <p className="text-text-secondary mt-1">{product.category.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl md:text-3xl text-white mb-8 tracking-wide">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id} slug={p.slug} name={p.name}
                  price={Number(p.price)}
                  image={p.images[0] || ""} images={p.images}
                  sizes={p.sizes} colors={p.colors}
                  isNewArrival={p.isNewArrival} isBestSeller={p.isBestSeller}
                  isTrending={p.isTrending} stock={p.stock}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky mobile Add to Bag bar */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="sticky-pdp-bar md:hidden"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium line-clamp-1">{product.name}</p>
              <p className="text-brand-pink text-sm font-bold">{formatPrice(Number(product.price))}</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={cn(
                "flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-wider text-xs shrink-0 transition-all",
                added ? "bg-white text-black" : outOfStock ? "bg-surface-3 text-text-muted" : "bg-brand-pink text-white"
              )}
            >
              {added ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Bag</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomed && product.images[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={24} />
            </button>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={800}
              height={1000}
              className="max-h-[90vh] w-auto object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size guide modal */}
      <AnimatePresence>
        {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
