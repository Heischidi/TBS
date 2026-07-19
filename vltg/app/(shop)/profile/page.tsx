import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileClient } from "./ProfileClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | TBS Store",
  description: "Manage your personal details and view your order history.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user, their customer profile, and their order history
  const user: any = await (db.user as any).findUnique({
    where: { id: session.user.id },
    include: {
      customer: {
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      name: true,
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Ensure that customer record exists (fallback if somehow not created on register)
  if (!user.customer) {
    const customer = await (db.customer as any).create({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    });
    (user as any).customer = {
      orders: [],
      ...customer,
    };
  }

  // Serialize orders for client-side consumption
  const serializedUser = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    customer: user.customer
      ? {
          phone: user.customer.phone,
          orders: user.customer.orders.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: order.totalAmount.toString(),
            address: order.address,
            city: order.city,
            state: order.state,
            country: order.country,
            notes: order.notes,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item: any) => ({
              id: item.id,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.price.toString(),
              product: {
                name: item.product.name,
                images: item.product.images,
              },
            })),
          })),
        }
      : null,
  };

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ProfileClient user={serializedUser} />
      </div>
    </div>
  );
}
