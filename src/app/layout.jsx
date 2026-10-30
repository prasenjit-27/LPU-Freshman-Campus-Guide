import "./globals.css";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Nav from "@/components/Nav";
import Link from "next/link";
import { 
  ExternalLink, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  GraduationCap, 
  Building2, 
  HeartHandshake,
  Globe
} from "lucide-react";
import { sources } from "@/data/sources";

export const metadata = {
  title: "LPU Freshman Guide — Official Neo Student Companion",
  description: "An independent, verified campus guide, map, directory, and onboarding portal for Lovely Professional University freshmen.",
  icons: {
    icon: "/lpu-logo.png",
  }
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions).catch(() => null);

  const officialLinks = [
    { name: "University Management System (UMS)", url: sources.ums.sourceUrl },
    { name: "Freshmen Induction Portal", url: sources.induction.sourceUrl },
    { name: "Official Reporting Guidelines", url: sources.reporting.sourceUrl },
    { name: "What To Bring Checklist", url: sources.bring.sourceUrl },
    { name: "Academic Calendars", url: sources.calendar.sourceUrl },
    { name: "Central Libraries Portal", url: sources.libraries.sourceUrl },
    { name: "Hostel Residence Services", url: sources.residence.sourceUrl },
    { name: "Shopping & Dining Directory", url: sources.dining.sourceUrl },
    { name: "Campus Transport & Shuttles", url: sources.transport.sourceUrl },
    { name: "Campus Security Office", url: sources.security.sourceUrl },
    { name: "Uni-Hospital Healthcare", url: sources.healthcare.sourceUrl },
    { name: "UGC Anti-Ragging Cell", url: sources.antiragging.sourceUrl },
    { name: "Official Contact Directory", url: sources.contact.sourceUrl },
    { name: "LPU Happenings News", url: sources.happenings.sourceUrl },
    { name: "Official University Homepage", url: "https://www.lpu.in" },
  ];

  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-[#FFFDF9] text-black antialiased selection:bg-lpu-yellow selection:text-black">
        <Nav user={session?.user || null} />
        
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 md:py-8">
          {children}
        </main>

        {/* Rich Neo-Brutalist Footer With All Official Links */}
        <footer className="border-t-4 border-black bg-white pt-12 pb-8 text-xs text-black">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
            {/* Top Brand & Emergency Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-black/20">
              <div className="flex items-center gap-3.5">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-black bg-white shadow-neo-sm">
                  <Image 
                    src="/lpu-logo.png" 
                    alt="LPU Official Logo" 
                    fill 
                    sizes="48px"
                    className="object-contain p-0.5" 
                  />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-sm text-black">
                    Lovely Professional University • Freshman Guide
                  </h3>
                  <p className="text-[11px] font-bold text-black/60">
                    Empowering incoming students with verified navigation, rules &amp; resources.
                  </p>
                </div>
              </div>

              {/* Emergency Hotline Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 border-2 border-black rounded-lg text-[11px] font-black text-rose-800 shadow-neo-sm">
                  <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
                  <span>Uni-Hospital: 01824-517000</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border-2 border-black rounded-lg text-[11px] font-black text-amber-900 shadow-neo-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                  <span>Anti-Ragging: 1800-180-5522</span>
                </div>
              </div>
            </div>

            {/* Official University Directory Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black uppercase text-xs tracking-wider text-black flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-lpu-orange" />
                  <span>Official University Websites &amp; Administrative Links</span>
                </h4>
                <span className="neo-badge neo-badge-yellow text-[9px] py-0.5">Verified Sourced</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
                {officialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-lpu-soft/30 hover:bg-lpu-yellow hover:shadow-neo-sm transition-all w-full sm:w-[calc(50%-0.625rem)] md:w-[calc(33.333%-0.625rem)] lg:w-[calc(25%-0.625rem)]"
                  >
                    <span className="font-bold text-[11px] text-black truncate pr-2 group-hover:underline">
                      {link.name}
                    </span>
                    <ExternalLink className="h-3 w-3 shrink-0 text-black/60 group-hover:text-black transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom Copyright & Disclaimer */}
            <div className="pt-6 border-t-2 border-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-semibold text-black/60">
              <p>
                © {new Date().getFullYear()} LPU Freshman Guide • Designed for Lovely Professional University Students.
              </p>
              <p>
                Independent student-first initiative. All official portal actions, grades, and registrations remain on <a href="https://ums.lpu.in/lpuums/" target="_blank" rel="noreferrer" className="underline font-bold text-black">UMS</a>.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
