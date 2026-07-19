import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    // Store as setting
    const existing = await db.setting.findUnique({ where: { key: `newsletter_${email}` } });
    if (!existing) {
      await db.setting.create({ data: { key: `newsletter_${email}`, value: email } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
