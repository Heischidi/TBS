import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendPaymentConfirmedEmail } from "@/lib/mail";

const secret = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Only process charge.success
    if (event.event === "charge.success") {
      const data = event.data;
      const orderNumber = data.reference;

      // Update order status
      const updatedOrder = await db.order.update({
        where: { orderNumber },
        data: {
          status: "PAYMENT_CONFIRMED",
          paymentReference: data.id.toString(), // Paystack's transaction ID
        },
        include: { customer: true },
      });

      // Send payment confirmation email
      if (updatedOrder) {
        await sendPaymentConfirmedEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customer.name,
          customerEmail: updatedOrder.customer.email,
          totalAmount: updatedOrder.totalAmount.toNumber(),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
