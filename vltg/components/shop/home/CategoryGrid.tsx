"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shirt, Scissors, Baby, Watch, ShoppingBag, Footprints, Flame, Sparkles,
} from "lucide-react";

const categories = [
  { label: "Women",    icon: Scissors,    href: "/shop?category=women",         color: "#FF1493" },
  { label: "Men",      icon: Shirt,       href: "/shop?category=men",           color: "#0B3D2E" },
  { label: "Kids",     icon: Baby,        href: "/shop?category=kids",          color: "#800020" },
  { label: "Accessories", icon: Watch,   href: "/collections/accessories",     color: "#FF6400" },
  { label: "Shoes",    icon: Footprints,  href: "/shop?category=shoes",         color: "#7B2D8B" },
  { label: "Bags",     icon: ShoppingBag, href: "/shop?category=bags",          color: "#1A6B50" },
  { label: "Sale 🔥",  icon: Flame,       href: "/best-sellers",                color: "#CC0000" },
  { label: "New In ✨", icon: Sparkles,   href: "/new-arrivals",                color: "#FFB800" },
];

export function CategoryGrid() {
  return (
    <section className="section">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center section-header"
        >
          <p className="text-brand-pink text-[10px] font-bold uppercase tracking-[0.5em] mb-3">
            Browse by Category
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">
            SHOP BY STYLE
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <Link
                  href={cat.href}
                  className="category-tile flex flex-col items-center gap-3 group"
                  id={`category-${cat.label.toLowerCase().replace(/[^a-z]/g, "")}`}
                >
                  {/* Icon circle */}
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle, ${cat.color}20 0%, ${cat.color}06 100%)`,
                      border: `1.5px solid ${cat.color}30`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 8px ${cat.color}12`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <Icon
                      size={24}
                      style={{ color: cat.color }}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {/* Label */}
                  <span className="text-[11px] md:text-xs font-semibold text-text-secondary group-hover:text-white transition-colors text-center leading-tight">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
