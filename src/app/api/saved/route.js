import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await (await getDb()).collection("savedLocations").find({ userId: s.user.id }).toArray();
  return NextResponse.json({ ids: rows.map((r) => r.locationId) });
}
export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { locationId } = (await req.json().catch(() => ({}))) || {};
  if (!ObjectId.isValid(locationId || "")) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const col = (await getDb()).collection("savedLocations");
  const q = { userId: s.user.id, locationId };
  const had = await col.findOne(q);
  if (had) await col.deleteOne(q); else await col.insertOne({ ...q, createdAt: new Date() });
  return NextResponse.json({ saved: !had });
}
