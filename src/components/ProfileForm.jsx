"use client";
import { useState } from "react";
export default function ProfileForm({ initial }) {
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
    setMsg(r.ok ? "Saved." : "Could not save. Check your entries.");
  }
  const f = (n, l) => <div key={n}><label htmlFor={n} className="text-sm">{l}</label><input id={n} name={n} defaultValue={initial[n] || ""} className="input" /></div>;
  return (
    <form onSubmit={submit} className="card max-w-lg space-y-3">
      {f("programme", "Programme")}{f("school", "School or department")}{f("year", "Year of study")}{f("interests", "Interests")}
      <div><label htmlFor="accommodation" className="text-sm">Accommodation</label>
        <select id="accommodation" name="accommodation" defaultValue={initial.accommodation || ""} className="input"><option value="">Not set</option><option value="hostel">Hostel</option><option value="off-campus">Off-campus</option><option value="day-scholar">Day scholar</option></select></div>
      <button className="btn">Save profile</button>{msg && <p role="status" className="text-sm">{msg}</p>}
    </form>
  );
}
