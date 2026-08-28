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

const PINK = "#6B7C3A";

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
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/admin/orders" style={{ color: "#666666", textDecoration: "none" }} className="hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
            Order #{order.orderNumber}
          </h1>
          <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* Status */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
          <h2 style={{ color: "#666666", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            Order Status
          </h2>
          <select
            value={status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={updating}
            style={{
              width: "100%",
              backgroundColor: "#161618",
              border: "1px solid #222224",
              borderRadius: "6px",
              padding: "10px 12px",
              color: "#FFFFFF",
              fontSize: "13px",
              outline: "none",
              cursor: "pointer",
            }}
            id="order-detail-status"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} style={{ backgroundColor: "#111111" }}>{o.label}</option>
            ))}
          </select>
          <div style={{ marginTop: "12px" }}>
            <span className={cn("text-[10px] px-2.5 py-1 border rounded-full uppercase tracking-wider", STATUS_CONFIG[status])}>
              {STATUS_OPTIONS.find(o => o.value === status)?.label}
            </span>
          </div>
        </div>

        {/* Customer */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
          <h2 style={{ color: "#666666", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
            Customer
          </h2>
          <p style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: 0 }}>{order.customer.name}</p>
          <p style={{ color: "#AAAAAA", fontSize: "12px", margin: "2px 0 0 0" }}>{order.customer.email}</p>
          {order.customer.phone && <p style={{ color: "#AAAAAA", fontSize: "12px", margin: "2px 0 0 0" }}>{order.customer.phone}</p>}
          <button
            onClick={handleWhatsApp}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "12px",
              color: PINK,
              fontSize: "12px",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            className="hover:underline"
          >
            <MessageSquare size={14} /> Message on WhatsApp
          </button>
        </div>
      </div>

      {/* Shipping Address */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "20px" }}>
        <h2 style={{ color: "#666666", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
          Shipping Address
        </h2>
        <p style={{ color: "#FFFFFF", fontSize: "13px", margin: 0 }}>{order.address}</p>
        <p style={{ color: "#AAAAAA", fontSize: "12px", margin: "2px 0 0 0" }}>{order.city}, {order.state}, {order.country}</p>
        {order.notes && <p style={{ color: "#666666", fontSize: "12px", marginTop: "8px", fontStyle: "italic" }}>Note: {order.notes}</p>}
      </div>

      {/* Order Items */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1F1F1F" }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Order Items
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: "16px", padding: "16px 20px", borderBottom: "1px solid #1A1A1A" }}>
              <div style={{ position: "relative", width: "56px", height: "68px", backgroundColor: "#1C1C1E", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                {item.product.images[0] && <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <Link href={`/products/${item.product.slug}`} target="_blank" style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600, textDecoration: "none" }} className="hover:underline">
                  {item.product.name}
                </Link>
                <p style={{ color: "#666666", fontSize: "11px", margin: "2px 0 0 0" }}>{item.color} / {item.size} &times; {item.quantity}</p>
                <p style={{ color: PINK, fontSize: "13px", fontWeight: 700, margin: "4px 0 0 0" }}>{formatPrice(Number(item.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1F1F1F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#666666", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Total</span>
          <span style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 700 }}>{formatPrice(Number(order.totalAmount))}</span>
        </div>
      </div>
    </div>
  );
}
