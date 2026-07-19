import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.heroBanner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const banner = await db.heroBanner.update({ where: { id }, data: body });
  return NextResponse.json(banner);
}
