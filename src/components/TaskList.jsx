"use client";
import { useEffect, useState } from "react";
export default function TaskList({ tasks, signedIn }) {
  const [done, setDone] = useState([]);
  useEffect(() => { if (signedIn) fetch("/api/progress").then((r) => r.json()).then((d) => setDone(d.done || [])); }, [signedIn]);
  async function toggle(id) {
    const next = !done.includes(id);
    setDone((d) => (next ? [...d, id] : d.filter((x) => x !== id)));
    const r = await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: id, done: next }) });
    if (!r.ok) setDone((d) => (next ? d.filter((x) => x !== id) : [...d, id]));
  }
  return (
    <ul className="space-y-3">
      {tasks.map((t) => (
        <li key={t.id} className="card">
          <label className="flex items-start gap-3">
            <input type="checkbox" disabled={!signedIn} checked={done.includes(t.id)} onChange={() => toggle(t.id)} className="mt-1" />
            <span><b>{t.title}</b> <span className="text-xs text-slate-500">· {t.stage} · {t.priority}</span><br /><span className="text-sm text-slate-600">{t.description}</span><br />
              <a className="text-xs underline" href={t.source.sourceUrl} target="_blank" rel="noreferrer">{t.source.sourceName}</a></span>
          </label>
        </li>))}
      {!signedIn && <li className="text-sm text-slate-600">Log in to save your progress.</li>}
    </ul>
  );
}
