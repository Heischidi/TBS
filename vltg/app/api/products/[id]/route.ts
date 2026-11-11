import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidateStorefront } from "@/lib/revalidate";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Try by ID first, then by slug
    const product = await db.product.findFirst({
      where: { OR: [{ id }, { slug: id }], isPublished: true },
      include: { category: true, collection: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, price, comparePrice, images, sizes, colors, stock, categoryId, collectionId, isNewArrival, isFeatured, isBestSeller, isTrending, isPublished } = body;

    const product = await db.product.update({
      where: { id },
      data: { name, slug, description, price: parseFloat(price), comparePrice: comparePrice ? parseFloat(comparePrice) : null, images: images || [], sizes: sizes || [], colors: colors || [], stock: parseInt(stock) || 0, categoryId, collectionId: collectionId || null, isNewArrival: !!isNewArrival, isFeatured: !!isFeatured, isBestSeller: !!isBestSeller, isTrending: !!isTrending, isPublished: isPublished !== false },
    });
    revalidateStorefront();
    return NextResponse.json(product);
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;

    await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        select: { id: true, name: true, images: true },
      });
      if (!product) {
        throw Object.assign(new Error("Product not found"), { code: "P2025" });
      }

      // Preserve item details on any existing orders before unlinking productId.
      await tx.orderItem.updateMany({
        where: { productId: id },
        data: {
          productName: product.name,
          productImage: product.images[0] ?? null,
        },
      });

      await tx.product.delete({ where: { id } });
    });

    revalidateStorefront();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
