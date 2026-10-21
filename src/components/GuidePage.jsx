import { guides } from "@/data/guides";
import SourceLink from "@/components/SourceLink";
export default function GuidePage({ id }) {
  const g = guides[id];
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{g.title}</h1><p className="text-sm text-slate-600">{g.intro}</p>
      {g.items.map(([t, d, src]) => <div key={t} className="card"><h2 className="font-semibold">{t}</h2><p className="text-sm">{d}</p><SourceLink s={src} /></div>)}
    </div>
  );
}
