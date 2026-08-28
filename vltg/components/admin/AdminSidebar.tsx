"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Image as ImageIcon, BarChart2, Layers, AlertTriangle,
  ChevronLeft, Newspaper,
} from "lucide-react";

const PINK = "#6B7C3A";

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
      style={{
        width: "210px",
        backgroundColor: "#0A0A0A",
        borderRight: "1px solid #1F1F1F",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
      }}
      className="hidden md:flex"
    >
      {/* Navigation List */}
      <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
                borderRadius: "6px",
                backgroundColor: active ? "rgba(255, 20, 147, 0.12)" : "transparent",
                color: active ? PINK : "#999999",
                transition: "all 0.15s ease",
              }}
              className="hover:text-white hover:bg-white/5"
            >
              <Icon size={16} style={{ color: active ? PINK : "#777777", flexShrink: 0 }} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "16px 14px", borderTop: "1px solid #1F1F1F", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Brand phrase */}
        {phrase && (
          <p style={{ color: PINK, fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
            {phrase}
          </p>
        )}

        {/* View Store */}
        <a
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#888888",
            fontSize: "11px",
            fontWeight: 500,
            textDecoration: "none",
          }}
          className="hover:text-white transition-colors"
        >
          <ChevronLeft size={12} />
          View Store
        </a>

        {/* Logged in info box */}
        <div
          style={{
            backgroundColor: "#121212",
            border: "1px solid #1F1F1F",
            borderRadius: "6px",
            padding: "10px 12px",
          }}
        >
          <p style={{ color: "#555555", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>
            Logged in as
          </p>
          <p style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 700, margin: "2px 0 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name || "TBSMAIN"}
          </p>
        </div>
      </div>
    </aside>
  );
}
