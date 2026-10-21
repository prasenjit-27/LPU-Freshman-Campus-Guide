import { safeFind } from "@/lib/mongodb";
import SourceLink from "@/components/SourceLink";
export const dynamic = "force-dynamic";
export default async function Help({ searchParams }) {
  const q = (searchParams?.q || "").toString().slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const items = await safeFind("faqs", q ? { $or: [{ question: { $regex: q, $options: "i" } }, { category: { $regex: q, $options: "i" } }] } : {});
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Help centre and FAQs</h1>
      <form className="flex gap-2"><input name="q" className="input" aria-label="Search FAQs" placeholder="Search questions or category" /><button className="btn">Search</button></form>
      {items.length === 0 && <p className="card text-sm">No FAQs yet.</p>}
      {items.map((f) => <details key={f._id} className="card"><summary className="cursor-pointer font-medium">{f.question} <span className="text-xs text-slate-500">({f.category})</span></summary><p className="mt-2 whitespace-pre-line text-sm">{f.answer}</p><SourceLink s={f} /></details>)}
    </div>
  );
}
