"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Grid2X2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const tabs = [
  { href: "/",          label: "Home",     icon: Home       },
  { href: "/shop",      label: "Shop",     icon: Grid2X2    },
  { href: "/wishlist",  label: "Saved",    icon: Heart      },
  { href: "/profile",   label: "Account",  icon: User       },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, toggleCart } = useCartStore();
  const { totalItems: wishlistTotal } = useWishlistStore();
  const { data: session } = useSession();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  const cartCount = totalItems();
  const wishCount = wishlistTotal();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/8 safe-area-bottom">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const isAccountTab = tab.href === "/profile";
          const href = isAccountTab && !session?.user ? "/login" : tab.href;

          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative",
                isActive ? "text-brand-pink" : "text-text-muted"
              )}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {tab.href === "/wishlist" && wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-widest font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* Cart tab — opens drawer */}
        <button
          onClick={toggleCart}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative",
            pathname === "/cart" ? "text-brand-pink" : "text-text-muted"
          )}
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-widest font-medium">
            Cart
          </span>
        </button>
      </div>
    </nav>
  );
}
