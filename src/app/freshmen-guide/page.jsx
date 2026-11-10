import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { tasks } from "@/data/tasks";
import TaskList from "@/components/TaskList";
import { CalendarCheck2, Flame } from "lucide-react";

export default async function Guide() {
  const s = await getServerSession(authOptions).catch(() => null);
  
  return (
    <div className="space-y-8 py-2">
      {/* Neo-Brutalist Header Banner with Official LPU Logo */}
      <section className="relative overflow-hidden rounded-2xl border-4 border-black bg-white p-6 sm:p-10 shadow-neo-xl">
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
              <span>Induction &amp; Onboarding</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Your First 15 Days Checklist
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-2xl leading-relaxed">
              Complete suggested onboarding milestones for freshmen at Lovely Professional University. Click any card to read detailed instructions.
            </p>
          </div>
        </div>
      </section>

      <TaskList tasks={tasks} signedIn={!!s} />
    </div>
  );
}
