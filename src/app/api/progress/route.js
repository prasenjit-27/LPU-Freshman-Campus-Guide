import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { tasks } from "@/data/tasks";
const body = z.object({ taskId: z.string(), done: z.boolean() });
export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await (await getDb()).collection("userTaskProgress").find({ userId: s.user.id, done: true }).toArray();
  return NextResponse.json({ done: rows.map((r) => r.taskId) });
}
export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success || !tasks.some((t) => t.id === p.data.taskId)) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  await (await getDb()).collection("userTaskProgress").updateOne(
    { userId: s.user.id, taskId: p.data.taskId },
    { $set: { done: p.data.done, updatedAt: new Date() } }, { upsert: true });
  return NextResponse.json({ ok: true });
}
