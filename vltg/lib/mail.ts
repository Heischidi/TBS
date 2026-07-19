import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "temp");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "THE BLACK SHEEP";
const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${siteUrl}/signup/setup-password?token=${token}`;

  // If Resend API key is not configured, log to console for easy testing/local dev
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "temp") {
    console.log("=========================================");
    console.log(`[LOCAL DEV] Verification Email to: ${email}`);
    console.log(`[LOCAL DEV] Verification Link: ${confirmLink}`);
    console.log("=========================================");
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Verify your email - ${brandName}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center; border: 1px solid #222; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF1493; letter-spacing: 2px; text-transform: uppercase; font-size: 24px; margin-bottom: 20px;">${brandName}</h1>
          <p style="color: #9A9A9A; font-size: 14px; margin-bottom: 30px;">
            Welcome to the collective. Click the button below to verify your email and finish setting up your account.
          </p>
          <a href="${confirmLink}" style="background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; display: inline-block;">
            Verify Email & Create Password
          </a>
          <p style="color: #5A5A5A; font-size: 11px; margin-top: 40px;">
            This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Could not send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${siteUrl}/reset-password?token=${token}`;

  // If Resend API key is not configured, log to console for easy testing/local dev
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "temp") {
    console.log("=========================================");
    console.log(`[LOCAL DEV] Password Reset Email to: ${email}`);
    console.log(`[LOCAL DEV] Reset Link: ${resetLink}`);
    console.log("=========================================");
    return;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Reset your password - ${brandName}`,
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-align: center; border: 1px solid #222; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF1493; letter-spacing: 2px; text-transform: uppercase; font-size: 24px; margin-bottom: 20px;">${brandName}</h1>
          <p style="color: #9A9A9A; font-size: 14px; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <a href="${resetLink}" style="background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; display: inline-block;">
            Reset Password
          </a>
          <p style="color: #5A5A5A; font-size: 11px; margin-top: 40px;">
            This link will expire in 1 hour. If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Could not send password reset email");
  }
}
