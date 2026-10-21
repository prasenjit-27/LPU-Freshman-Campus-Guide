import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb, safeFind } from "@/lib/mongodb";
import MapView from "@/components/MapView";
export const dynamic = "force-dynamic";
export default async function CampusMap() {
  const s = await getServerSession(authOptions).catch(() => null);
  const rows = await safeFind("campusLocations", { lat: { $type: "number" }, lng: { $type: "number" } }, 300);
  const locations = rows.map((l) => ({ _id: l._id, name: l.name, category: l.category, description: l.description || "", lat: l.lat, lng: l.lng, sourceName: l.sourceName, sourceUrl: l.sourceUrl, verificationStatus: l.verificationStatus }));
  let savedIds = [];
  if (s) { try { savedIds = (await (await getDb()).collection("savedLocations").find({ userId: s.user.id }).toArray()).map((r) => r.locationId); } catch {} }
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Campus map</h1><MapView locations={locations} signedIn={!!s} savedIds={savedIds} /></div>);
}
