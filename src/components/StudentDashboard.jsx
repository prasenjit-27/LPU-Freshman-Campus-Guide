import Link from "next/link";
import { 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Sparkles, 
  CalendarCheck2, 
  GraduationCap, 
  BedDouble, 
  UtensilsCrossed, 
  BookOpen, 
  Bus, 
  HeartPulse, 
  Users2, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  UserCheck, 
  BellRing,
  HelpCircle,
  Settings
} from "lucide-react";
import { tasks } from "@/data/tasks";
import { sources } from "@/data/sources";

export default function StudentDashboard({ 
  user, 
  completedTaskCount, 
  profile, 
  savedLocations = [], 
  announcements = [], 
  upcomingEvents = [] 
}) {
  const profileKeys = ["programme", "school", "year", "accommodation", "interests"];
  const filledKeys = profileKeys.filter((k) => profile?.[k]);
  const profilePct = Math.round((filledKeys.length / profileKeys.length) * 100);
  const taskPct = Math.round((completedTaskCount / tasks.length) * 100);

  return (
    <div className="space-y-8 py-2">
      {/* Personalized Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-400/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Student Overview Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-amber-300">{user.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {profile?.school ? `${profile.school} • ${profile.programme || "Freshman"}` : "Welcome to your student orientation space. Keep track of your progress and bookmarks."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/campus-map" className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2.5">
              <Compass className="h-4 w-4 mr-1.5" />
              <span>Campus Map</span>
            </Link>
            <Link href="/settings" className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium px-4 py-2.5">
              <Settings className="h-4 w-4 mr-1.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Progress & Quick Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Onboarding Tasks Progress */}
        <div className="card p-5 border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CalendarCheck2 className="h-4 w-4 text-indigo-600" />
                First 15 Days Checklist
              </span>
              <span className="font-bold text-indigo-600">{taskPct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${taskPct}%` }} 
              />
            </div>
            <p className="text-xs text-slate-600">
              <strong className="text-slate-900">{completedTaskCount}</strong> of {tasks.length} induction milestones completed.
            </p>
          </div>
          <Link href="/freshmen-guide" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:underline pt-2 border-t border-slate-100">
            Continue Checklist <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {/* Profile Completion */}
        <div className="card p-5 border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Academic Profile
              </span>
              <span className="font-bold text-emerald-600">{profilePct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${profilePct}%` }} 
              />
            </div>
            <p className="text-xs text-slate-600">
              {profilePct === 100 
                ? "Your academic profile is complete." 
                : "Add your school, programme, and hostel for tailored guidance."}
            </p>
          </div>
          <Link href="/settings" className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:underline pt-2 border-t border-slate-100">
            Update Profile <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        {/* Bookmarked / Saved Locations */}
        <div className="card p-5 border-slate-200 flex flex-col justify-between space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-600" />
                Saved Campus Spots
              </span>
              <span className="font-bold text-amber-600">{savedLocations.length}</span>
            </div>
            {savedLocations.length > 0 ? (
              <ul className="text-xs text-slate-700 space-y-1">
                {savedLocations.slice(0, 3).map((l) => (
                  <li key={String(l._id)} className="flex items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">{l.name}</span>
                  </li>
                ))}
                {savedLocations.length > 3 && (
                  <li className="text-[11px] text-slate-400">+{savedLocations.length - 3} more saved places</li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                You haven't saved any campus spots yet. Star places on the map to find them quickly.
              </p>
            )}
          </div>
          <Link href="/campus-map" className="inline-flex items-center text-xs font-semibold text-amber-600 hover:underline pt-2 border-t border-slate-100">
            View On Campus Map <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>
      </section>

      {/* Freshmen Resources Hub */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-bold text-slate-900">Student Navigation & Services</h2>
          <span className="text-xs text-slate-500">Essential freshman modules</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/academics" className="card p-4 hover:border-indigo-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Academics & UMS</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Calendars, exams, attendance rules</p>
            </div>
          </Link>

          <Link href="/hostel" className="card p-4 hover:border-amber-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Hostel & Housing</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Leave pass rules, wardens, laundry</p>
            </div>
          </Link>

          <Link href="/dining" className="card p-4 hover:border-orange-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Dining & Shopping</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Mess timings, uni-mall, stationery</p>
            </div>
          </Link>

          <Link href="/safety" className="card p-4 hover:border-rose-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Safety & Medical</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Uni-hospital 24/7, security posts</p>
            </div>
          </Link>

          <Link href="/services" className="card p-4 hover:border-teal-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Directory & Transport</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Block search & shuttle services</p>
            </div>
          </Link>

          <Link href="/buddy" className="card p-4 hover:border-purple-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Buddy & Mentorship</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Peer assistance & help resources</p>
            </div>
          </Link>

          <Link href="/student-life" className="card p-4 hover:border-blue-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Campus Student Life</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Student clubs, culture & sports</p>
            </div>
          </Link>

          <Link href="/help" className="card p-4 hover:border-slate-300 hover:shadow-sm transition-all group flex items-start gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600 group-hover:bg-slate-700 group-hover:text-white transition-colors">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Help & FAQs</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Frequently asked freshman questions</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Announcements & Events Section */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-5 border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BellRing className="h-4 w-4 text-indigo-600" />
              Latest Announcements
            </h3>
            <Link href="/announcements" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {announcements.length > 0 ? (
            <ul className="divide-y divide-slate-100 text-xs">
              {announcements.map((a) => (
                <li key={a._id} className="py-2.5 first:pt-0 last:pb-0">
                  <h4 className="font-semibold text-slate-800">{a.pinned && "📌 "}{a.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{a.summary || a.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No active announcements posted right now.</p>
          )}
        </div>

        <div className="card p-5 border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarCheck2 className="h-4 w-4 text-purple-600" />
              Upcoming Events
            </h3>
            <Link href="/events" className="text-xs text-purple-600 hover:underline">View all</Link>
          </div>
          {upcomingEvents.length > 0 ? (
            <ul className="divide-y divide-slate-100 text-xs">
              {upcomingEvents.map((e) => (
                <li key={e._id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800">{e.name}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(e.startsAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{e.venue} — {e.description?.slice(0, 80)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No events listed on schedule.</p>
          )}
        </div>
      </section>

      {/* Official Notice Disclaimer */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-800">Academic & Administrative Notice:</span> Timetables, fee receipts, and official exam results live only on the University Management System (UMS) and will never be collected here.
        </div>
        <a href={sources.ums.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline shrink-0">
          <span>Official UMS Portal</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
