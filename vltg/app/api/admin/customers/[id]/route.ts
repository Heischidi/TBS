import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

const updateCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Customer name is required")
    .max(120, "Name must be 120 characters or less"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(160, "Email must be 160 characters or less"),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number must be 40 characters or less")
    .optional()
    .nullable(),
});

function revalidateCustomerViews() {
  revalidatePath("/admin/customers");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      user: { select: { role: true } },
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          _count: { select: { items: true } },
        },
      },
    },
  });

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    userRole: customer.user?.role ?? null,
    ordersCount: customer._count.orders,
    createdAt: customer.createdAt.toISOString(),
    orders: customer.orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      itemsCount: order._count.items,
      createdAt: order.createdAt.toISOString(),
    })),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateCustomerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid customer details" },
      { status: 400 }
    );
  }

  const { name, email } = parsed.data;
  const phone = parsed.data.phone ? parsed.data.phone : null;

  const existing = await db.customer.findUnique({
    where: { id },
    include: { user: { select: { id: true, role: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const emailConflict = await db.customer.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      NOT: { id },
    },
    select: { id: true },
  });
  if (emailConflict) {
    return NextResponse.json(
      { error: "Another customer already uses this email address" },
      { status: 409 }
    );
  }

  const syncCustomerUser =
    existing.userId != null && existing.user?.role === "CUSTOMER";
  if (syncCustomerUser && existing.userId) {
    const userConflict = await db.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        NOT: { id: existing.userId },
      },
      select: { id: true },
    });
    if (userConflict) {
      return NextResponse.json(
        { error: "Another account already uses this email address" },
        { status: 409 }
      );
    }
  }

  const updated = await db.$transaction(async (tx) => {
    const row = await tx.customer.update({
      where: { id },
      data: { name, email, phone },
      include: {
        _count: { select: { orders: true } },
        user: { select: { role: true } },
      },
    });

    if (syncCustomerUser && existing.userId) {
      await tx.user.update({
        where: { id: existing.userId },
        data: { name, email },
      });
    }

    return row;
  });

  revalidateCustomerViews();
  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    userRole: updated.user?.role ?? null,
    ordersCount: updated._count.orders,
    createdAt: updated.createdAt.toISOString(),
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const existing = await db.customer.findUnique({
    where: { id },
    include: { user: { select: { id: true, role: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  await db.$transaction(async (tx) => {
    // Snapshot contact details onto existing orders so order records remain intact.
    await tx.order.updateMany({
      where: { customerId: id },
      data: {
        customerName: existing.name,
        customerEmail: existing.email,
        customerPhone: existing.phone,
      },
    });

    await tx.customer.delete({ where: { id } });

    // Remove linked CUSTOMER login so the deleted record isn't recreated on next profile visit.
    if (existing.userId && existing.user?.role === "CUSTOMER") {
      await tx.user.delete({ where: { id: existing.userId } });
    }
  });

  revalidateCustomerViews();
  return NextResponse.json({ success: true });
}
