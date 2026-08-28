"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-44 md:pt-48 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={64} className="text-text-muted mb-6" />
        <h1 className="font-display text-4xl text-white">YOUR CART IS EMPTY</h1>
        <p className="text-text-secondary text-sm mt-3">Add some pieces to get started</p>
        <Link href="/shop" className="mt-8 bg-brand-pink text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-brand-pink/80 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-44 md:pt-48 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-white mb-10"
        >
          SHOPPING CART
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-5 p-5 bg-surface-2 border border-white/5"
                >
                  {/* Image */}
                  <div className="relative w-24 h-32 shrink-0 bg-surface-3 overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-4" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-medium hover:text-brand-pink transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-text-muted text-xs mt-0.5 uppercase tracking-wider">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-white/10">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white transition-colors hover:bg-white/5">
                          <Minus size={12} />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white transition-colors hover:bg-white/5">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-red-400 transition-colors flex items-center gap-1.5 text-xs">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={clearCart} className="text-text-muted text-xs uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1">
              <Trash2 size={12} /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-2 border border-white/5 p-6 sticky top-24">
              <h2 className="font-display text-xl tracking-wider mb-6">ORDER SUMMARY</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-white/5 mt-6 pt-6 flex justify-between">
                <span className="font-medium uppercase tracking-wider">Total</span>
                <span className="font-display text-2xl">{formatPrice(totalPrice())}</span>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full mt-6 bg-brand-pink text-white py-4 font-medium uppercase tracking-widest text-sm hover:bg-brand-pink/80 transition-colors"
                id="cart-to-checkout"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="block text-center text-text-muted text-xs mt-4 hover:text-white transition-colors uppercase tracking-wider">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
