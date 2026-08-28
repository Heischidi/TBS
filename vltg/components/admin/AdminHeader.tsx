"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, ChevronDown } from "lucide-react";

interface Props {
  user: { name?: string | null; email?: string | null };
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

export function AdminHeader({ user }: Props) {
  const initials = getInitials(user.name);
  const formattedDate = formatDate(new Date());

  return (
    <div style={{ flexShrink: 0, zIndex: 40 }}>
      {/* ── Top Announcement Bar ────────────────────────────────────────── */}
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
      >
        FREE SHIPPING on orders over ₦50,000
      </div>

      {/* ── Main Header ─────────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: "#0A0A0A",
          borderBottom: "1px solid #1F1F1F",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "16px",
          paddingRight: "20px",
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "13px", letterSpacing: "0.12em", lineHeight: 1.1 }}>
              THE BLACK SHEEP
            </span>
            <span style={{ color: "#666666", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Right Section: Date, Bell, User Profile & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* Date */}
          <span style={{ color: "#777777", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em" }}>
            {formattedDate}
          </span>

          {/* Bell Icon with pink notification badge */}
          <div style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Bell size={16} style={{ color: "#999999" }} />
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "6px",
                height: "6px",
                backgroundColor: PINK,
                borderRadius: "50%",
              }}
            />
          </div>

          {/* User info & avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#FFFFFF", fontSize: "11px", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
                {user.name || "TBSMAIN"}
              </p>
              <p style={{ color: "#666666", fontSize: "9px", margin: 0, maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email || "tbsmain@theblacksheep.com"}
              </p>
            </div>

            {/* Initials badge */}
            <div
              style={{
                backgroundColor: PINK,
                width: "32px",
                height: "32px",
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

            {/* Logout button */}
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                color: "#666666",
              }}
              title="Sign Out"
              id="admin-logout-btn"
            >
              <ChevronDown size={14} style={{ color: "#666666" }} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
