import crypto from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { forgotPasswordSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";
import { sendBrevoEmail } from "@/lib/brevo";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  // Rate limit: 4 attempts per 15 minutes per IP
  if (!rateLimit(`forgot-password:${ip}`, 4, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many reset attempts. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Please enter a valid email address.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { email } = parsed.data;

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    // Short unified response
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "Code sent successfully",
      });
    }

    if (user.status === "deactivated" || user.status === "disabled") {
      return NextResponse.json(
        { error: "Account has been deactivated. Please contact an administrator." },
        { status: 403 }
      );
    }

    // Generate cryptographically secure token & expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.collection("passwordResets").deleteMany({ email });
    await db.collection("passwordResets").insertOne({
      email,
      tokenHash,
      createdAt: new Date(),
      expiresAt,
    });

    // Ensure TTL index exists on passwordResets
    db.collection("passwordResets")
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
      .catch(() => {});

    // Determine host URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl.replace(/\/$/, "")}/forgot-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    // Compose HTML Email using Brevo
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 3px solid #000000; border-radius: 12px; overflow: hidden; box-shadow: 5px 5px 0px 0px #000000;">
        <div style="background-color: #F37021; padding: 24px; text-align: center; border-bottom: 3px solid #000000;">
          <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
            LPU Freshman Guide
          </h1>
          <p style="margin: 6px 0 0 0; color: #000000; font-size: 12px; font-weight: 800; text-transform: uppercase;">
            Password Reset Request
          </p>
        </div>
        <div style="padding: 28px 24px; color: #121212; line-height: 1.6;">
          <p style="margin-top: 0; font-size: 15px; font-weight: 700;">
            Hello ${user.name || "Student"},
          </p>
          <p style="font-size: 14px; color: #333333;">
            We received a request to reset your password for your <strong>LPU Freshman Guide</strong> account.
          </p>
          <p style="font-size: 14px; color: #333333;">
            Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #FBBF24; color: #000000; text-decoration: none; font-size: 14px; font-weight: 900; text-transform: uppercase; padding: 14px 28px; border: 3px solid #000000; border-radius: 8px; display: inline-block; box-shadow: 3px 3px 0px 0px #000000;">
              Reset My Password →
            </a>
          </div>
          <p style="font-size: 12px; color: #666666; margin-bottom: 0;">
            If the button above does not work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #EA580C; word-break: break-all;">${resetUrl}</a>
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #E2E8F0;" />
          <p style="font-size: 11px; color: #718096; margin: 0;">
            If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
        </div>
      </div>
    `;

    await sendBrevoEmail({
      to: email,
      toName: user.name || "Student",
      subject: "Reset your LPU Freshman Guide Password",
      htmlContent,
      textContent: `Reset your LPU Freshman Guide password: ${resetUrl} (Valid for 1 hour)`,
    });

    const isDev = !process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === "your-brevo-api-key";

    return NextResponse.json({
      ok: true,
      message: isDev
        ? `Reset link created! In development mode, you can use: ${resetUrl}`
        : "If an account exists with this email, a password reset link has been sent.",
      ...(isDev ? { resetUrl } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Could not send reset email. Please try again." },
      { status: 500 }
    );
  }
}
