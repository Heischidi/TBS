"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  user: { name?: string | null; email?: string | null };
}

function getInitials(name?: string | null) {
  if (!name) return "AD";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const PINK = "#FF1493";

export function AdminHeader({ user }: Props) {
  const initials = getInitials(user.name);

  return (
    <div style={{ flexShrink: 0 }}>
      {/* ── Admin-only announcement bar ─────────────────────── */}
      <div
        style={{ backgroundColor: PINK }}
        className="text-black text-center text-[10px] py-1.5 tracking-[0.2em] uppercase font-semibold"
      >
        FREE SHIPPING on orders over ₦10,000
      </div>

      {/* ── Main header row ─────────────────────────────────── */}
      <header
        style={{ backgroundColor: "#111111", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        className="flex items-center px-4 h-12"
      >
        {/* TBS Logo — must match sidebar width exactly */}
        <div className="flex items-center gap-2.5 shrink-0" style={{ width: "13rem" }}>
          <div
            style={{ backgroundColor: PINK, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <span style={{ color: "#000", fontWeight: 700, fontSize: 10, letterSpacing: "0.1em" }}>TBS</span>
          </div>
          <span className="text-white font-semibold uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
            THE BLACK SHEEP
          </span>
        </div>

        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest hidden sm:block" style={{ color: "#5A5A5A" }}>
            {formatDate(new Date())}
          </span>

          <button className="hover:text-white transition-colors" style={{ color: "#5A5A5A" }} aria-label="Notifications">
            <Bell size={15} />
          </button>

          {/* Name + email */}
          <div className="hidden sm:block text-right">
            <p className="text-white font-medium leading-tight" style={{ fontSize: 11 }}>{user.name || "Admin"}</p>
            <p className="leading-tight truncate" style={{ fontSize: 10, color: "#5A5A5A", maxWidth: 140 }}>{user.email}</p>
          </div>

          {/* Avatar circle */}
          <div
            style={{ backgroundColor: PINK, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <span style={{ color: "#000", fontWeight: 700, fontSize: 10 }}>{initials}</span>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            style={{ color: "#5A5A5A" }}
            className="hover:text-white transition-colors"
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
