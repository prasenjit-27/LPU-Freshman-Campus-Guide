import Link from "next/link";
import Image from "next/image";
import { 
  LogIn, 
  UserPlus, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Compass,
  CalendarCheck2,
  GraduationCap,
  Sparkles,
  BedDouble,
  UtensilsCrossed,
  HeartPulse,
  Bus,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building2,
  Lock,
  PhoneCall,
  ExternalLink,
  BookOpen,
  Award,
  Users2
} from "lucide-react";
import FaqSection from "@/components/FaqSection";
import { defaultFaqs } from "@/data/faqsData";

export default function PublicLanding({ faqs = [] }) {
  const faqList = faqs.length > 0 ? faqs : defaultFaqs;

  const corePillars = [
    {
      title: "Interactive 3D Campus Map",
      badge: "600+ Acres Navigation",
      desc: "Explore every corner of the campus in real-time 3D. Locate Block 32 reporting counters, Block 34 (School of CSE), central libraries, auditoriums, and residences with ease.",
      icon: Compass,
      bg: "bg-lpu-yellow"
    },
    {
      title: "First 15 Days Induction Checklist",
      badge: "Step-by-Step Onboarding",
      desc: "Never miss a critical milestone. Complete your physical document verification, collect biometric ID cards, attend chancellor orientation, and set up your university hostel room.",
      icon: CalendarCheck2,
      bg: "bg-lpu-orange",
      textWhite: true
    },
    {
      title: "Academics & Strict 75% Attendance",
      badge: "Curriculum & Rules",
      desc: "Understand continuous assessments (CA), mid-term examinations, grading criteria, and the mandatory 75% biometric attendance rule to avoid academic debarment.",
      icon: GraduationCap,
      bg: "bg-[#A0E7E5]"
    },
    {
      title: "Hostel Living, Curfews & Leaves",
      badge: "Residential Protocol",
      desc: "Comprehensive guidelines for BH-1 to BH-8 and GH-1 to GH-6. Learn how to apply for official weekend home passes on UMS and adhere to the 8:30 PM gate turnstile policy.",
      icon: BedDouble,
      bg: "bg-[#FFAEBC]"
    },
    {
      title: "Dining, Mess Timings & Uni-Mall",
      badge: "Food & Daily Needs",
      desc: "Full overview of the 4-meal residential student mess schedule, along with brand food courts (Domino's, Subway), stationery, laundry, banking, and courier hubs inside Uni-Mall.",
      icon: UtensilsCrossed,
      bg: "bg-[#BFFCC6]"
    },
    {
      title: "24/7 Uni-Hospital & Anti-Ragging Cell",
      badge: "Emergency Care",
      desc: "Immediate access to round-the-clock doctors, in-house pharmacy, and ambulance service at Block 30, coupled with UGC zero-tolerance anti-ragging security hotlines.",
      icon: HeartPulse,
      bg: "bg-[#FFABAB]"
    }
  ];

  const highlights = [
    {
      number: "600+",
      label: "Acres of High-Tech Campus",
      desc: "Sprawling infrastructure housing over 30,000 students from 50+ countries."
    },
    {
      number: "15 Days",
      label: "Complete Freshmen Checklist",
      desc: "Curated sequence of onboarding tasks to transition smoothly into campus life."
    },
    {
      number: "24/7",
      label: "Medical & Safety Network",
      desc: "Resident medical officers, ambulances, and motorized security patrolling."
    },
    {
      number: "100%",
      label: "Verified Campus Resources",
      desc: "Sourced directly from official university notices, DSW, and UMS circulars."
    }
  ];

  const studentSteps = [
    {
      step: "01",
      title: "Physical Reporting at Block 32",
      detail: "Arrive at the central administrative block with your provisional admission letter, original certificates, passport photographs, and fee vouchers."
    },
    {
      step: "02",
      title: "Biometric Turnstile & ID Generation",
      detail: "Complete your digital portrait capture and fingerprint registration for official RFID access to hostels, library reading halls, and academic labs."
    },
    {
      step: "03",
      title: "Hostel Room Allotment",
      detail: "Report to your designated Boys (BH) or Girls (GH) hostel warden office. Receive your room keys, inventory checklist, and mess biometric token."
    },
    {
      step: "04",
      title: "UMS Account Setup & Timetables",
      detail: "Log in to ums.lpu.in with your 8-digit registration number. Set up recovery questions, review your weekly course timetable, and verify mentor allocation."
    }
  ];

  return (
    <div className="space-y-24 py-8">
      {/* SECTION 1: HERO OVERVIEW */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-14 shadow-neo-xl text-center">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border-4 border-black bg-lpu-yellow" />
        <div className="absolute -left-8 -bottom-8 h-28 w-28 rotate-12 border-4 border-black bg-lpu-orange" />

        <div className="relative z-10 flex flex-col items-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-lpu-yellow px-4 py-1.5 text-xs font-black uppercase text-black shadow-neo-sm">
            <Flame className="h-4 w-4 text-lpu-orange" />
            <span>Lovely Professional University • Official Freshmen Portal</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-4 border-black bg-white shadow-neo">
              <Image 
                src="/lpu-logo.png" 
                alt="LPU Official Logo" 
                fill 
                sizes="112px"
                className="object-contain p-1" 
                priority
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                LPU Freshman <span className="bg-lpu-orange text-white px-3 py-0.5 border-4 border-black shadow-neo-sm inline-block">Guide</span>
              </h1>
              <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-black/80">
                Your Complete In-App Campus Companion &amp; Orientation System
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base font-semibold text-black leading-relaxed max-w-2xl bg-lpu-soft/60 p-5 border-3 border-black rounded-xl shadow-neo-sm text-center">
            Welcome to Lovely Professional University! This all-in-one portal provides everything you need to navigate your first weeks on campus: verified 15-day onboarding milestones, interactive 3D campus navigation across 600+ acres, academics and UMS guidelines, hostel rules, dining options, and safety emergency contacts.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="btn btn-yellow w-full sm:w-auto flex-1 text-sm sm:text-base py-3.5 justify-center shadow-neo font-black"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Create Account</span>
            </Link>

            <Link 
              href="/login" 
              className="btn btn-white w-full sm:w-auto flex-1 text-sm sm:text-base py-3.5 justify-center shadow-neo font-black"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span>Log In</span>
            </Link>
          </div>

          <div className="text-xs font-bold text-black/70 flex items-center gap-1.5 pt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Sign in to unlock interactive checklists, 3D campus maps, and complete guides.</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: CAMPUS BY THE NUMBERS */}
      <section className="space-y-6">
        <div className="border-b-4 border-black pb-3">
          <h2 className="text-2xl font-black uppercase text-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-lpu-orange" />
            <span>Campus Overview &amp; Key Highlights</span>
          </h2>
          <p className="text-xs font-bold text-black uppercase">
            Everything you need to know about the largest single-campus university in India
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {highlights.map((h, i) => (
            <div key={i} className="card border-4 border-black bg-white p-6 shadow-neo space-y-2 text-center w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
              <span className="text-3xl sm:text-4xl font-black text-lpu-darkOrange tracking-tight block">
                {h.number}
              </span>
              <h3 className="text-sm font-black uppercase text-black">{h.label}</h3>
              <p className="text-xs font-medium text-black/70 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CORE COMPREHENSIVE MODULES */}
      <section className="space-y-6">
        <div className="border-b-4 border-black pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase text-black tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-lpu-orange" />
              <span>Essential Freshmen Resource Hub</span>
            </h2>
            <p className="text-xs font-bold text-black uppercase">
              Native modules designed to simplify your initial weeks
            </p>
          </div>
          <span className="hidden sm:inline-block neo-badge neo-badge-yellow">
            All-In-One System
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {corePillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div 
                key={i} 
                className="card border-4 border-black bg-white p-6 shadow-neo space-y-4 flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 transition-all w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-xl border-3 border-black ${p.bg} ${p.textWhite ? "text-white" : "text-black"} shadow-neo-sm`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="neo-badge neo-badge-white text-[10px] py-0.5">{p.badge}</span>
                  </div>

                  <h3 className="text-base font-black uppercase text-black leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs font-semibold text-black/80 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-black text-lpu-darkOrange">
                  <span>UNLOCKED UPON LOGIN</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: STEP-BY-STEP FRESHMAN ORIENTATION ROADMAP */}
      <section className="space-y-6">
        <div className="border-b-4 border-black pb-3">
          <h2 className="text-2xl font-black uppercase text-black tracking-tight flex items-center gap-2">
            <Award className="h-6 w-6 text-lpu-orange" />
            <span>Orientation Day Roadmap</span>
          </h2>
          <p className="text-xs font-bold text-black uppercase">
            What every freshman must accomplish on day one of arriving at LPU
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {studentSteps.map((s, idx) => (
            <div key={idx} className="card border-4 border-black bg-white p-6 shadow-neo space-y-3 relative overflow-hidden w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
              <span className="text-3xl font-black text-black/15 absolute right-4 top-2">
                {s.step}
              </span>
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg border-2 border-black bg-lpu-yellow text-xs font-black text-black shadow-neo-sm">
                {s.step}
              </div>
              <h3 className="text-sm font-black uppercase text-black leading-snug">{s.title}</h3>
              <p className="text-xs font-medium text-black/80 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <section id="faq" className="scroll-mt-24 space-y-6">
        <FaqSection items={faqList} />
      </section>

      {/* SECTION 6: BOTTOM CONVERSION CTA BANNER */}
      <section className="card border-4 border-black bg-lpu-yellow p-8 sm:p-12 shadow-neo-xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-black tracking-tight">
            Ready to Begin Your LPU Journey?
          </h2>
          <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed">
            Create your free student account now with email OTP verification. Unlock your personalized 15-day task checklist, 3D interactive campus maps, academic guides, and campus dining schedules.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/signup" className="btn btn-black text-xs sm:text-sm px-8 py-3.5 shadow-neo font-black">
            <span>Get Started &amp; Register</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
          <Link href="/login" className="btn btn-white text-xs sm:text-sm px-8 py-3.5 shadow-neo font-black">
            <span>Sign In to Your Account</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
