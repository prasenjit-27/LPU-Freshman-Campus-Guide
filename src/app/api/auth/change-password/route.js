import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";
import { rateLimit } from "@/lib/rate";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }).max(100),
});

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`change-password:${session.user.id}:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many password change attempts. Please try again after 15 minutes." },
      { status: 429 }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid input format.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    // Check if new password is same as current password
    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      return NextResponse.json({ error: "New password cannot be the same as current password." }, { status: 400 });
    }

    // Hash new password and update user record
    const newHash = await bcrypt.hash(newPassword, 12);
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash: newHash,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true, message: "Password updated successfully!" });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Failed to update password. Please try again." }, { status: 500 });
  }
}

