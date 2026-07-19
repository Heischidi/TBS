"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

const badges = [
  { icon: Truck,        title: "Free Delivery",    subtitle: "On orders over ₦50,000"       },
  { icon: RotateCcw,   title: "Easy Returns",     subtitle: "30-day hassle-free returns"    },
  { icon: ShieldCheck, title: "Secure Payment",   subtitle: "100% protected transactions"  },
  { icon: Star,        title: "Premium Quality",  subtitle: "Curated & quality-checked"    },
];

export function TrustBadges() {
  return (
    <section className="trust-badge-strip">
      <div className="section-inner py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="trust-badge-item justify-center md:justify-start text-center md:text-left"
              >
                <div className="trust-badge-icon">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{badge.title}</p>
                  <p className="text-text-muted text-xs mt-1">{badge.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
