import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { signupSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`signup:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid name (min 2 chars), valid email address, and a password of at least 8 characters." }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const db = await getDb();
    const users = db.collection("users");
    
    // Ensure unique email index
    await users.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await users.createIndex({ role: 1 }).catch(() => {});
    await users.createIndex({ name: "text", email: "text" }).catch(() => {});

    // Explicitly enforce that public signups can never set role or elevate permissions
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const insertResult = await users.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "student",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ ok: true, id: String(insertResult.insertedId) }, { status: 201 });
  } catch (e) {
    if (e?.code === 11000) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error occurred. Please check database configuration." }, { status: 500 });
  }
}
