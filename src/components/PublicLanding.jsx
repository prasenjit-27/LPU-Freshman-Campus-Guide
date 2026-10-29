import Link from "next/link";
import Image from "next/image";
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
  LogIn,
  Zap,
  Flame
} from "lucide-react";
import { sources } from "@/data/sources";

export default function PublicLanding({ announcements = [], upcomingEvents = [] }) {
  return (
    <div className="space-y-12 py-2">
      {/* Neo-Brutalist Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-12 shadow-neo-xl">
        {/* Background decorative neo patterns */}
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-4 border-black bg-lpu-yellow" />
        <div className="absolute right-12 bottom-6 h-16 w-16 rotate-12 border-4 border-black bg-lpu-orange" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-lpu-yellow px-3 py-1 text-xs font-black uppercase text-black shadow-neo-sm">
            <Flame className="h-4 w-4 text-lpu-orange" />
            <span>Lovely Professional University • Freshmen Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full border-3 border-black bg-white shadow-neo">
              <Image 
                src="/lpu-logo.png" 
                alt="LPU Official Logo" 
                fill 
                sizes="80px"
                className="object-contain p-1" 
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
                LPU Freshman <span className="bg-lpu-orange text-white px-2 py-0.5 border-2 border-black shadow-neo-sm inline-block">Guide</span>
              </h1>
              <p className="text-xs sm:text-sm font-bold text-black uppercase tracking-wider mt-1">
                Your Complete In-App Campus Survival System
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base font-semibold text-black leading-relaxed border-l-4 border-lpu-orange pl-4 bg-lpu-soft/60 py-2 rounded-r-lg">
            Everything you need for your first weeks at LPU. Master the UMS portal, pack with the complete hostel checklist, locate academic blocks, and read emergency medical protocols natively on this platform.
          </p>

          {/* Neo Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/freshmen-guide" className="btn btn-yellow text-sm px-6 py-3">
              <CalendarCheck2 className="h-4 w-4 mr-2" />
              <span>First 15 Days Checklist</span>
            </Link>
            <Link href="/campus-map" className="btn btn-white text-sm px-5 py-3">
              <MapPin className="h-4 w-4 mr-2 text-lpu-orange" />
              <span>Map</span>
            </Link>
            <Link href="/signup" className="btn text-sm px-5 py-3">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>

          </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b-4 border-black pb-3">
          <div>
            <h2 className="text-2xl font-black uppercase text-black tracking-tight flex items-center gap-2">
              <Zap className="h-6 w-6 text-lpu-orange" />
              <span>Core Freshmen Modules</span>
            </h2>
            <p className="text-xs font-bold text-black uppercase">
              All guides and campus data built directly inside your website
            </p>
          </div>
          <span className="hidden sm:inline-block neo-badge neo-badge-yellow">
            100% Native Data
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Map */}
          <Link href="/campus-map" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-lpu-yellow flex items-center justify-center text-black shadow-neo-sm group-hover:bg-lpu-orange group-hover:text-white transition-colors">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Campus Map</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                600+ acres simplified. Find Block 32 reporting, Block 34 (CSE), Block 38 Library, hostels, and routing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-lpu-darkOrange">
              <span>EXPLORE MAP</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 2: 15 Days */}
          <Link href="/freshmen-guide" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-lpu-orange flex items-center justify-center text-white shadow-neo-sm group-hover:bg-lpu-yellow group-hover:text-black transition-colors">
                <CalendarCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">First 15 Days Checklist</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                Complete walkthrough: physical reporting at Block 32, packing lists, room allotment, and biometric ID cards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-lpu-darkOrange">
              <span>VIEW CHECKLIST</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 3: Academics & UMS */}
          <Link href="/academics" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-[#A0E7E5] flex items-center justify-center text-black shadow-neo-sm group-hover:bg-black group-hover:text-white transition-colors">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Academics & UMS Setup</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                First-time UMS login, 75% strict attendance rules, Continuous Assessment (CA) pattern, and timetable navigation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-black">
              <span>UMS HANDBOOK</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 4: Hostel & Residential */}
          <Link href="/hostel" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-[#FFAEBC] flex items-center justify-center text-black shadow-neo-sm group-hover:bg-black group-hover:text-white transition-colors">
                <BedDouble className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Hostel & Curfews</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                BH-1 to BH-8, GH-1 to GH-6, turnstile attendance at 8:30 PM, day passes, and home leave permissions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-black">
              <span>HOSTEL GUIDE</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 5: Dining & Uni-Mall */}
          <Link href="/dining" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-[#BFFCC6] flex items-center justify-center text-black shadow-neo-sm group-hover:bg-black group-hover:text-white transition-colors">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Dining & Uni-Mall</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                4-meal residential mess timings, Domino&apos;s, Subway, stationery shops, laundromat facilities, and supermarkets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-black">
              <span>DINING TIMINGS</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Card 6: Safety & Uni-Hospital */}
          <Link href="/safety" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-[#FFABAB] flex items-center justify-center text-black shadow-neo-sm group-hover:bg-black group-hover:text-white transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Safety & Uni-Hospital</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                24/7 Uni-Hospital (Block 30), resident doctor emergency triage, ambulance, and zero-tolerance anti-ragging cell.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-black">
              <span>SAFETY PROTOCOLS</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Quick Freshmen FAQs */}
      <section>
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h3 className="text-base font-black uppercase text-black flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-lpu-orange" />
              <span>Quick Freshmen FAQs</span>
            </h3>
            <Link href="/help" className="text-xs font-black text-lpu-darkOrange underline">
              VIEW ALL FAQS
            </Link>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3 text-xs font-bold text-black">
            <Link href="/help" className="block rounded-lg border-2 border-black bg-white p-3 shadow-neo-sm hover:bg-lpu-yellow transition-colors">
              👉 What is the 75% attendance policy and debarment rule?
            </Link>
            <Link href="/help" className="block rounded-lg border-2 border-black bg-white p-3 shadow-neo-sm hover:bg-lpu-yellow transition-colors">
              👉 How do I apply for a weekend home leave pass on UMS?
            </Link>
            <Link href="/help" className="block rounded-lg border-2 border-black bg-white p-3 shadow-neo-sm hover:bg-lpu-yellow transition-colors">
              👉 What time does the hostel gate turnstile close at night?
            </Link>
          </div>
        </div>
      </section>

      {/* Sourcing Banner */}
      <div className="rounded-xl border-3 border-black bg-lpu-yellow p-4 text-xs font-bold text-black shadow-neo flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          Official administrative portal logins, grades, and fee transactions are processed exclusively via LPU Touch &amp; UMS.
        </div>
        <a 
          href={sources.ums.sourceUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-black text-xs px-3 py-1.5 shrink-0"
        >
          <span>Official UMS</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </a>
      </div>
    </div>
  );
}
