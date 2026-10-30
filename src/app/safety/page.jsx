import Image from "next/image";
import { sources as s } from "@/data/sources";
import { 
  ShieldAlert, 
  HeartPulse, 
  PhoneCall, 
  Building2, 
  AlertTriangle, 
  Lock, 
  ExternalLink,
  ShieldCheck,
  Flame,
  Zap
} from "lucide-react";

export default function Safety() {
  const emergencyProtocols = [
    {
      title: "Uni-Hospital (Medical Centre - Block 30)",
      badge: "24/7 Medical Care",
      icon: HeartPulse,
      bg: "bg-[#FFAEBC]",
      desc: "Round-the-clock medical attention, doctors, casualty wards, and immediate patient stabilization.",
      points: [
        "24/7 Resident Medical Officers (RMOs) and registered nursing staff on duty.",
        "Dedicated observation beds, nebulization, minor OT dressings, and emergency IV drips.",
        "On-campus emergency ambulances stationed 24/7 at Block 30 for hospital transfers.",
        "Fully stocked in-house pharmacy providing basic emergency medications."
      ]
    },
    {
      title: "Anti-Ragging Protocol & Zero Tolerance",
      badge: "Strictly Enforced",
      icon: ShieldAlert,
      bg: "bg-lpu-yellow",
      desc: "Ragging in any form (verbal, psychological, physical, or online) is a cognizable criminal offence.",
      points: [
        "National Anti-Ragging 24x7 Toll Free Helpline: 1800-180-5522.",
        "Anti-Ragging Official Email: helpline@antiragging.in",
        "Division of Student Welfare (DSW) Office in Block 30/32 coordinates rapid anti-ragging squad patrols.",
        "Disciplinary actions include immediate suspension, eviction from hostel, academic degree withholding, and lodging of police FIR."
      ]
    },
    {
      title: "Campus Security & Night Patrols",
      badge: "Campus Watch",
      icon: Lock,
      bg: "bg-[#A0E7E5]",
      desc: "Multi-layered perimeter security, gate monitoring, and 4,000+ CCTV camera network.",
      points: [
        "Main Security Control Room operates 24/7 at Gate 1 and Gate 2.",
        "Automated biometric and RFID turnstile barriers at all hostel and campus access points.",
        "Quick Response Teams (QRT) conduct regular round-the-clock motorized patrolling across residential and academic streets.",
        "Female security officers and student escorts stationed across all girls' hostels and common walkways."
      ]
    },
    {
      title: "Campus Emergency Procedures",
      badge: "Action Plan",
      icon: AlertTriangle,
      bg: "bg-[#BFFCC6]",
      desc: "What to do immediately in case of an accident, fire, or acute medical issue.",
      points: [
        "In Hostel: Immediately alert the floor warden, caretaker, or security guard on duty.",
        "In Academic Blocks: Notify the nearest floor proctor, faculty member, or security kiosk.",
        "For national police, fire, or general emergency: Call 112 (National Unified Emergency Number)."
      ]
    }
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Neo-Brutalist Safety Header Banner with Official LPU Logo */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-xl">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-black bg-lpu-orange" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
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

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded border-2 border-black bg-lpu-yellow px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-neo-sm">
              <Flame className="h-3.5 w-3.5 text-lpu-orange" />
              <span>Campus Wellbeing &amp; Safety</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Safety, Healthcare &amp; Emergency Hub
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-2xl leading-relaxed">
              Essential procedures, 24/7 medical guidelines, and zero-tolerance anti-ragging measures for all university students.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {emergencyProtocols.map((proto, idx) => {
          const Icon = proto.icon;
          return (
            <div key={idx} className="card border-3 border-black p-6 shadow-neo space-y-4 flex flex-col justify-between w-full md:w-[calc(50%-0.75rem)]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black ${proto.bg} text-black shadow-neo-sm`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-black uppercase text-black">{proto.title}</h2>
                      <span className="neo-badge neo-badge-white text-[9px] py-0.2">{proto.badge}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-black/80 leading-relaxed">
                  {proto.desc}
                </p>

                <div className="rounded-xl border-2 border-black bg-lpu-soft/40 p-4 space-y-2 shadow-neo-sm">
                  {proto.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs font-bold text-black">
                      <span className="text-lpu-orange font-black">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Links Neo Banner */}
      <div className="rounded-xl border-3 border-black bg-lpu-yellow p-5 space-y-3 shadow-neo">
        <h3 className="text-xs font-black uppercase text-black">Official University Safety Portals</h3>
        <p className="text-xs font-bold text-black/80">
          Official administrative safety and anti-ragging policies on the official university portal:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <a href={s.antiragging.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-white text-xs px-3 py-1.5">
            <span>Anti-Ragging Portal</span>
            <ExternalLink className="h-3 w-3 ml-1 text-black" />
          </a>
          <a href={s.healthcare.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-white text-xs px-3 py-1.5">
            <span>Healthcare Services</span>
            <ExternalLink className="h-3 w-3 ml-1 text-black" />
          </a>
          <a href={s.security.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-white text-xs px-3 py-1.5">
            <span>Campus Security</span>
            <ExternalLink className="h-3 w-3 ml-1 text-black" />
          </a>
        </div>
      </div>
    </div>
  );
}
