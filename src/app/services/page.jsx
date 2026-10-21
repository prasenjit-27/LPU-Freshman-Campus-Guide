import { safeFind } from "@/lib/mongodb";
import SourceLink from "@/components/SourceLink";
export default async function Services({ searchParams }) {
  const q = (searchParams?.q || "").toString().slice(0, 60);
  const rx = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const items = await safeFind("campusLocations", q ? { $or: [{ name: { $regex: rx, $options: "i" } }, { category: { $regex: rx, $options: "i" } }] } : {});
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Campus directory</h1>
      <form className="flex gap-2"><input name="q" defaultValue={q} className="input" aria-label="Search" placeholder="Search by name or category" /><button className="btn">Search</button></form>
      {items.length === 0 ? <p className="card text-sm">No locations yet. An admin can add sourced locations, or run the seed script after configuring MongoDB.</p> :
        items.map((l) => <div key={l._id} className="card"><h2 className="font-semibold">{l.name}</h2><p className="text-sm text-slate-600">{l.category} — {l.description}</p><SourceLink s={l} /></div>)}
    </div>
  );
}
