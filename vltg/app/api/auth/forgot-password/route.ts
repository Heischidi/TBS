import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid email address";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email } = parsed.data;

    // Check if the user exists in the database
    const user = await db.user.findUnique({
      where: { email },
    });

    // If the user doesn't exist, return success to prevent email enumeration (harvesting)
    if (!user) {
      return NextResponse.json(
        { message: "If this email is registered, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate token and set expiry (1 hour)
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Clean up any older password reset requests for this email
    await db.passwordResetToken.deleteMany({
      where: { email },
    });

    // Store token in DB
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Send email via Resend / Log to console if not configured
    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      { message: "If this email is registered, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error during password reset request" },
      { status: 500 }
    );
  }
}
