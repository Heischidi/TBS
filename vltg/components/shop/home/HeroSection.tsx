"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  ctaText?: string | null;
  ctaLink?: string | null;
}

// Fallback banner when DB is empty — uses local brand images
const defaultBanners: HeroBanner[] = [
  {
    id: "default-1",
    title: "NEW SEASON\nNEW RULES",
    subtitle: "Premium streetwear for those who move culture forward",
    image: "/images/tbs-hero-1.jpg",
    ctaText: "Shop Now",
    ctaLink: "/shop",
  },
  {
    id: "default-2",
    title: "LIMITED\nDROPS ONLY",
    subtitle: "Exclusive pieces. Never restocked. Always remembered.",
    image: "/images/tbs-hero-1.jpg",
    ctaText: "View Collection",
    ctaLink: "/collections",
  },
];

export function HeroSection({ banners }: { banners: HeroBanner[] }) {
  const displayBanners = banners.length > 0 ? banners : defaultBanners;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  const banner = displayBanners[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background — full-screen photo with Ken Burns zoom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {banner.image ? (
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-900 to-black" />
          )}
          {/* Multi-layer dark overlay for text legibility */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-1"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Decorative glow blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none z-2" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none z-2" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl"
            >
              {/* Pre-title badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-[2px] bg-brand-pink" />
                <p className="text-brand-pink text-xs font-bold uppercase tracking-[0.5em]">
                  SS 2025 Collection
                </p>
              </motion.div>

              {/* BRAND NAME — THE BLACK SHEEP */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-white leading-none mb-4"
                style={{
                  fontSize: "clamp(3rem, 8vw, 8rem)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                }}
              >
                THE BLACK
                <br />
                <span
                  className="relative"
                  style={{
                    WebkitTextStroke: "2px white",
                    color: "transparent",
                  }}
                >
                  SHEEP
                </span>
              </motion.h1>

              {/* Sub-headline from banner */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-white/60 text-base md:text-xl mt-4 max-w-lg leading-relaxed font-light"
              >
                {banner.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-wrap gap-4 mt-10"
              >
                <Link
                  href={banner.ctaLink || "/shop"}
                  className="bg-white text-black px-10 py-4 font-semibold uppercase tracking-widest text-sm hover:bg-brand-pink hover:text-white transition-all duration-300 hover:shadow-glow-pink"
                  id="hero-cta-primary"
                >
                  {banner.ctaText || "Shop Now"}
                </Link>
                <Link
                  href="/collections"
                  className="border border-white/40 text-white px-10 py-4 font-medium uppercase tracking-widest text-sm hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  id="hero-cta-secondary"
                >
                  View Collections
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {displayBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
}
