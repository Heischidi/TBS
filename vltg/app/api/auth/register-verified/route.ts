import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerVerifiedSchema = z.object({
  token: z.string().min(1, "Token is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerVerifiedSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { token, name, password } = parsed.data;

    // Check if token exists and is valid
    const verificationRequest = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationRequest) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verificationRequest.expiresAt < new Date()) {
      // Clean up expired token
      await db.verificationToken.delete({
        where: { id: verificationRequest.id },
      });
      return NextResponse.json(
        { error: "Verification link has expired. Please sign up again." },
        { status: 400 }
      );
    }

    const email = verificationRequest.email;

    // Check if the user is already registered (in case they verified twice)
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Clean up token since user is already registered
      await db.verificationToken.delete({
        where: { id: verificationRequest.id },
      });
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and associated customer record in a transaction
    await db.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "CUSTOMER",
          customer: {
            create: {
              name,
              email,
            },
          },
        } as any,
      });

      // Clean up verification token
      await tx.verificationToken.delete({
        where: { id: verificationRequest.id },
      });
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register verified error:", error);
    return NextResponse.json(
      { error: "Internal server error during account creation" },
      { status: 500 }
    );
  }
}
