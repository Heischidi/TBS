"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Flame } from "lucide-react";

interface Product {
  id: string; slug: string; name: string; price: any;
  images: string[]; isTrending: boolean;
}

export function TrendingSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const [main, ...rest] = products;

  return (
    <section className="section bg-surface-1">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 section-header"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-pink/10 border border-brand-pink/25">
            <Flame size={18} className="text-brand-pink" />
          </div>
          <div>
            <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em]">Right Now</p>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">TRENDING</h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Main hero product */}
          {main && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative aspect-3/4 overflow-hidden bg-surface-3 rounded-md"
            >
              <Link href={`/products/${main.slug}`}>
                {main.images[0] ? (
                  <Image
                    src={main.images[0]} alt={main.name} fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-surface-3 to-black" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="inline-block bg-brand-pink text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-3">#1 Trending</span>
                  <h3 className="font-display text-4xl text-white">{main.name}</h3>
                  <p className="text-text-secondary mt-2 text-base">{formatPrice(Number(main.price))}</p>
                  <span className="inline-block mt-4 text-xs uppercase tracking-widest text-white/60 border-b border-white/20 group-hover:border-brand-pink group-hover:text-brand-pink transition-colors pb-0.5">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side products */}
          <div className="flex flex-col gap-5">
            {rest.slice(0, 3).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden bg-surface-3 rounded-md flex-1"
              >
                <Link href={`/products/${product.slug}`} className="flex h-full min-h-30">
                  <div className="relative w-28 overflow-hidden shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]} alt={product.name} fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-4" />
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-center">
                    <span className="text-brand-pink text-[10px] font-bold uppercase tracking-wider">Trending #{i + 2}</span>
                    <h3 className="font-medium text-white mt-1.5 group-hover:text-brand-pink transition-colors text-sm leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-text-secondary text-sm mt-2 font-medium">{formatPrice(Number(product.price))}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
