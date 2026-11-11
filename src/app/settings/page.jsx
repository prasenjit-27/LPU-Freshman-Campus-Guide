import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const db = await getDb();

  const [p, userDoc] = await Promise.all([
    db.collection("studentProfiles").findOne({ userId: s.user.id }).catch(() => null),
    db.collection("users").findOne({ _id: new ObjectId(s.user.id) }, { projection: { registrationNumber: 1 } }).catch(() => null),
  ]);

  const initial = {
    programme: p?.programme || "",
    school: p?.school || "",
    year: p?.year || "",
    interests: p?.interests || "",
    accommodation: p?.accommodation || "",
    // registrationNumber: prefer studentProfiles override, fallback to users doc
    registrationNumber: p?.registrationNumber || userDoc?.registrationNumber || "",
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-black uppercase text-black tracking-tight">
            Profile and Settings
          </h1>
          <p className="text-xs font-bold text-black/70">
            {s.user.name} · {s.user.email}
          </p>
        </div>

        <ProfileForm initial={initial} />
      </div>
    </div>
  );
}
