"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Image as ImageIcon, BarChart2, Layers, AlertTriangle,
  ChevronLeft, Newspaper, X,
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
  mobileOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  user,
  phrase,
  onNavigate,
}: {
  user: Props["user"];
  phrase: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
                borderRadius: "6px",
                backgroundColor: active ? "rgba(107, 124, 58, 0.14)" : "transparent",
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

      <div style={{ padding: "16px 14px", borderTop: "1px solid #1F1F1F", display: "flex", flexDirection: "column", gap: "12px" }}>
        {phrase && (
          <p style={{ color: PINK, fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
            {phrase}
          </p>
        )}

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
    </>
  );
}

export function AdminSidebar({ user, mobileOpen = false, onClose }: Props) {
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    setPhrase(BRAND_PHRASES[Math.floor(Math.random() * BRAND_PHRASES.length)]);
  }, []);

  return (
    <>
      {/* Desktop persistent sidebar — note: no inline `display` so Tailwind `hidden md:flex` controls visibility */}
      <aside
        style={{
          width: "210px",
          backgroundColor: "#0A0A0A",
          borderRight: "1px solid #1F1F1F",
        }}
        className="hidden md:flex flex-col shrink-0 h-full"
      >
        <SidebarContent user={user} phrase={phrase} />
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            aria-hidden="true"
          />
          <aside
            style={{
              width: "240px",
              maxWidth: "80vw",
              backgroundColor: "#0A0A0A",
              borderRight: "1px solid #1F1F1F",
            }}
            className="relative z-10 flex flex-col h-full shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1F1F1F]">
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                Admin Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close admin menu"
                className="p-1.5 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent user={user} phrase={phrase} onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
