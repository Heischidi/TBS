"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Image as ImageIcon, BarChart2, Layers, AlertTriangle,
  ExternalLink, Newspaper,
} from "lucide-react";

const PINK = "#FF1493";

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
  { href: "/admin/content",     icon: Newspaper,       label: "Content / CMS" },
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
    <aside
      style={{ width: "13rem", backgroundColor: "#111111", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", flexShrink: 0 }}
      className="hidden md:flex"
    >
      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.5rem", overflowY: "auto" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 0.75rem",
                fontSize: 13,
                textDecoration: "none",
                transition: "all 0.15s ease",
                borderLeft: active ? `2px solid ${PINK}` : "2px solid transparent",
                backgroundColor: active ? "rgba(255,20,147,0.08)" : "transparent",
                color: active ? PINK : "#9A9A9A",
                fontWeight: active ? 500 : 400,
              }}
              className="hover:text-white hover:bg-white/5"
            >
              <Icon size={14} style={{ color: active ? PINK : "#5A5A5A", flexShrink: 0 }} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {phrase && (
          <p style={{ color: PINK, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.75rem", lineHeight: 1.6 }}>
            {phrase}
          </p>
        )}
        <a
          href="/"
          target="_blank"
          style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "#5A5A5A", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", marginBottom: "0.75rem" }}
          className="hover:text-white transition-colors"
        >
          <ExternalLink size={10} />
          View Store
        </a>
        <div>
          <p style={{ color: "#5A5A5A", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em" }}>Logged in as</p>
          <p style={{ color: "#fff", fontSize: 12, fontWeight: 500, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name || "Admin"}
          </p>
        </div>
      </div>
    </aside>
  );
}
