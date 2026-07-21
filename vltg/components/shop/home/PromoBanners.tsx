"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const banners = [
  {
    id: "promo-1",
    tag: "New Collection",
    title: "Summer\nEssentials",
    subtitle: "Lightweight pieces built for the season",
    cta: "Shop Summer",
    href: "/collections",
    image: "/images/tbs-hero-1.jpg",
    accent: "#FF1493",
  },
  {
    id: "promo-2",
    tag: "Sale — Up to 60% Off",
    title: "Flash\nDeals",
    subtitle: "Limited stock. Move fast.",
    cta: "Shop Sale",
    href: "/best-sellers",
    image: "/images/tbs-hero-2.jpg",
    accent: "#CC0000",
  },
];

export function PromoBanners() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {banners.map((banner, i) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={banner.href} className="group block">
                <div className="promo-banner relative h-64 md:h-80 rounded-md overflow-hidden">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-sm mb-4 w-fit"
                      style={{ backgroundColor: banner.accent, color: "#fff" }}
                    >
                      {banner.tag}
                    </span>
                    <h3
                      className="font-display text-4xl md:text-5xl text-white leading-none mb-3"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {banner.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-5">{banner.subtitle}</p>
                    <span
                      className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-white border-b pb-1 w-fit group-hover:gap-4 transition-all"
                      style={{ borderColor: banner.accent }}
                    >
                      {banner.cta}
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
