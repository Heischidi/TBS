"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FlashProduct {
  id: string; slug: string; name: string;
  price: number; comparePrice?: number;
  image: string; stock?: number;
}

function useCountdown(endHours = 5) {
  const [time, setTime] = useState({ h: endHours, m: 59, s: 59 });
  useEffect(() => {
    let total = endHours * 3600 + 59 * 60 + 59;
    const t = setInterval(() => {
      total = Math.max(0, total - 1);
      setTime({ h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 });
    }, 1000);
    return () => clearInterval(t);
  }, [endHours]);
  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

const DEMO_FLASH: FlashProduct[] = [
  { id: "f1", slug: "signature-oversized-tee",   name: "Signature Oversized Tee",  price: 13000, comparePrice: 18500, image: "/images/tbs-col-1.jpg", stock: 6  },
  { id: "f2", slug: "heavyweight-fleece-hoodie", name: "Fleece Hoodie",            price: 26500, comparePrice: 38000, image: "/images/tbs-col-2.jpg", stock: 3  },
  { id: "f3", slug: "tactical-cargo-pants",      name: "Tactical Cargo Pants",     price: 21000, comparePrice: 32000, image: "/images/tbs-col-3.jpg", stock: 9  },
  { id: "f4", slug: "tbs-trucker-cap",           name: "TBS Arch Trucker Cap",     price: 7500,  comparePrice: 12000, image: "/images/tbs-hero-1.jpg", stock: 14 },
  { id: "f5", slug: "signature-oversized-tee",   name: "Washed Graphic Tee",       price: 11000, comparePrice: 16000, image: "/images/tbs-hero-2.jpg", stock: 5  },
  { id: "f6", slug: "heavyweight-fleece-hoodie", name: "Zip-Up Hoodie",            price: 29000, comparePrice: 42000, image: "/images/tbs-col-1.jpg", stock: 2  },
];

function calcDiscount(price: number, compare: number) {
  return Math.round((1 - price / compare) * 100);
}

export function FlashSale({ products }: { products?: FlashProduct[] }) {
  const time = useCountdown(5);
  const items = products && products.length > 0 ? products : DEMO_FLASH;

  return (
    <section className="flash-sale-bg section" id="flash-sale">
      <div className="section-inner">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 section-header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-pink/15 border border-brand-pink/30">
              <Zap size={20} className="text-brand-pink fill-brand-pink" />
            </div>
            <div>
              <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em]">Limited Time</p>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">FLASH SALE</h2>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <span className="text-text-muted text-xs uppercase tracking-widest hidden sm:block mr-2">Ends in</span>
            <div className="countdown-unit"><span className="countdown-digit">{pad(time.h)}</span><span className="countdown-label">hr</span></div>
            <span className="countdown-separator">:</span>
            <div className="countdown-unit"><span className="countdown-digit">{pad(time.m)}</span><span className="countdown-label">min</span></div>
            <span className="countdown-separator">:</span>
            <div className="countdown-unit"><span className="countdown-digit">{pad(time.s)}</span><span className="countdown-label">sec</span></div>
          </motion.div>
        </div>

        {/* Horizontal product strip */}
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
          {items.map((product, i) => {
            const discount = product.comparePrice ? calcDiscount(product.price, product.comparePrice) : 0;
            const lowStock = (product.stock ?? 99) <= 5;
            return (
              <motion.div
                key={product.id + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex-shrink-0 w-44 md:w-52 group"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-3/4 overflow-hidden bg-surface-3 rounded-md mb-3">
                    {product.image ? (
                      <Image
                        src={product.image} alt={product.name} fill
                        sizes="(max-width: 640px) 176px, 208px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-3" />
                    )}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 sale-badge-red">-{discount}%</span>
                    )}
                    {lowStock && product.stock !== undefined && product.stock > 0 && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-black/80 rounded-sm px-2.5 py-1.5">
                          <div className="flex justify-between text-[9px] text-text-secondary mb-1.5">
                            <span>Stock</span>
                            <span className="text-brand-pink font-bold">Only {product.stock} left!</span>
                          </div>
                          <div className="free-ship-bar">
                            <div className="free-ship-fill" style={{ width: `${Math.min(100, ((product.stock ?? 0) / 20) * 100)}%`, background: "linear-gradient(90deg, #CC0000, #FF1493)" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-text-primary group-hover:text-brand-pink transition-colors line-clamp-2 leading-tight mb-1.5">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-brand-pink">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-[11px] text-text-muted line-through">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/best-sellers"
            className="inline-flex items-center gap-2.5 border border-brand-pink/40 text-brand-pink hover:bg-brand-pink hover:text-white px-10 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-sm"
            id="flash-sale-view-all"
          >
            View All Deals
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
