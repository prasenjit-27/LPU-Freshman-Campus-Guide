import Link from "next/link";
import Image from "next/image";
import { 
  Compass, 
  MapPin, 
  CalendarCheck2, 
  GraduationCap, 
  BedDouble, 
  UtensilsCrossed, 
  Bus, 
  ShieldCheck, 
  ExternalLink, 
  HelpCircle,
  Zap,
  Flame,
  ArrowRight,
  Building2
} from "lucide-react";
import { sources } from "@/data/sources";
import { tasks } from "@/data/tasks";
import TaskList from "@/components/TaskList";
import GuidePage from "@/components/GuidePage";
import SafetySection from "@/components/SafetySection";
import DirectorySection from "@/components/DirectorySection";
import FaqSection from "@/components/FaqSection";
import MapView from "@/components/MapView";

export default function PublicLanding({ 
  announcements = [], 
  upcomingEvents = [], 
  locations = [], 
  faqs = [] 
}) {
  return (
    <div className="space-y-12 py-2">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-12 shadow-neo-xl">
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

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="#first-15-days" className="btn btn-yellow text-sm px-6 py-3">
              <CalendarCheck2 className="h-4 w-4 mr-2" />
              <span>First 15 Days Checklist</span>
            </a>
            <a href="#map" className="btn btn-white text-sm px-5 py-3">
              <MapPin className="h-4 w-4 mr-2 text-lpu-orange" />
              <span>Campus Map</span>
            </a>
            <Link href="/signup" className="btn text-sm px-5 py-3">
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Jump To Quick Modules */}
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <a href="#directory" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-[#A0E7E5] flex items-center justify-center text-black shadow-neo-sm group-hover:bg-black group-hover:text-white transition-colors">
                <Bus className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Directory &amp; Blocks</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                Block 32 reporting, Block 34 (CSE), Library, Uni-Hospital, and Uni-Mall.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-black">
              <span>VIEW DIRECTORY</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          <a href="#first-15-days" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-lpu-orange flex items-center justify-center text-white shadow-neo-sm group-hover:bg-lpu-yellow group-hover:text-black transition-colors">
                <CalendarCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">First 15 Days Checklist</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                Complete walkthrough: physical reporting, packing lists, room allotment, and ID cards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-lpu-darkOrange">
              <span>VIEW CHECKLIST</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          <a href="#academics" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-lpu-yellow flex items-center justify-center text-black shadow-neo-sm group-hover:bg-black group-hover:text-white transition-colors">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Academics &amp; UMS</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                First-time login, 75% strict attendance rules, Continuous Assessment (CA) pattern.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-black">
              <span>ACADEMICS GUIDE</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          <a href="#map" className="card group hover:-translate-x-1 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-xl border-3 border-black bg-lpu-yellow flex items-center justify-center text-black shadow-neo-sm group-hover:bg-lpu-orange group-hover:text-white transition-colors">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-black">Campus Map</h3>
              <p className="text-xs font-medium text-black leading-relaxed">
                600+ acres simplified. Animated 3D campus navigation with verified landmarks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-black text-lpu-darkOrange">
              <span>EXPLORE MAP</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>
        </div>
      </section>

      {/* Official UMS Notice */}
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
          <span>Official UMS Portal</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </a>
      </div>

      {/* 3. Directory Section */}
      <section id="directory" className="scroll-mt-24 pt-4">
        <DirectorySection items={locations} />
      </section>

      {/* 4. First 15 Days Checklist Section */}
      <section id="first-15-days" className="scroll-mt-24 pt-4 space-y-6">
        <div className="border-b-4 border-black pb-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-black flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-lpu-orange" />
            <span>Your First 15 Days Checklist</span>
          </h2>
          <p className="text-xs font-bold text-black/70 uppercase">
            Milestones and steps designed to help freshmen settle into LPU
          </p>
        </div>
        <TaskList tasks={tasks} signedIn={false} />
      </section>

      {/* 5. Academics Section */}
      <section id="academics" className="scroll-mt-24 pt-4">
        <GuidePage id="academics" />
      </section>

      {/* 6. Hostel Section */}
      <section id="hostel" className="scroll-mt-24 pt-4">
        <GuidePage id="hostel" />
      </section>

      {/* 7. Dining Section */}
      <section id="dining" className="scroll-mt-24 pt-4">
        <GuidePage id="dining" />
      </section>

      {/* 8. Safety Section */}
      <section id="safety" className="scroll-mt-24 pt-4">
        <SafetySection />
      </section>

      {/* 9. Map Section (Placed BEFORE FAQ) */}
      <section id="map" className="scroll-mt-24 pt-4 space-y-6">
        <div className="border-b-4 border-black pb-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-black flex items-center gap-2">
            <Compass className="h-6 w-6 text-lpu-orange" />
            <span>Interactive LPU Campus Map</span>
          </h2>
          <p className="text-xs font-bold text-black/70 uppercase">
            Animated 3D view restricted strictly to 600+ acres of LPU campus
          </p>
        </div>
        <MapView locations={locations} />
      </section>

      {/* 10. FAQ Section */}
      <section id="faq" className="scroll-mt-24 pt-4">
        <FaqSection items={faqs} />
      </section>
    </div>
  );
}
