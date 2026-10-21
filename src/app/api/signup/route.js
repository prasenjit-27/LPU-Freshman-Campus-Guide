import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { signupSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";
export async function POST(req) {
  if (!rateLimit(`signup:${req.headers.get("x-forwarded-for") || "local"}`, 5)) return NextResponse.json({ error: "Too many attempts. Try again soon." }, { status: 429 });
  const parsed = signupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a name, valid email and a password of 8+ characters." }, { status: 400 });
  const { name, email, password } = parsed.data;
  try {
    const users = (await getDb()).collection("users");
    await users.createIndex({ email: 1 }, { unique: true });
    await users.insertOne({ name, email, passwordHash: await bcrypt.hash(password, 12), role: "student", createdAt: new Date() });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e?.code === 11000) return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    return NextResponse.json({ error: "Server error. Check database configuration." }, { status: 500 });
  }
}
