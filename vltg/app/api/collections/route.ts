import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const collections = await db.collection.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(collections);
  } catch {
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, coverImage } = await request.json();
    const collection = await db.collection.create({ data: { name, slug, description, coverImage } });
    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}
