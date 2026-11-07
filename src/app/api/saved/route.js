import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  const rows = await db.collection("savedLocations").find({ userId: s.user.id }).toArray();
  return NextResponse.json({ ids: rows.map((r) => String(r.locationId)) });
}

export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) || {};
  const locationId = body.locationId ? String(body.locationId).trim() : "";
  if (!locationId) {
    return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
  }

  const db = await getDb();
  const col = db.collection("savedLocations");
  const q = { userId: s.user.id, locationId };
  const had = await col.findOne(q);
  if (had) {
    await col.deleteOne(q);
  } else {
    await col.insertOne({ ...q, createdAt: new Date() });
  }
  return NextResponse.json({ ok: true, saved: !had, locationId });
}
