import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import ProfileForm from "@/components/ProfileForm";
export const dynamic = "force-dynamic";
export default async function Settings() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const p = await (await getDb()).collection("studentProfiles").findOne({ userId: s.user.id }).catch(() => null);
  const initial = p ? { programme: p.programme, school: p.school, year: p.year, interests: p.interests, accommodation: p.accommodation } : {};
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Profile and settings</h1><p className="text-sm text-slate-600">{s.user.name} · {s.user.email}</p><ProfileForm initial={initial} /></div>);
}
