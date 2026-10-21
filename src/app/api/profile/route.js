import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { profileSchema } from "@/lib/validation";
export async function PUT(req) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = profileSchema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
  await (await getDb()).collection("studentProfiles").updateOne({ userId: s.user.id }, { $set: { ...p.data, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
  return NextResponse.json({ ok: true });
}
