"use client";

import { signOut } from "next-auth/react";
import { LogOut, Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  user: { name?: string | null; email?: string | null };
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="h-14 bg-surface-2 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      <p className="text-text-secondary text-xs uppercase tracking-widest">
        {formatDate(new Date())}
      </p>
      <div className="flex items-center gap-4">
        <button className="text-text-secondary hover:text-white transition-colors" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-white">{user.name || "Admin"}</p>
          <p className="text-[10px] text-text-muted">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-1.5 text-text-muted hover:text-white text-xs uppercase tracking-widest transition-colors border border-white/5 px-3 py-1.5 hover:border-white/20"
          id="admin-logout-btn"
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>
    </header>
  );
}
