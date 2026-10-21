import { safeFind } from "@/lib/mongodb";
import SourceLink from "@/components/SourceLink";
export const dynamic = "force-dynamic";
export default async function Announcements() {
  const all = await safeFind("announcements", { $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }] });
  const items = all.sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Announcements</h1>
      {items.length === 0 && <p className="card text-sm">No announcements yet.</p>}
      {items.map((a) => <article key={a._id} className="card"><h2 className="font-semibold">{a.pinned && "📌 "}{a.title}</h2><p className="text-sm">{a.summary}</p>{a.content && <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{a.content}</p>}<SourceLink s={a} /></article>)}
    </div>
  );
}
