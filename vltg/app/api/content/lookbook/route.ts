import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const image = await db.lookbookImage.create({ data: body });
  return NextResponse.json(image, { status: 201 });
}
