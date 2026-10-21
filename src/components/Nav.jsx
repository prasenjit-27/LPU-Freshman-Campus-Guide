import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOut from "@/components/SignOut";
const links = [["/campus-map", "Campus map"], ["/services", "Directory"], ["/freshmen-guide", "First 15 days"], ["/announcements", "News"], ["/events", "Events"], ["/academics", "Academics"], ["/hostel", "Hostel"], ["/dining", "Dining"], ["/student-life", "Student life"], ["/help", "Help"], ["/safety", "Safety"]];
export default async function Nav() {
  const s = await getServerSession(authOptions).catch(() => null);
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4 text-sm" aria-label="Main">
        <Link href="/" className="font-semibold text-indigo-700">LPU Freshman Guide</Link>
        {links.map(([h, l]) => <Link key={h} href={h} className="hover:underline">{l}</Link>)}
        <span className="ml-auto flex items-center gap-3">
          {s ? (<>
            <Link href="/dashboard">Dashboard</Link><Link href="/settings">Profile</Link>
            {s.user.role === "admin" && <Link href="/admin">Admin</Link>}
            <SignOut />
          </>) : (<><Link href="/login">Log in</Link><Link href="/signup" className="btn">Sign up</Link></>)}
        </span>
      </nav>
    </header>
  );
}
