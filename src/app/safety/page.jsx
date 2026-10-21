import { sources as s } from "@/data/sources";
import SourceLink from "@/components/SourceLink";
const items = [[s.healthcare, "Medical and healthcare services"], [s.security, "Campus security"], [s.antiragging, "Anti-ragging reporting and information"], [s.contact, "University contact information"]];
export default function Safety() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Safety and emergency</h1>
      <p className="card text-sm">Phone numbers are intentionally not hard-coded here because they have not been verified. Use the official pages below. In an emergency, call your national emergency number.</p>
      {items.map(([src, t]) => <div key={t} className="card"><h2 className="font-semibold">{t}</h2><SourceLink s={src} /></div>)}
    </div>
  );
}
