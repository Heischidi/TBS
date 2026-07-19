"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: any;
  comparePrice?: any;
  images: string[];
  sizes: string[];
  colors: any;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  stock: number;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  coverImage?: string | null;
  description?: string | null;
}

interface Props {
  products: Product[];
  collections: Collection[];
}

export function FeaturedCollection({ products, collections }: Props) {
  return (
    <section className="section">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between section-header"
        >
          <div>
            <p className="text-brand-pink text-xs font-bold uppercase tracking-[0.4em] mb-3">
              Curated Selection
            </p>
            <h2 className="font-display text-display text-white">FEATURED</h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm uppercase tracking-widest group"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Collections Row — 2 per row, centred */}
        {collections.length > 0 && (
          <div className="grid grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/collections/${col.slug}`} className="group block">
                  <div className="relative aspect-4/5 overflow-hidden bg-surface-3 rounded-md">
                    {col.coverImage ? (
                      <Image
                        src={col.coverImage}
                        alt={col.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-3 to-brand-green/20" />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="font-display text-xl text-white tracking-wider">{col.name}</h3>
                      {col.description && (
                        <p className="text-white/60 text-xs mt-1.5">{col.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={Number(product.price)}
                comparePrice={product.comparePrice ? Number(product.comparePrice) : undefined}
                image={product.images[0] || ""}
                images={product.images}
                sizes={product.sizes}
                colors={product.colors as any}
                isNewArrival={product.isNewArrival}
                isBestSeller={product.isBestSeller}
                isTrending={product.isTrending}
                stock={product.stock}
              />
            </motion.div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-24">
              <p className="text-text-muted text-sm uppercase tracking-widest">No featured products yet</p>
              <p className="text-text-muted text-xs mt-2">Add products in the admin dashboard</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
