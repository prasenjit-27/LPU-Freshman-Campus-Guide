import Link from "next/link";
import { safeFind } from "@/lib/mongodb";
import SourceLink from "@/components/SourceLink";
export const dynamic = "force-dynamic";
export default async function Events({ searchParams }) {
  const past = searchParams?.view === "past";
  const q = (searchParams?.q || "").toString().slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const now = new Date();
  const filter = { startsAt: past ? { $lt: now } : { $gte: now }, ...(q && { name: { $regex: q, $options: "i" } }) };
  const items = (await safeFind("events", filter)).sort((a, b) => (past ? b.startsAt - a.startsAt : a.startsAt - b.startsAt));
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Events</h1>
      <div className="flex gap-3 text-sm"><Link className="underline" href="/events">Upcoming</Link><Link className="underline" href="/events?view=past">Past</Link></div>
      <form className="flex gap-2"><input name="q" className="input" aria-label="Search events" placeholder="Search events" />{past && <input type="hidden" name="view" value="past" />}<button className="btn">Search</button></form>
      {items.length === 0 && <p className="card text-sm">No {past ? "past" : "upcoming"} events listed.</p>}
      {items.map((e) => <article key={e._id} className="card"><h2 className="font-semibold">{e.name}</h2><p className="text-sm">{new Date(e.startsAt).toLocaleString("en-IN")} · {e.venue} · <Link className="underline" href={`/services?q=${encodeURIComponent(e.venue || "")}`}>find venue</Link></p><p className="text-sm text-slate-600">{e.description}</p>{e.registrationUrl && <a className="text-sm underline" href={e.registrationUrl} target="_blank" rel="noreferrer">Register</a>}<SourceLink s={e} /></article>)}
    </div>
  );
}
