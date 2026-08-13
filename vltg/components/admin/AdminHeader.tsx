"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  user: { name?: string | null; email?: string | null };
}

function getInitials(name?: string | null) {
  if (!name) return "AD";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminHeader({ user }: Props) {
  const initials = getInitials(user.name);

  return (
    <div className="shrink-0">
      {/* Announcement bar */}
      <div className="bg-brand-pink text-black text-center text-[10px] py-1.5 tracking-[0.2em] uppercase font-semibold">
        FREE SHIPPING on orders over ₦10,000
      </div>

      {/* Main header */}
      <header className="h-13 bg-surface-2 border-b border-white/5 flex items-center px-4 gap-4">
        {/* TBS Logo — left, same width as sidebar */}
        <div className="flex items-center gap-2.5 w-52 shrink-0">
          <div className="w-8 h-8 bg-brand-pink flex items-center justify-center shrink-0">
            <span className="text-black font-bold text-[10px] tracking-wider">TBS</span>
          </div>
          <span className="text-white text-xs font-semibold tracking-[0.2em] uppercase">
            THE BLACK SHEEP
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-[10px] uppercase tracking-widest hidden sm:block">
            {formatDate(new Date())}
          </span>

          <button className="text-text-muted hover:text-white transition-colors" aria-label="Notifications">
            <Bell size={15} />
          </button>

          {/* User avatar + info */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center shrink-0">
              <span className="text-black font-bold text-[10px]">{initials}</span>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-white text-xs font-medium leading-tight">{user.name || "Admin"}</p>
              <p className="text-text-muted text-[10px] leading-tight truncate max-w-[140px]">{user.email}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-text-muted hover:text-white transition-colors"
            aria-label="Sign out"
            id="admin-logout-btn"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>
    </div>
  );
}
