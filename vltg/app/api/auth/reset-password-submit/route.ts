import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSubmitSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSubmitSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { token, password } = parsed.data;

    // Check if token exists in DB
    const resetRequest = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRequest) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (resetRequest.expiresAt < new Date()) {
      // Clean up expired token
      await db.passwordResetToken.delete({
        where: { id: resetRequest.id },
      });
      return NextResponse.json(
        { error: "Password reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const email = resetRequest.email;

    // Verify user actually exists in the database
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Clean up token since user doesn't exist
      await db.passwordResetToken.delete({
        where: { id: resetRequest.id },
      });
      return NextResponse.json(
        { error: "No user found with this email address" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clean up the reset token in a transaction
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { email },
        data: {
          password: hashedPassword,
        },
      });

      await tx.passwordResetToken.delete({
        where: { id: resetRequest.id },
      });
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password submit error:", error);
    return NextResponse.json(
      { error: "Internal server error during password reset" },
      { status: 500 }
    );
  }
}
