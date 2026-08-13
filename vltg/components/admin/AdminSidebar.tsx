"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  BarChart2, Layers, AlertTriangle, ExternalLink,
  ChevronDown, Image as ImageIcon, Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Brand phrases ────────────────────────────────────────────────────────────
// Replace or extend with your actual TBS phrases
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

// ── Navigation groups ────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", icon: Package, label: "Products" },
      { href: "/admin/collections", icon: Layers, label: "Collections" },
      { href: "/admin/inventory", icon: AlertTriangle, label: "Inventory" },
    ],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
      { href: "/admin/customers", icon: Users, label: "Customers" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content", icon: Newspaper, label: "CMS" },
      { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
    ],
  },
];

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [phrase, setPhrase] = useState("");

  // Pick a random phrase on mount (changes each session/reload)
  useEffect(() => {
    setPhrase(BRAND_PHRASES[Math.floor(Math.random() * BRAND_PHRASES.length)]);
  }, []);

  // Determine which groups should start open (the one containing the active route)
  const getInitialOpen = () => {
    const open: Record<string, boolean> = {};
    NAV_GROUPS.forEach((group) => {
      const hasActive = group.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      );
      open[group.label] = hasActive;
    });
    return open;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpen);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="hidden md:flex flex-col w-52 bg-surface-2 border-r border-white/5 shrink-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-white/5">
        <Link href="/admin/dashboard">
          <span className="font-display text-2xl text-white tracking-widest">TBS</span>
        </Link>
        <p className="text-text-muted text-[9px] uppercase tracking-[0.3em] mt-0.5">Admin Panel</p>
        {/* Rotating brand phrase */}
        {phrase && (
          <p className="text-brand-pink text-[9px] tracking-widest uppercase mt-3 leading-relaxed opacity-70">
            {phrase}
          </p>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {NAV_GROUPS.map((group) => {
          const isOpen = !!openGroups[group.label];
          const groupActive = group.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + "/")
          );

          return (
            <div key={group.label}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-[10px] uppercase tracking-widest transition-colors rounded-sm",
                  groupActive
                    ? "text-white"
                    : "text-text-muted hover:text-white"
                )}
              >
                <span>{group.label}</span>
                <ChevronDown
                  size={10}
                  className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "")}
                />
              </button>

              {/* Group items */}
              {isOpen && (
                <div className="ml-1 mt-0.5 space-y-0.5 border-l border-white/5 pl-2">
                  {group.items.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs transition-all",
                          active
                            ? "text-white bg-white/5 font-medium"
                            : "text-text-secondary hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Icon
                          size={13}
                          className={active ? "text-brand-pink" : "text-current opacity-60"}
                        />
                        <span>{label}</span>
                        {active && (
                          <span className="ml-auto w-1 h-1 rounded-full bg-brand-pink" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5 space-y-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-text-muted text-[10px] uppercase tracking-widest hover:text-white transition-colors"
        >
          <ExternalLink size={11} />
          View Store
        </a>
        <div>
          <p className="text-white text-xs font-medium truncate">{user.name || "Admin"}</p>
          <p className="text-text-muted text-[10px] truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}
