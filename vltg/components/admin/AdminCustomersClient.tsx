"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Edit, Eye, Loader2, Search, Trash2, Users, X, ExternalLink } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  ordersCount: number;
  userRole: string | null;
  createdAt: string;
}

interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
}

const PINK = "#6B7C3A";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING_PAYMENT:   { label: "Pending",    className: "status-pending" },
  PAYMENT_CONFIRMED: { label: "Confirmed",  className: "status-confirmed" },
  PROCESSING:        { label: "Processing", className: "status-processing" },
  SHIPPED:           { label: "Shipped",    className: "status-shipped" },
  DELIVERED:         { label: "Delivered",  className: "status-delivered" },
  CANCELLED:         { label: "Cancelled",  className: "status-cancelled" },
};

function accountLabel(role: string | null): string {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "Admin";
  if (role === "CUSTOMER") return "Registered";
  return "Guest";
}

export function AdminCustomersClient({
  initialCustomers,
}: {
  initialCustomers: AdminCustomerRow[];
}) {
  const [customers, setCustomers] = useState<AdminCustomerRow[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selected, setSelected] = useState<AdminCustomerRow | null>(null);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  });

  const openCustomerModal = async (customer: AdminCustomerRow, startInEdit = false) => {
    setSelected(customer);
    setEditing(startInEdit);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
    });
    setFormError(null);
    setOrders([]);
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // Non-fatal: customer basic details remain visible even if orders fetch fails.
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeModal = () => {
    setSelected(null);
    setEditing(false);
    setFormError(null);
    setOrders([]);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch(`/api/admin/customers/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Could not update customer.");
        return;
      }
      setCustomers((prev) => prev.map((c) => (c.id === selected.id ? data : c)));
      setSelected(data);
      setEditing(false);
    } catch {
      setFormError("Connection error while updating customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (customer: AdminCustomerRow) => {
    const orderNote =
      customer.ordersCount > 0
        ? ` Their ${customer.ordersCount} existing order${customer.ordersCount === 1 ? "" : "s"} will remain in Orders history.`
        : "";
    if (!confirm(`Delete customer "${customer.name}"?${orderNote}`)) return;

    setDeletingId(customer.id);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to delete customer. Please try again.");
        return;
      }
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      if (selected?.id === customer.id) {
        closeModal();
      }
    } catch {
      alert("Failed to delete customer. Please check your connection and try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
            Customers
          </h1>
          <p style={{ color: "#666666", fontSize: "13px", margin: "4px 0 0 0" }}>
            {customers.length} total customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "300px", width: "100%" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666666" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
            aria-label="Search customers"
            style={{
              width: "100%",
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              borderRadius: "6px",
              padding: "9px 12px 9px 36px",
              color: "#FFFFFF",
              fontSize: "13px",
              outline: "none",
            }}
            id="customer-search"
          />
        </div>
      </div>

      {/* Table Box */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1F1F1F", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "620px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1F1F1F" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Name</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Phone</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Orders</th>
                <th style={{ textAlign: "left", padding: "12px 12px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Joined</th>
                <th style={{ textAlign: "right", padding: "12px 16px", color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#1C1C1E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Users size={22} style={{ color: "#555555" }} />
                    </div>
                    <p style={{ color: "#999999", fontSize: "13px", fontWeight: 600, margin: 0 }}>
                      {customers.length === 0 ? "No customers yet" : "No matching customers"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #1A1A1A" }} className="hover:bg-white/2 transition-colors">
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        type="button"
                        onClick={() => openCustomerModal(c, false)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", color: "#FFFFFF", fontWeight: 600, fontSize: "13px" }}
                        className="hover:underline"
                      >
                        {c.name}
                      </button>
                    </td>
                    <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>{c.email}</td>
                    <td style={{ padding: "12px 12px", color: "#AAAAAA", fontSize: "12px" }}>{c.phone || "—"}</td>
                    <td style={{ padding: "12px 12px" }}>
                      <span style={{ color: PINK, fontSize: "12px", fontWeight: 700 }}>{c.ordersCount}</span>
                    </td>
                    <td style={{ padding: "12px 12px", color: "#666666", fontSize: "11px" }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={() => openCustomerModal(c, false)}
                          title="Customer details"
                          aria-label={`View details for ${c.name}`}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", padding: "2px", display: "inline-flex" }}
                          className="hover:text-white transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openCustomerModal(c, true)}
                          title="Edit customer"
                          aria-label={`Edit ${c.name}`}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#999999", padding: "2px", display: "inline-flex" }}
                          className="hover:text-white transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          disabled={deletingId === c.id}
                          title="Delete customer"
                          aria-label={`Delete ${c.name}`}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#666666", padding: "2px", display: "inline-flex" }}
                          className="hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          {deletingId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details & Edit Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-modal-title"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#111111",
              border: "1px solid #1F1F1F",
              borderRadius: "10px",
              maxWidth: "540px",
              width: "100%",
              maxHeight: "90dvh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1F1F1F", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h2 id="customer-modal-title" style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 700, margin: 0 }} className="truncate">
                    {selected.name}
                  </h2>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", border: "1px solid #2A2A2D", color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {accountLabel(selected.userRole)}
                  </span>
                </div>
                <p style={{ color: "#777777", fontSize: "12px", margin: "4px 0 0 0" }} className="break-all">
                  {selected.email}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close customer details"
                style={{ background: "none", border: "none", color: "#777777", cursor: "pointer", padding: "4px", display: "inline-flex" }}
                className="hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Action Bar */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #1A1A1A", backgroundColor: "#0D0D0E", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ color: "#666666", fontSize: "11px" }}>
                Joined {new Date(selected.createdAt).toLocaleDateString()} &middot; {selected.ordersCount} order{selected.ordersCount === 1 ? "" : "s"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {!editing && (
                  <button
                    type="button"
                    id="customer-detail-edit-btn"
                    onClick={() => {
                      setForm({ name: selected.name, email: selected.email, phone: selected.phone || "" });
                      setFormError(null);
                      setEditing(true);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#161618",
                      border: "1px solid #2A2A2D",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    className="hover:border-white/30"
                  >
                    <Edit size={12} /> Edit Details
                  </button>
                )}
                <button
                  type="button"
                  id="customer-detail-delete-btn"
                  onClick={() => handleDelete(selected)}
                  disabled={deletingId === selected.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.35)",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#F87171",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  className="hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deletingId === selected.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Delete
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {editing ? (
                <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label htmlFor="edit-customer-name" style={{ display: "block", color: "#777777", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
                      Name *
                    </label>
                    <input
                      id="edit-customer-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "9px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-customer-email" style={{ display: "block", color: "#777777", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
                      Email *
                    </label>
                    <input
                      id="edit-customer-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "9px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-customer-phone" style={{ display: "block", color: "#777777", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "6px" }}>
                      Phone
                    </label>
                    <input
                      id="edit-customer-phone"
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="Optional"
                      style={{ width: "100%", backgroundColor: "#161618", border: "1px solid #222224", borderRadius: "6px", padding: "9px 12px", color: "#FFFFFF", fontSize: "13px", outline: "none" }}
                    />
                  </div>

                  {formError && (
                    <p role="alert" style={{ color: "#F87171", fontSize: "12px", margin: 0 }}>
                      {formError}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormError(null);
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #2A2A2D",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        color: "#AAAAAA",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="save-customer-btn"
                      disabled={saving}
                      style={{
                        backgroundColor: PINK,
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        color: "#000000",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: saving ? 0.6 : 1,
                      }}
                    >
                      {saving && <Loader2 size={13} className="animate-spin" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Contact Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ backgroundColor: "#161618", border: "1px solid #1F1F1F", borderRadius: "8px", padding: "14px" }}>
                    <div>
                      <p style={{ color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px 0" }}>Full Name</p>
                      <p style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600, margin: 0 }}>{selected.name}</p>
                    </div>
                    <div>
                      <p style={{ color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px 0" }}>Phone</p>
                      <p style={{ color: "#CCCCCC", fontSize: "13px", margin: 0 }}>{selected.phone || "—"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p style={{ color: "#666666", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px 0" }}>Email</p>
                      <p style={{ color: "#CCCCCC", fontSize: "13px", margin: 0 }} className="break-all">{selected.email}</p>
                    </div>
                  </div>

                  {/* Customer Order History */}
                  <div>
                    <h3 style={{ color: "#888888", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 10px 0" }}>
                      Recent Orders
                    </h3>
                    {ordersLoading ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666666", fontSize: "12px", padding: "12px 0" }}>
                        <Loader2 size={14} className="animate-spin" /> Loading orders...
                      </div>
                    ) : orders.length === 0 ? (
                      <p style={{ color: "#555555", fontSize: "12px", margin: 0 }}>No orders placed yet.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {orders.map((order) => {
                          const s = STATUS_BADGE[order.status] || { label: order.status, className: "" };
                          return (
                            <Link
                              key={order.id}
                              href={`/admin/orders/${order.id}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px",
                                backgroundColor: "#161618",
                                border: "1px solid #222224",
                                borderRadius: "6px",
                                padding: "10px 12px",
                                textDecoration: "none",
                              }}
                              className="hover:border-white/25 transition-colors"
                            >
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  <span style={{ color: PINK, fontFamily: "monospace", fontSize: "12px", fontWeight: 700 }}>
                                    #{order.orderNumber}
                                  </span>
                                  <span className={cn("text-[9px] px-2 py-0.5 border rounded-full uppercase tracking-wider", s.className)}>
                                    {s.label}
                                  </span>
                                </div>
                                <p style={{ color: "#666666", fontSize: "11px", margin: "3px 0 0 0" }}>
                                  {order.itemsCount} item{order.itemsCount === 1 ? "" : "s"} &middot; {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                <span style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600 }}>
                                  {formatPrice(order.totalAmount)}
                                </span>
                                <ExternalLink size={12} style={{ color: "#666666" }} />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
