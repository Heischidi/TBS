"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Image as ImageIcon,
  BarChart2, Layers, AlertTriangle, Settings, ExternalLink, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/collections", icon: Layers, label: "Collections" },
  { href: "/admin/content", icon: ImageIcon, label: "Content / CMS" },
  { href: "/admin/inventory", icon: AlertTriangle, label: "Inventory" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
];

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-surface-2 border-r border-white/5 shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/admin/dashboard">
          <span className="font-display text-2xl text-white tracking-widest">TBS</span>
        </Link>
        <p className="text-text-muted text-[9px] uppercase tracking-[0.3em] mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all group",
                active
                  ? "admin-nav-active font-medium"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={15} className={active ? "text-brand-pink" : "text-current"} />
              <span>{label}</span>
              {active && <ChevronRight size={12} className="ml-auto text-brand-pink" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-text-muted text-xs hover:text-white transition-colors"
        >
          <ExternalLink size={12} />
          View Store
        </a>
        <div className="mt-3">
          <p className="text-white text-xs font-medium truncate">{user.name || "Admin"}</p>
          <p className="text-text-muted text-[10px] truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}
