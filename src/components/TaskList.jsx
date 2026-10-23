"use client";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Sparkles, 
  X, 
  BookOpen, 
  CheckSquare, 
  ShieldAlert, 
  ExternalLink,
  Info,
  CalendarCheck2,
  Flame,
  Zap
} from "lucide-react";
import { taskDetails } from "@/data/taskDetails";

export default function TaskList({ tasks, signedIn }) {
  const [done, setDone] = useState([]);
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [activeTabFilter, setActiveTabFilter] = useState("all");

  useEffect(() => {
    if (signedIn) {
      fetch("/api/progress")
        .then((r) => r.json())
        .then((d) => setDone(d.done || []))
        .catch(() => {});
    }
  }, [signedIn]);

  async function toggle(id, e) {
    if (e) e.stopPropagation();
    const next = !done.includes(id);
    setDone((d) => (next ? [...d, id] : d.filter((x) => x !== id)));
    try {
      const r = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id, done: next }),
      });
      if (!r.ok) {
        setDone((d) => (next ? d.filter((x) => x !== id) : [...d, id]));
      }
    } catch {
      setDone((d) => (next ? d.filter((x) => x !== id) : [...d, id]));
    }
  }

  // Filter tasks
  const stages = ["all", ...new Set(tasks.map((t) => t.stage))];
  const filteredTasks = tasks.filter((t) => 
    activeTabFilter === "all" ? true : t.stage === activeTabFilter
  );

  const completedCount = tasks.filter((t) => done.includes(t.id)).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  const currentModalDetail = activeTaskModal ? taskDetails[activeTaskModal.id] : null;

  return (
    <div className="space-y-6">
      {/* Progress Header Banner */}
      <div className="card border-4 border-black bg-white shadow-neo-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-lpu-orange text-white shadow-neo-sm">
                <CalendarCheck2 className="h-4 w-4" />
              </span>
              <h2 className="text-base font-black uppercase text-black">First 15 Days Progress</h2>
            </div>
            <p className="text-xs font-bold text-black/80">
              {completedCount} of {tasks.length} milestones finished ({progressPct}% done). Click any card for the full in-app guide!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-4 w-36 border-2 border-black bg-white rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-lpu-yellow border border-black rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="neo-badge neo-badge-yellow">{progressPct}%</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t-2 border-black">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveTabFilter(stage)}
              className={`px-3 py-1 text-xs font-black uppercase border-2 border-black rounded-md transition-all ${
                activeTabFilter === stage
                  ? "bg-lpu-orange text-white shadow-neo-sm"
                  : "bg-white text-black hover:bg-lpu-yellow shadow-neo-sm"
              }`}
            >
              {stage === "all" ? "All Milestones" : stage}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Task Cards */}
      <div className="grid gap-3.5">
        {filteredTasks.map((t) => {
          const isDone = done.includes(t.id);

          return (
            <div
              key={t.id}
              onClick={() => setActiveTaskModal(t)}
              className={`group relative flex cursor-pointer items-start justify-between rounded-xl border-3 border-black p-4 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${
                isDone 
                  ? "bg-[#E6F4EA] shadow-neo-sm" 
                  : "bg-white hover:bg-lpu-soft/30 shadow-neo"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Checkbox */}
                <button
                  type="button"
                  disabled={!signedIn}
                  onClick={(e) => toggle(t.id, e)}
                  title={signedIn ? (isDone ? "Mark incomplete" : "Mark completed") : "Log in to track progress"}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-black transition-all ${
                    isDone 
                      ? "bg-emerald-500 text-black shadow-neo-sm" 
                      : "bg-white hover:bg-lpu-yellow text-transparent shadow-neo-sm"
                  } ${!signedIn ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-black uppercase ${isDone ? "line-through text-black/50" : "text-black group-hover:text-lpu-orange"} transition-colors`}>
                      {t.title}
                    </h3>
                    <span className="neo-badge neo-badge-white text-[10px] py-0.5">
                      {t.stage}
                    </span>
                    {t.priority === "important" && (
                      <span className="neo-badge neo-badge-orange text-[10px] py-0.5">
                        High Priority
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-black/80 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="pt-1 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-lpu-darkOrange group-hover:underline">
                      <BookOpen className="h-3 w-3" />
                      <span>Read Guide &amp; Details</span>
                    </span>

                    {t.source && (
                      <span className="text-[11px] font-medium text-black/60">
                        • Verified from {t.source.sourceName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center pl-3 text-black group-hover:text-lpu-orange transition-colors">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {!signedIn && (
        <div className="rounded-xl border-3 border-black bg-lpu-yellow p-3.5 text-center text-xs font-bold text-black shadow-neo">
          💡 <strong>Tip:</strong> Create a free student account or log in to track your personal completion progress across your devices.
        </div>
      )}

      {/* In-App Native Detail Modal */}
      {activeTaskModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-100"
          onClick={() => setActiveTaskModal(null)}
        >
          <div 
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border-4 border-black bg-white shadow-neo-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-3 border-black bg-lpu-orange px-6 py-4 text-white">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 rounded border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase text-black shadow-neo-sm">
                  <Flame className="h-3 w-3 text-lpu-orange" />
                  <span>{currentModalDetail?.badge || activeTaskModal.stage}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white drop-shadow-sm">
                  {currentModalDetail?.title || activeTaskModal.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveTaskModal(null)}
                className="rounded-lg border-2 border-black bg-white p-1 text-black shadow-neo-sm hover:bg-lpu-yellow transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body with Rich In-App Content */}
            <div className="overflow-y-auto p-6 space-y-6 text-black text-sm leading-relaxed">
              {currentModalDetail?.summary && (
                <div className="rounded-xl border-3 border-black bg-lpu-soft p-4 text-xs sm:text-sm text-black font-bold shadow-neo-sm">
                  {currentModalDetail.summary}
                </div>
              )}

              {currentModalDetail?.sections?.map((sec, idx) => (
                <div key={idx} className="space-y-2.5 border-b-2 border-black pb-5 last:border-b-0 last:pb-0">
                  <h4 className="text-sm font-black uppercase text-black flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-lpu-orange border border-black" />
                    {sec.heading}
                  </h4>

                  {sec.content && (
                    <p className="text-xs sm:text-sm font-medium text-black/80 leading-relaxed pl-4">
                      {sec.content}
                    </p>
                  )}

                  {sec.type === "list" && (
                    <ul className="space-y-2 pl-4 text-xs sm:text-sm font-semibold text-black">
                      {sec.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-lpu-orange font-black">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.type === "checklist" && (
                    <div className="grid gap-2 pl-2">
                      {sec.items.map((it, i) => (
                        <div key={i} className="flex items-start gap-2.5 rounded-lg border-2 border-black bg-white p-2.5 shadow-neo-sm text-xs sm:text-sm font-bold text-black">
                          <CheckSquare className="h-4 w-4 text-lpu-orange shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.type === "tips" && (
                    <div className="rounded-xl border-3 border-black bg-lpu-yellow p-3.5 space-y-2 shadow-neo-sm">
                      {sec.items.map((tip, i) => (
                        <p key={i} className="text-xs font-bold text-black flex items-start gap-2">
                          <span className="font-black text-lpu-darkOrange">★</span>
                          <span>{tip}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Source attribution footnote */}
              {activeTaskModal.source && (
                <div className="pt-2 border-t-2 border-black flex flex-wrap items-center justify-between text-[11px] font-bold text-black/60">
                  <span>Compiled for Lovely Professional University Freshmen.</span>
                  <a
                    href={activeTaskModal.source.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-black hover:text-lpu-orange underline"
                  >
                    <span>External Source ({activeTaskModal.source.sourceName})</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t-3 border-black bg-[#FFFDF9] px-6 py-3.5">
              <span className="text-xs font-bold text-black">
                {done.includes(activeTaskModal.id) ? "✓ Completed" : "Pending milestone"}
              </span>

              <div className="flex gap-2">
                {signedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      toggle(activeTaskModal.id);
                    }}
                    className={`btn text-xs px-4 py-2 ${
                      done.includes(activeTaskModal.id)
                        ? "btn-white"
                        : "btn-yellow"
                    }`}
                  >
                    {done.includes(activeTaskModal.id) ? "Mark Incomplete" : "Mark Finished"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTaskModal(null)}
                  className="btn btn-black text-xs px-4 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
