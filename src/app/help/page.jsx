import Image from "next/image";
import { safeFind } from "@/lib/mongodb";
import { defaultFaqs } from "@/data/faqsData";
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2,
  LifeBuoy,
  Flame,
  Zap
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Help({ searchParams }) {
  const q = (searchParams?.q || "").toString().slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  const dbItems = await safeFind(
    "faqs", 
    q ? { $or: [{ question: { $regex: q, $options: "i" } }, { category: { $regex: q, $options: "i" } }] } : {}
  );

  const items = dbItems.length > 0 ? dbItems : defaultFaqs.filter((f) => {
    if (!q) return true;
    return (
      f.question.toLowerCase().includes(q.toLowerCase()) || 
      f.category.toLowerCase().includes(q.toLowerCase()) ||
      f.answer.toLowerCase().includes(q.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 py-2">
      {/* Neo-Brutalist Header Banner with Official LPU Logo */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-xl">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-black bg-lpu-yellow" />
        
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
              <span>Student Support Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Frequently Asked Questions &amp; Answers
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-2xl leading-relaxed">
              Get instant answers to all common questions regarding reporting, hostel curfews, UMS setup, medical services, and academics.
            </p>
          </div>
        </div>
      </section>

      {/* Neo Search Input Bar */}
      {/* FAQ Accordions */}
      <div className="space-y-3.5">
        {items.map((f, idx) => (
          <details 
            key={f._id || idx} 
            className="group card border-3 border-black p-5 shadow-neo transition-all open:bg-lpu-soft/30 open:shadow-neo-lg"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-black uppercase text-black text-sm">
              <div className="flex items-center gap-3 pr-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-black bg-lpu-yellow text-xs font-black text-black shrink-0 shadow-neo-sm">
                  ?
                </span>
                <span>{f.question}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block neo-badge neo-badge-white text-[10px] py-0.5">
                  {f.category}
                </span>
                <ChevronDown className="h-5 w-5 text-black transition-transform group-open:rotate-180" />
              </div>
            </summary>

            <div className="mt-3.5 border-t-2 border-black pt-3.5 text-xs sm:text-sm font-semibold text-black/90 leading-relaxed pl-9">
              <p>{f.answer}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-black/60">
                <span>Category: {f.category}</span>
                <span>Source: {f.sourceName || "Freshman Guide Handbook"}</span>
              </div>
            </div>
          </details>
        ))}

        {items.length === 0 && (
          <div className="card border-3 border-black bg-white p-8 text-center space-y-2 shadow-neo">
            <p className="text-sm font-black uppercase text-black">No matching FAQ found</p>
            <p className="text-xs font-bold text-black/60">Try searching for keywords like &quot;attendance&quot;, &quot;UMS&quot;, &quot;hostel&quot;, or &quot;curfew&quot;.</p>
          </div>
        )}
      </div>
    </div>
  );
}
