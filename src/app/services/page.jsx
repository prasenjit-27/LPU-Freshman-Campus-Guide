import Image from "next/image";
import { safeFind } from "@/lib/mongodb";
import { defaultCampusLocations } from "@/data/campusLocations";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Search, 
  Compass, 
  Sparkles,
  ExternalLink,
  Flame,
  ArrowRight
} from "lucide-react";

export default async function Services({ searchParams }) {
  const q = (searchParams?.q || "").toString().slice(0, 60);
  const rx = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // Query DB first
  let dbItems = await safeFind(
    "campusLocations", 
    q ? { $or: [{ name: { $regex: rx, $options: "i" } }, { category: { $regex: rx, $options: "i" } }] } : {}
  );

  // If DB has no entries or is offline, fallback gracefully to our verified dataset
  let items = dbItems.length > 0 ? dbItems : defaultCampusLocations.filter((l) => {
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q.toLowerCase()) || 
      l.category.toLowerCase().includes(q.toLowerCase()) ||
      l.description.toLowerCase().includes(q.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 py-2">
      {/* Neo-Brutalist Header Banner with Official LPU Logo */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-xl">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-black bg-lpu-yellow" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-3 border-black bg-white shadow-neo">
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
              <Compass className="h-3.5 w-3.5 text-lpu-orange" />
              <span>Campus Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Campus Directory &amp; Block Locator
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-2xl leading-relaxed">
              Search academic blocks, residential hostels, dining spots, auditoriums, and healthcare centers.
            </p>
          </div>
        </div>
      </section>

      {/* Neo Search Input Bar */}
      {/* Directory Cards Grid */}
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((l, idx) => (
          <div 
            key={l._id || idx} 
            className="card border-3 border-black p-5 shadow-neo flex flex-col justify-between space-y-3 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="neo-badge neo-badge-yellow text-[10px] py-0.5">
                  {l.category}
                </span>
                {l.verificationStatus === "verified" && (
                  <span className="text-[10px] font-black uppercase text-emerald-700">
                    ✓ Verified
                  </span>
                )}
              </div>

              <h2 className="text-sm font-black uppercase text-black">
                {l.name}
              </h2>

              <p className="text-xs font-semibold text-black/80 leading-relaxed">
                {l.description}
              </p>
            </div>

            <div className="pt-2 border-t-2 border-black flex items-center justify-between">
              <Link 
                href={`/campus-map`} 
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-lpu-darkOrange underline"
              >
                <MapPin className="h-3 w-3" />
                <span>Locate on Map</span>
              </Link>
              <span className="text-[10px] font-bold text-black/60">
                {l.sourceName || "Campus Directory"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card border-3 border-black bg-white p-8 text-center space-y-2 shadow-neo">
          <p className="text-sm font-black uppercase text-black">No matching campus location found</p>
          <p className="text-xs font-bold text-black/60">Try searching for &quot;Auditorium&quot;, &quot;CSE&quot;, &quot;Library&quot;, or &quot;Hostel&quot;.</p>
        </div>
      )}
    </div>
  );
}
