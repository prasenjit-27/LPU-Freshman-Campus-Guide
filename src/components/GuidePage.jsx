import Image from "next/image";
import { guidesData } from "@/data/guidesData";
import { guides as fallbackGuides } from "@/data/guides";
import SourceLink from "@/components/SourceLink";
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Info,
  Flame,
  Zap
} from "lucide-react";

export default function GuidePage({ id }) {
  const data = guidesData[id];
  const fallback = fallbackGuides[id];

  if (!data && fallback) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black uppercase text-black">{fallback.title}</h1>
        <p className="text-sm font-bold text-black/80">{fallback.intro}</p>
        <div className="grid gap-4">
          {fallback.items.map(([t, d, src]) => (
            <div key={t} className="card p-5">
              <h2 className="font-black uppercase text-black">{t}</h2>
              <p className="text-sm text-black/80 mt-1">{d}</p>
              <SourceLink s={src} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="card p-6 font-bold text-black">Guide content not found.</div>;
  }

  return (
    <div className="space-y-8 py-2">
      {/* Neo-Brutalist Header Banner with LPU Branding */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-xl">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-black bg-lpu-yellow" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full border-3 border-black bg-white shadow-neo">
            <Image 
              src="/lpu-logo.png" 
              alt="LPU Official Logo" 
              fill 
              sizes="64px"
              className="object-contain p-1" 
              priority
            />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded border-2 border-black bg-lpu-yellow px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-neo-sm">
              <Flame className="h-3.5 w-3.5 text-lpu-orange" />
              <span>{data.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              {data.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Native Sections */}
      <div className="grid gap-6">
        {data.sections.map((section) => (
          <div key={section.id} className="card border-3 border-black p-6 space-y-4 shadow-neo">
            <div className="border-b-2 border-black pb-3">
              <h2 className="text-base sm:text-lg font-black uppercase text-black flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-black bg-lpu-orange text-white shadow-neo-sm">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span>{section.title}</span>
              </h2>
              <p className="text-xs font-bold text-black/70 mt-1 pl-9">
                {section.desc}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3.5">
              {section.details.map((item, idx) => (
                <div key={idx} className="rounded-xl border-2 border-black bg-lpu-soft/40 p-4 space-y-1.5 shadow-neo-sm w-full sm:w-[calc(50%-0.4375rem)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-lpu-orange border border-black" />
                    <h3 className="text-xs font-black uppercase text-black">{item.label}</h3>
                  </div>
                  <p className="text-xs font-medium text-black leading-relaxed pl-4">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Official External Sourcing Notice */}
      {data.sources && (
        <div className="rounded-xl border-3 border-black bg-lpu-yellow p-5 space-y-3 shadow-neo">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-black" />
            <h4 className="text-xs font-black uppercase text-black">Official University Reference Links</h4>
          </div>
          <p className="text-xs font-bold text-black/80">
            All data above is compiled natively for your convenience. For administrative circulars, official PDF gazettes, or direct university portal logins, you can consult the corresponding official pages:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.sources.map((src) => (
              <a
                key={src.sourceUrl}
                href={src.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-white text-xs px-3 py-1.5"
              >
                <span>{src.sourceName}</span>
                <ExternalLink className="h-3 w-3 ml-1 text-black" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
