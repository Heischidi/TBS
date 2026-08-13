import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (status) where.status = status;
    if (search) where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
    ];

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: { customer: true, items: { include: { product: { select: { name: true, images: true } } } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const body = await request.json();
    const { name, email, phone, address, city, state, country, items, notes } = body;

    if (!name || !email || !address || !city || !state || !country || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert customer and link to logged-in user if session is active
    const customer = await db.customer.upsert({
      where: { email },
      update: { 
        name, 
        phone, 
        ...(userId ? { userId } : {})
      },
      create: { 
        name, 
        email, 
        phone, 
        ...(userId ? { userId } : {})
      },
    });

    // Calculate total
    const total = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        totalAmount: total,
        address, city, state, country,
        notes: notes || null,
        status: "PENDING_PAYMENT",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
        },
      },
      include: {
        customer: true,
        items: { include: { product: { select: { name: true } } } },
      },
    });

    // Fire emails after order is created
    const emailData = {
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toNumber(),
      })),
      totalAmount: order.totalAmount.toNumber(),
      address: order.address,
      city: order.city,
      state: order.state,
      country: order.country,
    };
    await Promise.all([
      sendOrderConfirmationEmail(emailData),
      sendAdminNewOrderEmail(emailData),
    ]);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
