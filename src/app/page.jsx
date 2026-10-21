import Link from "next/link";
import { sources } from "@/data/sources";
export default function Home() {
  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-3xl font-bold">LPU Freshman Guide — Your Guide to Life at LPU</h1>
        <p className="mt-2 text-slate-600">A campus directory, map, safety resources and first-days journey for new students. Unofficial; every fact links to its official source.</p>
        <div className="mt-4 flex gap-3"><Link className="btn" href="/campus-map">Open campus map</Link><Link className="btn" href="/freshmen-guide">First 15 days</Link></div>
        <form action="/services" className="mt-4 flex gap-2"><input name="q" className="input" aria-label="Search directory" placeholder="Search buildings, services, guides" /><button className="btn">Search</button></form>
      </section>
      <section><h2 className="mb-3 text-xl font-semibold">Official resources</h2>
        <ul className="grid gap-3 md:grid-cols-3">{Object.values(sources).map((s) => (
          <li key={s.sourceUrl} className="card"><a className="font-medium underline" href={s.sourceUrl} target="_blank" rel="noreferrer">{s.sourceName}</a></li>))}</ul>
      </section>
    </div>
  );
}
