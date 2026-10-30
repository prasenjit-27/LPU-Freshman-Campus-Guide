import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { resetPasswordSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`reset-password:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again after 15 minutes." },
      { status: 429 }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid inputs provided.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const db = await getDb();
    const record = await db.collection("passwordResets").findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const updateResult = await db.collection("users").updateOne(
      { email: record.email },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "Account could not be found." },
        { status: 404 }
      );
    }

    // Invalidate all tokens for this email once used
    await db.collection("passwordResets").deleteMany({ email: record.email });

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json(
      { error: "Server error occurred while resetting password." },
      { status: 500 }
    );
  }
}

