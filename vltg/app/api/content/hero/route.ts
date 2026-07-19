import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const banner = await db.heroBanner.create({ data: body });
  return NextResponse.json(banner, { status: 201 });
}

export async function GET() {
  const banners = await db.heroBanner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(banners);
}
