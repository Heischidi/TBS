"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminUser {
  name?: string | null;
  email?: string | null;
  role?: string;
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const mobileMenuOpen = openForPath === pathname;

  return (
    <div className="flex flex-col h-dvh bg-surface-1 overflow-hidden">
      <AdminHeader
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() =>
          setOpenForPath((current) => (current === pathname ? null : pathname))
        }
      />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <AdminSidebar
          user={user}
          mobileOpen={mobileMenuOpen}
          onClose={() => setOpenForPath(null)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

