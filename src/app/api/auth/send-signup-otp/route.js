import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requestSignupOtpSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";
import { sendBrevoEmail } from "@/lib/brevo";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  // Rate limit: 5 requests per 10 minutes per IP
  if (!rateLimit(`signup-otp:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many OTP requests. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = requestSignupOtpSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid registration details.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const db = await getDb();
    const users = db.collection("users");

    // Check if account already exists
    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const passwordHash = await bcrypt.hash(password, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save pending registration in pendingSignups collection
    const pendingCol = db.collection("pendingSignups");
    await pendingCol.deleteMany({ email: normalizedEmail });
    await pendingCol.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      otpHash,
      createdAt: new Date(),
      expiresAt,
    });

    // Ensure TTL index so expired pending registrations are automatically purged
    pendingCol.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});

    // Send OTP via Brevo
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 3px solid #000000; border-radius: 12px; overflow: hidden; box-shadow: 5px 5px 0px 0px #000000;">
        <div style="background-color: #F37021; padding: 24px; text-align: center; border-bottom: 3px solid #000000;">
          <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
            LPU Freshman Guide
          </h1>
          <p style="margin: 6px 0 0 0; color: #000000; font-size: 12px; font-weight: 800; text-transform: uppercase;">
            Student Verification Code
          </p>
        </div>
        <div style="padding: 28px 24px; color: #121212; line-height: 1.6;">
          <p style="margin-top: 0; font-size: 15px; font-weight: 700;">
            Welcome, ${name}!
          </p>
          <p style="font-size: 14px; color: #333333;">
            To complete your registration on the <strong>LPU Freshman Guide</strong> portal, please use the 6-digit verification code below:
          </p>
          <div style="margin: 28px 0; text-align: center;">
            <div style="display: inline-block; background-color: #FEF3C7; color: #000000; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 14px 28px; border: 3px solid #000000; border-radius: 8px; box-shadow: 3px 3px 0px 0px #000000;">
              ${otp}
            </div>
          </div>
          <p style="font-size: 13px; color: #4B5563; text-align: center;">
            This code will expire in <strong>10 minutes</strong>.
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #E2E8F0;" />
          <p style="font-size: 11px; color: #718096; margin: 0;">
            If you did not initiate this account creation, please ignore this email.
          </p>
        </div>
      </div>
    `;

    await sendBrevoEmail({
      to: normalizedEmail,
      toName: name,
      subject: `Your Verification Code: ${otp} - LPU Freshman Guide`,
      htmlContent,
      textContent: `Your LPU Freshman Guide verification code is: ${otp}. It expires in 10 minutes.`,
    });

    return NextResponse.json({
      ok: true,
      message: "A 6-digit verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Signup OTP error:", error);
    return NextResponse.json(
      { error: "Could not send verification email. Please check the email address and try again." },
      { status: 500 }
    );
  }
}

