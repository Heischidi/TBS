"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

interface Order {
  id: string; orderNumber: string; status: string; totalAmount: any; createdAt: string;
  address: string; city: string; state: string; country: string; notes?: string | null;
  customer: { name: string; email: string; phone?: string | null };
  items: { id: string; quantity: number; size: string; color: string; price: any; product: { name: string; images: string[]; slug: string } }[];
}

const STATUS_OPTIONS = [
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_CONFIG: Record<string, string> = {
  PENDING_PAYMENT: "status-pending", PAYMENT_CONFIRMED: "status-confirmed",
  PROCESSING: "status-processing", SHIPPED: "status-shipped",
  DELIVERED: "status-delivered", CANCELLED: "status-cancelled",
};

export function AdminOrderDetailClient({ order }: { order: Order }) {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setUpdating(false);
  };

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage({
      orderNumber: order.orderNumber, customerName: order.customer.name,
      phone: order.customer.phone || "", email: order.customer.email,
      items: order.items.map((i) => ({ productName: i.product.name, size: i.size, color: i.color, quantity: i.quantity, price: Number(i.price) })),
      totalAmount: Number(order.totalAmount), address: order.address,
      city: order.city, state: order.state, country: order.country,
    });
    window.open(buildWhatsAppUrl(msg), "_blank");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-text-muted hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="font-display text-3xl text-white">ORDER #{order.orderNumber}</h1>
          <p className="text-text-muted text-sm">{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="bg-surface-2 border border-white/5 p-5 rounded-sm">
          <h2 className="font-display text-sm tracking-wider text-text-secondary mb-3">ORDER STATUS</h2>
          <select
            value={status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={updating}
            className={cn("w-full input-dark px-3 py-2 text-sm cursor-pointer")}
            id="order-detail-status"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className={cn("inline-block mt-2 text-[10px] px-2 py-0.5 border rounded-full uppercase tracking-wider", STATUS_CONFIG[status])}>
            {STATUS_OPTIONS.find(o => o.value === status)?.label}
          </span>
        </div>

        {/* Customer */}
        <div className="bg-surface-2 border border-white/5 p-5 rounded-sm">
          <h2 className="font-display text-sm tracking-wider text-text-secondary mb-3">CUSTOMER</h2>
          <p className="font-medium text-white">{order.customer.name}</p>
          <p className="text-text-secondary text-sm">{order.customer.email}</p>
          {order.customer.phone && <p className="text-text-secondary text-sm">{order.customer.phone}</p>}
          <button onClick={handleWhatsApp} className="flex items-center gap-2 mt-3 text-neon-pink text-xs hover:text-neon-pink-light transition-colors">
            <MessageSquare size={12} /> Message on WhatsApp
          </button>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-surface-2 border border-white/5 p-5 rounded-sm">
        <h2 className="font-display text-sm tracking-wider text-text-secondary mb-3">SHIPPING ADDRESS</h2>
        <p className="text-white text-sm">{order.address}</p>
        <p className="text-text-secondary text-sm">{order.city}, {order.state}, {order.country}</p>
        {order.notes && <p className="text-text-muted text-xs mt-2 italic">Note: {order.notes}</p>}
      </div>

      {/* Items */}
      <div className="bg-surface-2 border border-white/5 rounded-sm overflow-hidden">
        <h2 className="font-display text-sm tracking-wider text-text-secondary px-5 py-4 border-b border-white/5">ORDER ITEMS</h2>
        <div className="divide-y divide-white/5">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4">
              <div className="relative w-16 h-20 bg-surface-3 overflow-hidden rounded-sm shrink-0">
                {item.product.images[0] && <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.product.slug}`} target="_blank" className="font-medium text-white hover:text-brand-pink transition-colors text-sm">
                  {item.product.name}
                </Link>
                <p className="text-text-muted text-xs mt-0.5">{item.color} / {item.size} × {item.quantity}</p>
                <p className="text-brand-pink text-sm mt-1">{formatPrice(Number(item.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-text-secondary text-sm uppercase tracking-wider">Total</span>
          <span className="font-display text-2xl text-white">{formatPrice(Number(order.totalAmount))}</span>
        </div>
      </div>
    </div>
  );
}
