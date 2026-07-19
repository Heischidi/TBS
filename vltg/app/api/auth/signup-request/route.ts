import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/mail";

const signupRequestSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid email address";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email } = parsed.data;

    // Check if the user is already registered in the DB
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Generate token and set expiry (1 hour)
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Clean up any older verification requests for this email
    await db.verificationToken.deleteMany({
      where: { email },
    });

    // Store token in DB
    await db.verificationToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Send email via Resend / Log to console if not configured
    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Verification link has been sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup request error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration request" },
      { status: 500 }
    );
  }
}
