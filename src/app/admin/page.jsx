import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { safeFind } from "@/lib/mongodb";
import { adminSchemas } from "@/lib/validation";
import AdminPanel from "@/components/AdminPanel";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const s = await getServerSession(authOptions);
  if (s?.user?.role !== "admin") redirect("/login");
  const types = Object.keys(adminSchemas);
  const rows = await Promise.all(types.map((t) => safeFind(adminSchemas[t].collection, {}, 100).then((r) => r.map(({ _id, name, title, question }) => ({ _id, name, title, question })))));
  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Admin</h1>{types.map((t, i) => <AdminPanel key={t} type={t} rows={rows[i]} />)}</div>);
}
