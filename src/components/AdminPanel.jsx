"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const common = [["sourceName", "Source name"], ["sourceUrl", "Source URL"]];
const defs = {
  locations: [["name", "Name"], ["category", "Category"], ["description", "Description"], ["lat", "Latitude"], ["lng", "Longitude"], ...common],
  announcements: [["title", "Title"], ["summary", "Summary"], ["content", "Content"], ["category", "Category"], ["expiresAt", "Expires (YYYY-MM-DD)"], ...common],
  events: [["name", "Name"], ["description", "Description"], ["startsAt", "Starts (YYYY-MM-DDTHH:mm)"], ["endsAt", "Ends"], ["venue", "Venue"], ["category", "Category"], ["registrationUrl", "Registration URL"], ...common],
  faqs: [["question", "Question"], ["answer", "Answer"], ["category", "Category"], ...common],
};
export default function AdminPanel({ type, rows }) {
  const [msg, setMsg] = useState("");
  const router = useRouter();
  async function submit(e) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(`/api/admin/${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) { e.target.reset(); router.refresh(); setMsg("Saved."); } else setMsg((await r.json()).error);
  }
  async function del(id) {
    if (!confirm("Delete this item?")) return;
    const r = await fetch(`/api/admin/${type}?id=${id}`, { method: "DELETE" });
    if (r.ok) router.refresh(); else setMsg("Delete failed.");
  }
  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold capitalize">{type}</h2>
      <form onSubmit={submit} className="grid gap-2 md:grid-cols-2">
        {defs[type].map(([n, l]) => <div key={n}><label htmlFor={`${type}-${n}`} className="text-xs">{l}</label><input id={`${type}-${n}`} name={n} className="input" /></div>)}
        <div><label htmlFor={`${type}-v`} className="text-xs">Status</label><select id={`${type}-v`} name="verificationStatus" className="input"><option value="needs_review">needs_review</option><option value="verified">verified</option><option value="unverified">unverified</option></select></div>
        <div className="flex items-end"><button className="btn">Add</button></div>
      </form>
      {msg && <p role="status" className="text-sm">{msg}</p>}
      <ul className="text-sm">{rows.map((r) => <li key={r._id} className="flex justify-between border-t py-1">{r.name || r.title || r.question}<button className="text-red-600 underline" onClick={() => del(r._id)}>Delete</button></li>)}</ul>
    </section>
  );
}
