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
        {items.map((l, idx) => {
          const hasCoordinates = l.lat != null && l.lng != null;
          const targetUrl = hasCoordinates 
            ? `/campus-map?spot=${encodeURIComponent(l.name.split('(')[0].trim())}`
            : "#";

          return (
            <Link
              key={l._id || idx}
              href={targetUrl}
              className={`card border-3 border-black p-5 shadow-neo flex flex-col justify-between space-y-3 transition-all w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] ${
                hasCoordinates 
                  ? "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg hover:border-black cursor-pointer group" 
                  : "cursor-default"
              }`}
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

                <h3 className="text-sm font-black uppercase text-black group-hover:text-lpu-orange transition-colors flex items-center justify-between gap-1">
                  <span>{l.name}</span>
                  {hasCoordinates && (
                    <MapPin className="h-3.5 w-3.5 text-lpu-orange shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  )}
                </h3>

                <p className="text-xs font-semibold text-black/80 leading-relaxed">
                  {l.description}
                </p>
              </div>

              <div className="pt-2 border-t-2 border-black flex items-center justify-between">
                <span className="text-[10px] font-bold text-black/60">
                  {l.sourceName || "Campus Directory"}
                </span>

                {hasCoordinates && (
                  <span className="text-[10px] font-black uppercase text-lpu-orange group-hover:underline">
                    View on Map →
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
