"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Info,
} from "lucide-react";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  color: string;
  price: string;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  address: string;
  city: string;
  state: string;
  country: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
    createdAt: Date | string;
    customer: {
      phone: string | null;
      orders: Order[];
    } | null;
  };
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING_PAYMENT: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400", label: "Pending Payment" },
  PAYMENT_CONFIRMED: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", label: "Confirmed" },
  PROCESSING: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", label: "Processing" },
  SHIPPED: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", label: "Shipped" },
  DELIVERED: { bg: "bg-teal-500/10 border-teal-500/20", text: "text-teal-400", label: "Delivered" },
  CANCELLED: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: "Cancelled" },
};

export function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "details">("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders = user.customer?.orders || [];
  const phone = user.customer?.phone || "Not provided";

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header card */}
      <div className="bg-surface-2 border border-white/5 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-pink via-brand-green to-brand-pink" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-display text-2xl text-white">
            {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h1 className="font-display text-2xl text-white tracking-wider">{user.name}</h1>
            <p className="text-text-muted text-xs uppercase tracking-wider mt-0.5">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs uppercase tracking-wider text-text-secondary hover:text-white hover:border-white transition-colors"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-8">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-6 py-4 font-display text-xs uppercase tracking-widest border-b-2 transition-all ${
            activeTab === "orders"
              ? "border-brand-pink text-white"
              : "border-transparent text-text-muted hover:text-white"
          }`}
        >
          <ShoppingBag size={14} />
          Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-6 py-4 font-display text-xs uppercase tracking-widest border-b-2 transition-all ${
            activeTab === "details"
              ? "border-brand-pink text-white"
              : "border-transparent text-text-muted hover:text-white"
          }`}
        >
          <User size={14} />
          Account Details
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "orders" ? (
          <motion.div
            key="orders-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {orders.length === 0 ? (
              <div className="bg-surface-2 border border-white/5 p-12 text-center">
                <ShoppingBag size={48} className="mx-auto text-text-muted mb-4 stroke-1" />
                <h3 className="font-display text-lg text-white uppercase tracking-wider mb-2">No Orders Found</h3>
                <p className="text-xs text-text-muted mb-6 uppercase tracking-wider">
                  You haven&apos;t placed any orders yet.
                </p>
                <a
                  href="/shop"
                  className="inline-block bg-white text-black px-6 py-3 font-medium uppercase tracking-widest text-xs hover:bg-white/90 transition-colors"
                >
                  Shop New Drop
                </a>
              </div>
            ) : (
              orders.map((order) => {
                const config = statusColors[order.status] || {
                  bg: "bg-white/5 border-white/10",
                  text: "text-white",
                  label: order.status,
                };
                const isOpen = expandedOrder === order.id;

                return (
                  <div key={order.id} className="bg-surface-2 border border-white/5 overflow-hidden">
                    {/* Order Summary Line */}
                    <div
                      onClick={() => toggleOrder(order.id)}
                      className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-white/1 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-display text-sm tracking-wider text-white">
                            #{order.orderNumber}
                          </span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-sm ${config.bg} ${config.text}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">
                          Placed on {formatDateTime(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-text-muted uppercase tracking-wider">Total Amount</p>
                          <p className="text-sm font-semibold text-white mt-0.5">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <button className="text-text-muted hover:text-white transition-colors">
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Order Details Accordion */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="border-t border-white/5 overflow-hidden bg-black/20"
                        >
                          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-4">
                              <h4 className="font-display text-xs uppercase tracking-wider text-text-muted mb-2">
                                Items Ordered
                              </h4>
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                  <div className="relative w-12 h-16 shrink-0 bg-surface-3 border border-white/5 overflow-hidden">
                                    {item.product.images?.[0] ? (
                                      <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <ShoppingBag size={12} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-medium text-white truncate uppercase tracking-wider">
                                      {item.product.name}
                                    </h5>
                                    <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wider">
                                      Size: {item.size} | Color: {item.color}
                                    </p>
                                    <p className="text-[10px] text-brand-pink mt-0.5">
                                      {item.quantity} × {formatPrice(item.price)}
                                    </p>
                                  </div>
                                  <p className="text-xs font-semibold text-white">
                                    {formatPrice(Number(item.price) * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Shipping Details & Info */}
                            <div className="border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 space-y-5 text-xs">
                              <div>
                                <h4 className="font-display text-[10px] uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                                  <MapPin size={11} /> Shipping Address
                                </h4>
                                <p className="text-white leading-relaxed">{order.address}</p>
                                <p className="text-text-secondary mt-0.5">
                                  {order.city}, {order.state}, {order.country}
                                </p>
                              </div>

                              {order.notes && (
                                <div>
                                  <h4 className="font-display text-[10px] uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                                    <Info size={11} /> Order Notes
                                  </h4>
                                  <p className="text-text-secondary italic leading-relaxed">
                                    &ldquo;{order.notes}&rdquo;
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="details-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-surface-2 border border-white/5 p-6">
              <h3 className="font-display text-lg text-white uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
                Personal Information
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User size={11} /> Full Name
                  </span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail size={11} /> Email Address
                  </span>
                  <span className="text-white font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone size={11} /> Phone Number
                  </span>
                  <span className="text-white font-medium">{phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-2 border border-white/5 p-6">
              <h3 className="font-display text-lg text-white uppercase tracking-wider mb-6 pb-3 border-b border-white/5">
                Membership Details
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar size={11} /> Joined On
                  </span>
                  <span className="text-white font-medium">{formatDate(user.createdAt)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShoppingBag size={11} /> Total Orders Placed
                  </span>
                  <span className="text-white font-medium">{orders.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
