"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string; slug: string; name: string; price: any; comparePrice?: any;
  images: string[]; sizes: string[]; colors: any;
  isNewArrival: boolean; isBestSeller: boolean; isTrending: boolean; stock: number;
}

export function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="section bg-surface-1">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between section-header"
        >
          <div>
            <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.4em] mb-2.5">
              Just Dropped
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-xs uppercase tracking-widest group"
          >
            See All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
          {products.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ProductCard
                id={product.id} slug={product.slug} name={product.name}
                price={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : undefined}
                image={product.images[0] || ""} images={product.images}
                sizes={product.sizes} colors={product.colors}
                isNewArrival={product.isNewArrival} isBestSeller={product.isBestSeller}
                isTrending={product.isTrending} stock={product.stock}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile: horizontal scroll — cards peeking to indicate scroll */}
        <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
          {products.slice(0, 8).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-44"
            >
              <ProductCard
                id={product.id} slug={product.slug} name={product.name}
                price={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : undefined}
                image={product.images[0] || ""} images={product.images}
                sizes={product.sizes} colors={product.colors}
                isNewArrival={product.isNewArrival} isBestSeller={product.isBestSeller}
                isTrending={product.isTrending} stock={product.stock}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
