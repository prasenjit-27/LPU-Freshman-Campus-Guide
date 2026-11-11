import crypto from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifySignupOtpSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  // Rate limit: 8 verify attempts per 10 minutes
  if (!rateLimit(`verify-signup:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = verifySignupOtpSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid OTP code format.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { email, otp } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    const db = await getDb();
    const pendingCol = db.collection("pendingSignups");
    const usersCol = db.collection("users");

    // Locate pending signup record
    const pending = await pendingCol.findOne({
      email: normalizedEmail,
      otpHash,
      expiresAt: { $gt: new Date() },
    });

    if (!pending) {
      return NextResponse.json(
        { error: "Incorrect or expired verification code. Please check your email or request a new one." },
        { status: 400 }
      );
    }

    // Ensure unique indexes
    await usersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await usersCol.createIndex({ role: 1 }).catch(() => {});
    await usersCol.createIndex({ name: "text", email: "text" }).catch(() => {});

    const now = new Date();
    const insertResult = await usersCol.insertOne({
      name: pending.name,
      email: normalizedEmail,
      passwordHash: pending.passwordHash,
      registrationNumber: pending.registrationNumber || "",
      role: "student",
      status: "active",
      emailVerified: now,
      createdAt: now,
      updatedAt: now,
    });

    // Delete pending record
    await pendingCol.deleteMany({ email: normalizedEmail });

    return NextResponse.json(
      { ok: true, message: "Account verified and created successfully!", id: String(insertResult.insertedId) },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email address has already been verified." },
        { status: 409 }
      );
    }
    console.error("Signup OTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify account. Please try again." },
      { status: 500 }
    );
  }
}
