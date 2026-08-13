import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPaymentConfirmedEmail, sendOutForDeliveryEmail } from "@/lib/mail";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ["PENDING_PAYMENT", "PAYMENT_CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await db.order.update({
      where: { id },
      data: { status },
      include: { customer: true },
    });

    // Send customer notification based on new status
    if (status === "PAYMENT_CONFIRMED") {
      await sendPaymentConfirmedEmail({
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        totalAmount: order.totalAmount,
      });
    }

    if (status === "SHIPPED") {
      await sendOutForDeliveryEmail({
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
      });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
