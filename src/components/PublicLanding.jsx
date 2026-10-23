import Link from "next/link";
import { 
  Compass, 
  MapPin, 
  CalendarCheck2, 
  GraduationCap, 
  BedDouble, 
  UtensilsCrossed, 
  BookOpen, 
  Bus, 
  HeartPulse, 
  Users2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle, 
  Search,
  BellRing,
  HelpCircle,
  LogIn
} from "lucide-react";
import { sources } from "@/data/sources";

export default function PublicLanding({ announcements = [], upcomingEvents = [] }) {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-14 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium backdrop-blur-md border border-white/15 text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Independent & Unofficial LPU Campus Guide
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Navigate Your First Days at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Lovely Professional University</span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-2xl">
            A comprehensive, verified companion for freshers. Explore campus buildings, master the official University Management System (UMS), track your first-15-days checklist, and discover residential facilities.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/signup" className="btn bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold px-5 py-3 text-sm shadow-lg shadow-amber-400/20 border-0">
              <span>Create Student Account</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
            <Link href="/login" className="btn bg-white/15 hover:bg-white/25 text-white border border-white/20 px-5 py-3 text-sm backdrop-blur-md">
              <LogIn className="h-4 w-4 mr-1.5" />
              <span>Student Log In</span>
            </Link>
            <Link href="/campus-map" className="btn bg-transparent hover:bg-white/10 text-indigo-200 border border-indigo-300/30 px-4 py-3 text-sm">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>Explore Campus Map</span>
            </Link>
          </div>

          {/* Quick Search */}
          <form action="/services" method="GET" className="pt-4 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="q"
                placeholder="Search campus blocks, food courts, hospitals, libraries..."
                className="input pl-10 text-sm bg-white/95 text-slate-900 placeholder:text-slate-500 border-0 shadow-inner"
              />
            </div>
            <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium shrink-0">
              Search Directory
            </button>
          </form>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Everything Freshmen Need In One Place
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            All facts link to official university sources. Sign up to save favorite places, track checklist progress, and personalize your guide.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Interactive Campus Map */}
          <div className="card hover:shadow-md transition-shadow border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Interactive Campus Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                600+ acres simplified. Find academic blocks, hostel entry gates, uni-mall, sports facilities, and calculate walking routes across campus.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/campus-map" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                Open Map View <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: First 15 Days Checklist */}
          <div className="card hover:shadow-md transition-shadow border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">First 15 Days Checklist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step orientation checklist: biometrics registration, student ID collection, Wi-Fi onboarding, and library card activation.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/freshmen-guide" className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-800">
                View Checklist <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 3: Academics & UMS */}
          <div className="card hover:shadow-md transition-shadow border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Academics & UMS Navigation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guidance on navigating official systems: academic calendar, attendance policies, library facilities, and term exam outlines.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/academics" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800">
                Explore Academics <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 4: Hostel & Residential Guide */}
          <div className="card hover:shadow-md transition-shadow border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <BedDouble className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Hostel & Residences</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rules, leave clearance procedures, laundry services, packing recommendations, and warden reporting guidelines.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/hostel" className="inline-flex items-center text-xs font-semibold text-amber-600 hover:text-amber-800">
                Read Residence Guide <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 5: Food Courts & Uni-Mall */}
          <div className="card hover:shadow-md transition-shadow border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dining & Daily Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mess menus, food kiosks, campus shopping complexes, stationery stores, and internal e-rickshaw transportation.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/dining" className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-800">
                View Dining Spots <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 6: Safety & Emergency */}
          <div className="card hover:shadow-md transition-shadow border-slate-200 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Campus Safety & Healthcare</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uni-Hospital round-the-clock emergency protocols, campus security posts, and anti-ragging redressal contacts.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <Link href="/safety" className="inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-800">
                Check Safety Contacts <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements & Happenings Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Campus News & Public Events</h2>
            <p className="text-xs text-slate-500">Official bulletins and upcoming freshmen activities</p>
          </div>
          <Link href="/announcements" className="text-xs font-semibold text-indigo-600 hover:underline">
            View All Announcements
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Latest Announcement */}
          <div className="card border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold">
              <BellRing className="h-4 w-4" />
              <span>Latest Announcement</span>
            </div>
            {announcements.length > 0 ? (
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900 text-sm">{announcements[0].title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{announcements[0].summary || announcements[0].content}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active announcements posted right now. Check back soon.</p>
            )}
            <Link href="/announcements" className="inline-flex items-center text-xs text-indigo-600 hover:underline pt-1">
              Read all notices <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {/* Upcoming Event */}
          <div className="card border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold">
              <CalendarCheck2 className="h-4 w-4" />
              <span>Upcoming Event</span>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900 text-sm">{upcomingEvents[0].name}</h4>
                <p className="text-xs text-slate-500">
                  {new Date(upcomingEvents[0].startsAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} · {upcomingEvents[0].venue}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2">{upcomingEvents[0].description}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No public events scheduled currently.</p>
            )}
            <Link href="/events" className="inline-flex items-center text-xs text-purple-600 hover:underline pt-1">
              Explore event calendar <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Official Verified University Resources */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Direct Links to Official LPU Portals</h2>
          <p className="text-xs text-slate-500">
            Always verify academic dates, fee deadlines, and exam timetables directly on university systems.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(sources).slice(0, 8).map(([key, s]) => (
            <a
              key={key}
              href={s.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="card p-4 hover:border-indigo-300 hover:shadow-sm transition-all group flex items-start justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                  {s.sourceName}
                </h4>
                <span className="text-[10px] text-slate-400 mt-1 block">Official university link</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Common questions from arriving freshmen and parents</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          <details className="card p-4 group cursor-pointer">
            <summary className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
              <span>Is this an official LPU portal?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              No. This is an independent, open-source campus guide created to help new students navigate campus life. All administrative procedures (fees, attendance, grades) are handled exclusively via official university portals (e.g. UMS).
            </p>
          </details>

          <details className="card p-4 group cursor-pointer">
            <summary className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
              <span>Should I enter my UMS password here?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed font-semibold text-amber-700">
              Never! Do not share your official LPU credentials on any third-party website. The account you create here is strictly for saving your onboarding progress and personal bookmarks on this guide.
            </p>
          </details>

          <details className="card p-4 group cursor-pointer">
            <summary className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
              <span>How do I get help if I am stuck on campus?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Visit the <Link href="/safety" className="text-indigo-600 underline">Safety & Healthcare page</Link> for hospital contact numbers, or head to Block 30 (Student Welfare / Helpdesk).
            </p>
          </details>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="rounded-2xl bg-indigo-50 border border-indigo-100 p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Ready to start your freshman journey?</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Sign up for a free guide account to save campus landmarks, track your induction tasks, and personalize your student feed.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/signup" className="btn px-6 py-2.5 text-sm font-semibold">
            Get Started Now
          </Link>
          <Link href="/login" className="btn bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 text-sm">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
