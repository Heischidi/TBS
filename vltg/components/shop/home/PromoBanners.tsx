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
    accent: "#6B7C3A",
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
  // Hidden until CMS-driven promo banners are implemented
  return null;
}
