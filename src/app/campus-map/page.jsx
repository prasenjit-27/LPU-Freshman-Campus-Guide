import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, safeFind } from "@/lib/mongodb";
import { defaultCampusLocations } from "@/data/campusLocations";
import MapView from "@/components/MapView";
import { Compass, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CampusMap() {
  const s = await getServerSession(authOptions).catch(() => null);
  const rows = await safeFind("campusLocations", { lat: { $type: "number" }, lng: { $type: "number" } }, 300);
  
  // Use DB rows or fallback to native verified campus locations
  const sourceRows = rows.length > 0 ? rows : defaultCampusLocations.map((l, i) => ({ ...l, _id: `loc-${i}` }));

  const locations = sourceRows.map((l) => ({
    _id: l._id,
    name: l.name,
    category: l.category,
    description: l.description || "",
    lat: l.lat,
    lng: l.lng,
    sourceName: l.sourceName || "Campus Directory",
    sourceUrl: l.sourceUrl || "",
    verificationStatus: l.verificationStatus || "verified"
  }));

  let savedIds = [];
  if (s) {
    try {
      savedIds = (
        await (await getDb()).collection("savedLocations").find({ userId: s.user.id }).toArray()
      ).map((r) => r.locationId);
    } catch {}
  }

  return (
    <div className="space-y-6 py-2">
      {/* Neo-Brutalist Map Banner with Official LPU Logo */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-8 shadow-neo-xl">
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
              <span>Campus Navigation System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Interactive Campus Map
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-2xl leading-relaxed">
              Explore 600+ acres of Lovely Professional University. Filter academic blocks, residential complexes, auditoriums, and calculate walking routes.
            </p>
          </div>
        </div>
      </section>

      <MapView locations={locations} signedIn={!!s} savedIds={savedIds} />
    </div>
  );
}
