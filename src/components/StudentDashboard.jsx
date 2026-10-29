import Link from "next/link";
import Image from "next/image";
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
  Settings,
  Flame,
  Zap
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
      {/* Neo-Brutalist Personalized Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-xl">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-black bg-lpu-yellow" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
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
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded border-2 border-black bg-lpu-yellow px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-neo-sm">
                <Flame className="h-3.5 w-3.5 text-lpu-orange" />
                <span>Student Orientation Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
                Welcome, <span className="bg-lpu-orange text-white px-2 py-0.5 border-2 border-black shadow-neo-sm inline-block">{user.name}</span>!
              </h1>
              <p className="text-xs sm:text-sm font-bold text-black uppercase tracking-wider">
                {profile?.school ? `${profile.school} • ${profile.programme || "Freshman"}` : "Lovely Professional University"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/campus-map" className="btn btn-yellow text-xs px-4 py-2.5">
              <Compass className="h-4 w-4 mr-1.5" />
              <span>Campus Map</span>
            </Link>
            <Link href="/settings" className="btn btn-white text-xs px-4 py-2.5">
              <Settings className="h-4 w-4 mr-1.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </section>

      

      {/* First 15 Days Progress (Without Progress Bar) */}
      <section>
        <div className="card p-5 border-4 border-black bg-white shadow-neo-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-lpu-yellow text-black shadow-neo-sm">
              <CalendarCheck2 className="h-5 w-5 text-lpu-orange" />
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black uppercase text-black">First 15 Days Progress</h2>
                <span className="neo-badge neo-badge-yellow">{taskPct}% Completed</span>
              </div>
              <p className="text-xs font-bold text-black/80">
                {completedTaskCount} of {tasks.length} induction milestones completed.
              </p>
            </div>
          </div>
          <Link href="/freshmen-guide" className="btn btn-white text-xs px-4 py-2 shrink-0">
            Open Checklist →
          </Link>
        </div>
      </section>

      {/* Freshmen Resources Hub */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-4 border-black pb-2">
          <h2 className="text-lg font-black uppercase text-black">Student Navigation &amp; Services</h2>
          <span className="text-xs font-bold uppercase text-lpu-darkOrange">Quick Modules</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/academics" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-lpu-yellow p-2 text-black shadow-neo-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Academics &amp; UMS</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Calendars, exams, attendance rules</p>
            </div>
          </Link>

          <Link href="/hostel" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-lpu-orange p-2 text-white shadow-neo-sm">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Hostel &amp; Housing</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Leave pass rules, wardens, laundry</p>
            </div>
          </Link>

          <Link href="/dining" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-[#FFAEBC] p-2 text-black shadow-neo-sm">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Dining &amp; Shopping</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Mess timings, uni-mall, stationery</p>
            </div>
          </Link>

          <Link href="/safety" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-[#FFABAB] p-2 text-black shadow-neo-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Safety &amp; Medical</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Uni-hospital 24/7, security posts</p>
            </div>
          </Link>

          <Link href="/services" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-[#A0E7E5] p-2 text-black shadow-neo-sm">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Directory &amp; Blocks</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Block search &amp; shuttle services</p>
            </div>
          </Link>

          <Link href="/buddy" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-[#BFFCC6] p-2 text-black shadow-neo-sm">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Buddy &amp; Mentorship</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Peer assistance &amp; help resources</p>
            </div>
          </Link>

          <Link href="/student-life" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-lpu-yellow p-2 text-black shadow-neo-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Campus Life</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Clubs, culture &amp; sports complex</p>
            </div>
          </Link>

          <Link href="/help" className="card p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 group flex items-start gap-3">
            <div className="rounded-lg border-2 border-black bg-white p-2 text-black shadow-neo-sm">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-black">Help &amp; FAQs</h3>
              <p className="text-[11px] font-medium text-black/70 mt-0.5">Frequently asked freshman questions</p>
            </div>
          </Link>
        </div>
      </section>


      {/* Official Notice Disclaimer */}
      <div className="rounded-xl border-3 border-black bg-lpu-yellow p-4 text-xs font-bold text-black shadow-neo flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          Official timetables, fee receipts, and official exam results live only on the University Management System (UMS).
        </div>
        <a href={sources.ums.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-black text-xs px-3 py-1.5 shrink-0">
          <span>Official UMS Portal</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </a>
      </div>
    </div>
  );
}
