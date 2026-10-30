import Link from "next/link";
import { Building2, MapPin } from "lucide-react";

export default function DirectorySection({ items = [] }) {
  return (
    <div className="space-y-6">
      <div className="border-b-4 border-black pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-black flex items-center gap-2">
            <Building2 className="h-6 w-6 text-lpu-orange" />
            <span>Campus Blocks &amp; Services Directory</span>
          </h2>
          <p className="text-xs font-bold text-black/70 uppercase">
            Quick reference guide to key administrative and academic buildings
          </p>
        </div>
      </div>

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

              <h3 className="text-sm font-black uppercase text-black">
                {l.name}
              </h3>

              <p className="text-xs font-semibold text-black/80 leading-relaxed">
                {l.description}
              </p>
            </div>

            <div className="pt-2 border-t-2 border-black flex items-center justify-between">
              <a 
                href="#map" 
                className="text-xs font-black uppercase text-lpu-darkOrange hover:underline inline-flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                <span>Locate on Map</span>
              </a>
              <span className="text-[10px] font-bold text-black/60">
                {l.sourceName || "Campus Directory"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

