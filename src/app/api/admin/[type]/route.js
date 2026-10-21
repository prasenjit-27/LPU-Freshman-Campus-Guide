import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { adminSchemas } from "@/lib/validation";
import { rateLimit } from "@/lib/rate";
async function guard(params) {
  const s = await getServerSession(authOptions);
  if (s?.user?.role !== "admin") return { res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  const cfg = Object.hasOwn(adminSchemas, params.type) ? adminSchemas[params.type] : null;
  if (!cfg) return { res: NextResponse.json({ error: "Unknown type" }, { status: 404 }) };
  if (!rateLimit(`admin:${s.user.id}`, 60)) return { res: NextResponse.json({ error: "Too many requests" }, { status: 429 }) };
  return { s, cfg };
}
export async function POST(req, { params }) {
  const g = await guard(params); if (g.res) return g.res;
  const raw = await req.json().catch(() => null);
  const clean = Object.fromEntries(Object.entries(raw || {}).filter(([, v]) => v !== "" && v != null));
  const p = g.cfg.schema.safeParse(clean);
  if (!p.success) return NextResponse.json({ error: p.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  const db = await getDb(); const now = new Date();
  await db.collection(g.cfg.collection).insertOne({ ...p.data, sourceType: "manual", lastVerifiedAt: p.data.verificationStatus === "verified" ? now : null, createdAt: now, updatedAt: now });
  await db.collection("auditLogs").insertOne({ actor: g.s.user.id, action: `${params.type}.create`, at: now });
  return NextResponse.json({ ok: true }, { status: 201 });
}
export async function DELETE(req, { params }) {
  const g = await guard(params); if (g.res) return g.res;
  const id = new URL(req.url).searchParams.get("id");
  if (!ObjectId.isValid(id || "")) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const db = await getDb();
  await db.collection(g.cfg.collection).deleteOne({ _id: new ObjectId(id) });
  await db.collection("auditLogs").insertOne({ actor: g.s.user.id, action: `${params.type}.delete`, target: id, at: new Date() });
  return NextResponse.json({ ok: true });
}
