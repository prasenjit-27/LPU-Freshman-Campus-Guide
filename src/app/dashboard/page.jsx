import Link from "next/link";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, safeFind } from "@/lib/mongodb";
import { tasks } from "@/data/tasks";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  let n = 0, profile = null, saved = [];
  try {
    const db = await getDb();
    n = await db.collection("userTaskProgress").countDocuments({ userId: s.user.id, done: true });
    profile = await db.collection("studentProfiles").findOne({ userId: s.user.id });
    const ids = (await db.collection("savedLocations").find({ userId: s.user.id }).toArray()).map((r) => r.locationId).filter(ObjectId.isValid).map((i) => new ObjectId(i));
    if (ids.length) saved = await db.collection("campusLocations").find({ _id: { $in: ids } }).toArray();
  } catch {}
  const keys = ["programme", "school", "year", "accommodation", "interests"];
  const pct = Math.round((keys.filter((k) => profile?.[k]).length / keys.length) * 100);
  const [ann, ev] = await Promise.all([safeFind("announcements", {}, 3), safeFind("events", { startsAt: { $gte: new Date() } }, 3)]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {s.user.name}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><h2 className="font-semibold">Profile</h2><p>{pct}% complete</p><Link className="text-sm underline" href="/settings">Edit profile</Link></div>
        <div className="card"><h2 className="font-semibold">First 15 days</h2><p>{n} of {tasks.length} done</p><Link className="text-sm underline" href="/freshmen-guide">Continue</Link></div>
        <div className="card"><h2 className="font-semibold">Saved locations</h2>{saved.length ? <ul className="text-sm">{saved.map((l) => <li key={String(l._id)}>{l.name}</li>)}</ul> : <p className="text-sm">None yet. Save places from the <Link className="underline" href="/campus-map">map</Link>.</p>}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><h2 className="font-semibold">Announcements</h2>{ann.length ? ann.map((a) => <p key={a._id} className="text-sm">{a.title}</p>) : <p className="text-sm">None yet.</p>}</div>
        <div className="card"><h2 className="font-semibold">Upcoming events</h2>{ev.length ? ev.map((e) => <p key={e._id} className="text-sm">{e.name}</p>) : <p className="text-sm">None listed.</p>}</div>
      </div>
      <div className="card text-sm">Attendance, grades, fees and timetables live only in official LPU systems and are never shown here. <Link className="underline" href="/safety">Safety resources</Link></div>
    </div>
  );
}
