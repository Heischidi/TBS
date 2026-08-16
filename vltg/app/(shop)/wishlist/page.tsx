"use client";

import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "One Size",
      color: "Default",
      quantity: 1,
      slug: item.slug,
    });
    removeItem(item.productId);
  };

  return (
    <div className="min-h-screen pt-36 pb-24 bg-black">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="border-b border-white/10 pb-6 mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-pink mb-2">
            Saved Items
          </p>
          <h1 className="font-display text-3xl text-white tracking-wide">
            WISHLIST
          </h1>
          {items.length > 0 && (
            <p className="text-text-muted text-[11px] uppercase tracking-widest mt-2">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted text-[11px] uppercase tracking-widest mb-6">
              · Nothing saved yet ·
            </p>
            <Link
              href="/shop"
              className="inline-block border border-brand-pink text-brand-pink text-[11px] font-bold uppercase tracking-widest px-8 py-3 hover:bg-brand-pink hover:text-white transition-all"
            >
              Browse Shop
            </Link>
          </div>
        )}

        {/* Items list */}
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 border-b border-white/8 py-5"
            >
              {/* Image */}
              <Link href={`/products/${item.slug}`} className="shrink-0">
                <div className="relative w-20 h-24 bg-surface-3 border border-white/8 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-white/10 text-sm">TBS</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white hover:text-brand-pink transition-colors line-clamp-2 mb-1">
                    {item.name}
                  </p>
                </Link>
                <p className="text-brand-pink text-sm font-bold">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center gap-1.5 border border-brand-pink text-brand-pink text-[10px] font-bold uppercase tracking-widest px-3 py-2 hover:bg-brand-pink hover:text-white transition-all"
                  aria-label="Add to bag"
                >
                  <ShoppingBag size={11} />
                  Add to Bag
                </button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-text-muted hover:text-white transition-colors"
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-widest text-text-muted hover:text-white transition-colors"
            >
              · Continue Shopping
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
