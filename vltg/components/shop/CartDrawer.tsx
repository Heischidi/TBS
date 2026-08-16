"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 50000;

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = totalPrice();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  const handleCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim()) setCouponApplied(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-2 border-l border-white/5 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} className="text-brand-pink" />
                <span className="font-display text-lg tracking-wider">YOUR CART</span>
                {items.length > 0 && (
                  <span className="text-text-secondary text-sm">({items.length})</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-text-secondary hover:text-white transition-colors p-2 -mr-2"
                aria-label="Close cart"
              >
                <X size={19} />
              </button>
            </div>

            {/* Free shipping bar */}
            {items.length > 0 && (
              <div className="px-5 py-3 bg-black/30 border-b border-white/5">
                {remaining > 0 ? (
                  <p className="text-xs text-text-secondary mb-2">
                    Add{" "}
                    <span className="text-white font-semibold">{formatPrice(remaining)}</span>{" "}
                    more for{" "}
                    <span className="text-brand-pink font-semibold">FREE shipping</span>
                  </p>
                ) : (
                  <p className="text-xs text-neon-pink font-semibold mb-2">
                    🎉 You've unlocked FREE shipping!
                  </p>
                )}
                <div className="free-ship-bar">
                  <motion.div
                    className="free-ship-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-surface-3 flex items-center justify-center">
                    <ShoppingBag size={36} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-text-secondary">EMPTY CART</p>
                    <p className="text-text-muted text-sm mt-1">Add items to get started</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-2 bg-brand-pink text-white px-8 py-2.5 text-sm font-medium uppercase tracking-widest hover:bg-brand-pink/80 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 bg-surface-3 rounded-lg"
                    >
                      {/* Image */}
                      <div className="relative w-18 h-22 shrink-0 overflow-hidden rounded-md bg-surface-4" style={{ width: 72, height: 88 }}>
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-surface-4 flex items-center justify-center">
                            <ShoppingBag size={18} className="text-text-muted" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-medium text-sm hover:text-brand-pink transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-text-muted text-xs mt-0.5">
                          {item.color} · {item.size}
                        </p>
                        <p className="text-brand-pink text-sm font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center border border-white/10 text-text-secondary hover:text-white hover:border-white/30 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-text-muted hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-white/5 space-y-3">
                {/* Coupon code */}
                {!couponApplied ? (
                  <form onSubmit={handleCoupon} className="flex gap-2">
                    <div className="flex-1 flex items-center border border-white/10 bg-white/3 px-3 gap-2">
                      <Tag size={13} className="text-text-muted shrink-0" />
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Promo code"
                        className="bg-transparent text-white text-xs py-2.5 flex-1 outline-none placeholder-text-muted"
                        id="coupon-input"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-white/15 text-text-secondary hover:border-brand-pink hover:text-brand-pink transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neon-pink font-semibold">✓ Promo code applied!</span>
                    <button onClick={() => { setCouponApplied(false); setCoupon(""); }} className="text-text-muted hover:text-white">
                      Remove
                    </button>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-text-secondary text-sm uppercase tracking-wider">Subtotal</span>
                  <span className="font-display text-xl">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-text-muted text-xs">
                  {remaining > 0
                    ? `Add ${formatPrice(remaining)} for free shipping`
                    : "✓ Free shipping applied"}
                </p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-brand-pink text-white text-center py-3.5 font-semibold uppercase tracking-widest hover:bg-brand-pink/85 transition-colors text-sm"
                  id="cart-checkout-btn"
                >
                  Checkout — {formatPrice(subtotal)}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full border border-white/10 text-white text-center py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
