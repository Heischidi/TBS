"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

const badges = [
  { icon: Truck,        label: "Free Delivery"    },
  { icon: RotateCcw,   label: "Easy Returns"     },
  { icon: ShieldCheck, label: "Secure Payment"   },
  { icon: Star,        label: "Premium Quality"  },
];

export function TrustBadges() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="border-y border-white/5"
    >
      <div className="section-inner py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="hidden sm:block text-white/10 text-lg select-none mr-4">·</span>
                )}
                <Icon size={13} className="text-brand-pink shrink-0" />
                <span className="text-[11px] font-medium text-text-secondary tracking-wide uppercase">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
