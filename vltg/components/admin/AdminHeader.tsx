"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu, X } from "lucide-react";

interface Props {
  user: { name?: string | null; email?: string | null };
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

function getInitials(name?: string | null) {
  if (!name) return "TB";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(date: Date) {
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

const PINK = "#6B7C3A";

export function AdminHeader({ user, mobileMenuOpen = false, onToggleMobileMenu }: Props) {
  const initials = getInitials(user.name);
  const formattedDate = formatDate(new Date());

  return (
    <div style={{ flexShrink: 0, zIndex: 40 }}>
      {/* Top Announcement Bar */}
      <div
        style={{
          backgroundColor: PINK,
          color: "#000",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textAlign: "center",
          padding: "4px 12px",
        }}
        className="truncate"
      >
        FREE SHIPPING on orders over ₦50,000
      </div>

      {/* Main Header */}
      <header
        style={{
          backgroundColor: "#0A0A0A",
          borderBottom: "1px solid #1F1F1F",
          height: "56px",
        }}
        className="flex items-center justify-between gap-2 px-3 sm:px-5"
      >
        {/* Left: mobile menu toggle + Brand Logo & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 -ml-1 text-white/80 hover:text-white rounded-md"
              id="admin-mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div
            style={{
              backgroundColor: PINK,
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#000", fontWeight: 800, fontSize: "11px", letterSpacing: "0.05em" }}>
              TBS
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-extrabold text-xs sm:text-[13px] tracking-[0.12em] leading-none truncate">
              THE BLACK SHEEP
            </span>
            <span className="text-[#666666] text-[9px] tracking-[0.1em] uppercase mt-0.5 truncate">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Right Section: Date, Bell, User Profile & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Date — hidden on narrow mobile */}
          <span className="hidden md:inline text-[#777777] text-[11px] font-semibold tracking-[0.08em]">
            {formattedDate}
          </span>

          {/* Bell Icon */}
          <div className="relative cursor-pointer flex items-center p-1">
            <Bell size={16} style={{ color: "#999999" }} />
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "6px",
                height: "6px",
                backgroundColor: PINK,
                borderRadius: "50%",
              }}
            />
          </div>

          {/* User info & avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden sm:block text-right">
              <p style={{ color: "#FFFFFF", fontSize: "11px", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                {user.name || "TBSMAIN"}
              </p>
              <p style={{ color: "#666666", fontSize: "9px", margin: 0, maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email || "tbsmain@theblacksheep.com"}
              </p>
            </div>

            <div
              style={{
                backgroundColor: PINK,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: 800,
                fontSize: "11px",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="p-1.5 text-[#666666] hover:text-white transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
              id="admin-logout-btn"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
