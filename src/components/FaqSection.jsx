import { HelpCircle, ChevronDown } from "lucide-react";

export default function FaqSection({ items = [] }) {
  return (
    <div className="space-y-6">
      <div className="border-b-4 border-black pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-black flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-lpu-orange" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs font-bold text-black/70 uppercase">
            Official answers for common freshman questions about attendance, UMS, hostels, and dining
          </p>
        </div>
      </div>

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
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
            </summary>

            <div className="mt-3.5 border-t-2 border-black/30 pt-3.5 pl-9 space-y-2 text-xs font-semibold text-black leading-relaxed">
              <p>{f.answer}</p>
              
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                <span className="neo-badge neo-badge-yellow py-0.5">{f.category}</span>
                {f.sourceName && (
                  <span className="text-black/60">
                    Source: {f.sourceName}
                  </span>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

