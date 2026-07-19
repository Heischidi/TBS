interface OrderItem {
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface WhatsAppOrderParams {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

export function buildWhatsAppMessage(params: WhatsAppOrderParams): string {
  const symbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

  const itemsList = params.items
    .map(
      (item) =>
        `• ${item.productName} (${item.color} / ${item.size}) x${item.quantity} — ${symbol}${Number(item.price * item.quantity).toLocaleString()}`
    )
    .join("\n");

  const message = `🛍️ *NEW ORDER — #${params.orderNumber}*

👤 *Customer Details*
Name: ${params.customerName}
📞 Phone: ${params.phone}
📧 Email: ${params.email}

🛒 *ORDER ITEMS*
${itemsList}

💰 *TOTAL: ${symbol}${Number(params.totalAmount).toLocaleString()}*

📦 *SHIPPING TO*
${params.address}
${params.city}, ${params.state}
${params.country}

---
_Sent via TBS Store_`;

  return message;
}

export function buildWhatsAppUrl(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || "2348000000000";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
