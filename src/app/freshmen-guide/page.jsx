import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { tasks } from "@/data/tasks";
import TaskList from "@/components/TaskList";
export default async function Guide() {
  const s = await getServerSession(authOptions).catch(() => null);
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Your first 15 days</h1>
    <p className="text-sm text-slate-600">Suggested steps. Only the official LPU pages define what is mandatory.</p>
    <TaskList tasks={tasks} signedIn={!!s} /></div>);
}
