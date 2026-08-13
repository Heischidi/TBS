"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Image as ImageIcon, BarChart2, Layers, AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Brand phrases — replace with your actual TBS phrases ────────────────────
const BRAND_PHRASES = [
  "THE SHEEP DON'T KNOW.",
  "NOT FOR EVERYONE.",
  "WEAR YOUR IDEOLOGY.",
  "BLACK IS A LIFESTYLE.",
  "THE MOVEMENT NEVER STOPS.",
  "DRESS LIKE YOU MEAN IT.",
  "BUILT FOR THE OUTLIERS.",
  "SILENCE IS A STATEMENT.",
];

const navItems = [
  { href: "/admin/dashboard",   icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products",    icon: Package,         label: "Products" },
  { href: "/admin/orders",      icon: ShoppingCart,    label: "Orders" },
  { href: "/admin/customers",   icon: Users,           label: "Customers" },
  { href: "/admin/collections", icon: Layers,          label: "Collections" },
  { href: "/admin/content",     icon: ImageIcon,       label: "Content / CMS" },
  { href: "/admin/gallery",     icon: ImageIcon,       label: "Gallery" },
  { href: "/admin/inventory",   icon: AlertTriangle,   label: "Inventory" },
  { href: "/admin/analytics",   icon: BarChart2,       label: "Analytics" },
];

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    setPhrase(BRAND_PHRASES[Math.floor(Math.random() * BRAND_PHRASES.length)]);
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-52 bg-surface-2 border-r border-white/5 shrink-0">
      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-all relative",
                active
                  ? "text-white bg-white/5"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              {/* Active pink left border */}
              {active && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-pink" />
              )}
              <Icon
                size={14}
                className={active ? "text-brand-pink" : "text-current opacity-50"}
              />
              <span className={cn("text-xs", active && "text-brand-pink font-medium")}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5 space-y-3">
        {/* Rotating phrase */}
        {phrase && (
          <p className="text-brand-pink text-[8px] tracking-[0.2em] uppercase opacity-60 leading-relaxed">
            {phrase}
          </p>
        )}
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-text-muted text-[10px] uppercase tracking-widest hover:text-white transition-colors"
        >
          <ExternalLink size={10} />
          View Store
        </a>
        <div>
          <p className="text-text-muted text-[9px] uppercase tracking-widest">Logged in as</p>
          <p className="text-white text-xs font-medium truncate mt-0.5">{user.name || "Admin"}</p>
        </div>
      </div>
    </aside>
  );
}
