import nodemailer from "nodemailer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "THE BLACK SHEEP";
const fromEmail = process.env.EMAIL_FROM || "tbsmovement092@gmail.com";
const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || "tbsmovement092@gmail.com";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

function isEmailConfigured() {
  return !!(process.env.EMAIL_FROM && process.env.EMAIL_APP_PASSWORD);
}

// ─── Shared email wrapper ────────────────────────────────────────────────────

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!isEmailConfigured()) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${brandName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

// ─── Shared HTML helpers ─────────────────────────────────────────────────────

function emailWrapper(content: string) {
  return `
    <div style="background-color:#000;color:#fff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #222;">
      <h1 style="color:#FF1493;letter-spacing:2px;text-transform:uppercase;font-size:24px;margin-bottom:24px;text-align:center;">${brandName}</h1>
      ${content}
      <p style="color:#5A5A5A;font-size:11px;margin-top:40px;text-align:center;">
        You're receiving this because you placed an order with ${brandName}.
      </p>
    </div>
  `;
}

function ctaButton(href: string, label: string) {
  return `
    <div style="text-align:center;margin:28px 0;">
      <a href="${href}" style="background-color:#fff;color:#000;padding:12px 28px;text-decoration:none;font-weight:bold;text-transform:uppercase;letter-spacing:1px;font-size:12px;display:inline-block;">
        ${label}
      </a>
    </div>
  `;
}

type OrderItem = {
  product: { name: string };
  quantity: number;
  size: string;
  color: string;
  price: number | string;
};

function orderItemsTable(items: OrderItem[], total: number | string, currencySymbol: string) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #222;color:#ccc;font-size:13px;">${item.product.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #222;color:#ccc;font-size:13px;text-align:center;">${item.size} / ${item.color}</td>
        <td style="padding:10px 0;border-bottom:1px solid #222;color:#ccc;font-size:13px;text-align:center;">x${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #222;color:#fff;font-size:13px;text-align:right;">${currencySymbol}${Number(item.price).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr>
          <th style="text-align:left;color:#FF1493;font-size:11px;text-transform:uppercase;padding-bottom:8px;">Item</th>
          <th style="text-align:center;color:#FF1493;font-size:11px;text-transform:uppercase;padding-bottom:8px;">Variant</th>
          <th style="text-align:center;color:#FF1493;font-size:11px;text-transform:uppercase;padding-bottom:8px;">Qty</th>
          <th style="text-align:right;color:#FF1493;font-size:11px;text-transform:uppercase;padding-bottom:8px;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding-top:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;font-size:12px;">Total</td>
          <td style="padding-top:12px;font-weight:bold;font-size:14px;text-align:right;color:#FF1493;">${currencySymbol}${Number(total).toLocaleString()}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

// ─── Auth Emails ─────────────────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${siteUrl}/signup/setup-password?token=${token}`;

  if (!isEmailConfigured()) {
    console.log("=========================================");
    console.log(`[LOCAL DEV] Verification Email to: ${email}`);
    console.log(`[LOCAL DEV] Verification Link: ${confirmLink}`);
    console.log("=========================================");
    return;
  }

  await sendEmail({
    to: email,
    subject: `Verify your email - ${brandName}`,
    html: emailWrapper(`
      <p style="color:#9A9A9A;font-size:14px;margin-bottom:20px;text-align:center;">
        Welcome to the collective. Click the button below to verify your email and finish setting up your account.
      </p>
      ${ctaButton(confirmLink, "Verify Email & Create Password")}
      <p style="color:#5A5A5A;font-size:11px;margin-top:20px;text-align:center;">
        This link will expire in 1 hour. If you didn't request this, you can safely ignore it.
      </p>
    `),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${siteUrl}/reset-password?token=${token}`;

  if (!isEmailConfigured()) {
    console.log("=========================================");
    console.log(`[LOCAL DEV] Password Reset Email to: ${email}`);
    console.log(`[LOCAL DEV] Reset Link: ${resetLink}`);
    console.log("=========================================");
    return;
  }

  await sendEmail({
    to: email,
    subject: `Reset your password - ${brandName}`,
    html: emailWrapper(`
      <p style="color:#9A9A9A;font-size:14px;margin-bottom:20px;text-align:center;">
        We received a request to reset your password. Click the button below to set a new one.
      </p>
      ${ctaButton(resetLink, "Reset Password")}
      <p style="color:#5A5A5A;font-size:11px;margin-top:20px;text-align:center;">
        This link will expire in 1 hour. If you didn't request this, you can safely ignore it.
      </p>
    `),
  });
}

// ─── Order Emails ─────────────────────────────────────────────────────────────

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number | string;
  address: string;
  city: string;
  state: string;
  country: string;
};

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

/** Sent to customer when they place a new order */
export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  if (!isEmailConfigured()) {
    console.log(`[LOCAL DEV] Order confirmation email → ${order.customerEmail} | Order #${order.orderNumber}`);
    return;
  }

  await sendEmail({
    to: order.customerEmail,
    subject: `Order received #${order.orderNumber} - ${brandName}`,
    html: emailWrapper(`
      <p style="color:#9A9A9A;font-size:14px;text-align:center;">
        Hey ${order.customerName}, we've received your order and we're reviewing your payment. You'll hear from us soon!
      </p>
      <p style="color:#FF1493;font-size:13px;text-align:center;letter-spacing:2px;margin:16px 0;text-transform:uppercase;">
        Order #${order.orderNumber}
      </p>
      ${orderItemsTable(order.items, order.totalAmount, currency)}
      <div style="background:#111;padding:16px;border:1px solid #222;margin-top:16px;">
        <p style="color:#9A9A9A;font-size:12px;margin:0 0 4px;">Delivering to:</p>
        <p style="color:#fff;font-size:13px;margin:0;">${order.address}, ${order.city}, ${order.state}, ${order.country}</p>
      </div>
    `),
  });
}

/** Sent to admin when a new order comes in */
export async function sendAdminNewOrderEmail(order: OrderEmailData) {
  if (!isEmailConfigured()) {
    console.log(`[LOCAL DEV] Admin new order alert | Order #${order.orderNumber} from ${order.customerEmail}`);
    return;
  }

  const adminOrderLink = `${siteUrl}/admin/orders`;

  await sendEmail({
    to: adminEmail,
    subject: `🛍️ New Order #${order.orderNumber} — ${currency}${Number(order.totalAmount).toLocaleString()}`,
    html: emailWrapper(`
      <p style="color:#9A9A9A;font-size:14px;text-align:center;">
        A new order has just been placed.
      </p>
      <p style="color:#FF1493;font-size:13px;text-align:center;letter-spacing:2px;margin:16px 0;text-transform:uppercase;">
        Order #${order.orderNumber}
      </p>
      <div style="background:#111;padding:16px;border:1px solid #222;margin-bottom:16px;">
        <p style="color:#9A9A9A;font-size:12px;margin:0 0 4px;">Customer</p>
        <p style="color:#fff;font-size:13px;margin:0;">${order.customerName} — ${order.customerEmail}</p>
      </div>
      ${orderItemsTable(order.items, order.totalAmount, currency)}
      ${ctaButton(adminOrderLink, "View in Admin Panel")}
    `),
  });
}

/** Sent to customer when admin marks payment as confirmed */
export async function sendPaymentConfirmedEmail(order: Pick<OrderEmailData, "orderNumber" | "customerName" | "customerEmail" | "totalAmount">) {
  if (!isEmailConfigured()) {
    console.log(`[LOCAL DEV] Payment confirmed email → ${order.customerEmail} | Order #${order.orderNumber}`);
    return;
  }

  await sendEmail({
    to: order.customerEmail,
    subject: `Payment confirmed #${order.orderNumber} - ${brandName}`,
    html: emailWrapper(`
      <p style="color:#9A9A9A;font-size:14px;text-align:center;">
        Great news, ${order.customerName}! We've confirmed your payment of <strong style="color:#fff;">${currency}${Number(order.totalAmount).toLocaleString()}</strong> for order <strong style="color:#FF1493;">#${order.orderNumber}</strong>.
      </p>
      <p style="color:#9A9A9A;font-size:14px;text-align:center;margin-top:16px;">
        We're now preparing your items. We'll notify you once your order is out for delivery. 🖤
      </p>
    `),
  });
}

/** Sent to customer when admin marks order as shipped */
export async function sendOutForDeliveryEmail(order: Pick<OrderEmailData, "orderNumber" | "customerName" | "customerEmail">) {
  if (!isEmailConfigured()) {
    console.log(`[LOCAL DEV] Out for delivery email → ${order.customerEmail} | Order #${order.orderNumber}`);
    return;
  }

  await sendEmail({
    to: order.customerEmail,
    subject: `Your order is on the way! #${order.orderNumber} - ${brandName}`,
    html: emailWrapper(`
      <p style="color:#9A9A9A;font-size:14px;text-align:center;">
        Your order <strong style="color:#FF1493;">#${order.orderNumber}</strong> is out for delivery, ${order.customerName}!
      </p>
      <p style="color:#9A9A9A;font-size:14px;text-align:center;margin-top:12px;">
        Expect your package soon. Keep your phone close — our delivery team may reach out. 🖤
      </p>
    `),
  });
}
