import { NextResponse } from "next/server";
import { z } from "zod";
import { sendB2BEnquiryEmails } from "@/lib/mail";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: z.string().trim().min(2, "Please enter your company or brand").max(150),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more").max(4000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().optional(),
});

// Best-effort per-IP limiter. On serverless this is per-instance, so it only
// blunts bursts; the honeypot and validation do the rest.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "Invalid enquiry";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  // Honeypot tripped: pretend success so bots learn nothing.
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const { name, company, email, phone, country, message } = parsed.data;
  const result = await sendB2BEnquiryEmails({ name, company, email, phone, country, message });

  if (result === "sent") {
    return NextResponse.json({ success: true });
  }

  // Outside production an unconfigured mailer just logs the enquiry.
  if (result === "not-configured" && process.env.NODE_ENV !== "production") {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "We couldn't send your enquiry right now. Please try again or email us directly." },
    { status: 503 }
  );
}

