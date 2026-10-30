"use client";
import { useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfileForm({ initial }) {
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setIsError(false);
    setSaving(true);

    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setSaving(false);
      if (r.ok) {
        setMsg("Profile saved successfully!");
      } else {
        setIsError(true);
        setMsg("Could not save profile. Check your entries.");
      }
    } catch {
      setSaving(false);
      setIsError(true);
      setMsg("Network error. Please try again.");
    }
  }

  const f = (n, l) => (
    <div key={n} className="space-y-1">
      <label htmlFor={n} className="block text-xs font-black uppercase tracking-wider text-black">
        {l}
      </label>
      <input
        id={n}
        name={n}
        defaultValue={initial[n] || ""}
        className="input text-xs sm:text-sm bg-white"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="card border-4 border-black bg-white shadow-neo-xl p-6 sm:p-8 space-y-4">
        {f("programme", "Programme")}
        {f("school", "School or department")}
        {f("year", "Year of study")}
        {f("interests", "Interests")}

        <div className="space-y-1">
          <label htmlFor="accommodation" className="block text-xs font-black uppercase tracking-wider text-black">
            Accommodation
          </label>
          <select
            id="accommodation"
            name="accommodation"
            defaultValue={initial.accommodation || ""}
            className="input text-xs sm:text-sm bg-white"
          >
            <option value="">Not set</option>
            <option value="hostel">Hostel</option>
            <option value="off-campus">Off-campus</option>
            <option value="day-scholar">Day scholar</option>
          </select>
        </div>

        {msg && (
          <div
            role="status"
            className={`flex items-center gap-2 rounded-lg border-2 border-black p-3 text-xs font-bold shadow-neo-sm ${
              isError ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isError ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
            <span>{msg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn btn-yellow w-full text-xs sm:text-sm py-3 justify-center shadow-neo font-black"
        >
          {saving ? "Saving Profile..." : "Save Profile"}
        </button>
      </form>

      {/* Account Security / Reset Password Card */}
      <div className="card border-4 border-black bg-white shadow-neo-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-lpu-yellow text-black shadow-neo-sm">
            <KeyRound className="h-5 w-5 text-lpu-orange" />
          </span>
          <div>
            <h3 className="text-sm font-black uppercase text-black">Account Password</h3>
            <p className="text-xs font-medium text-black/70">
              Need to change your account password? Request a secure reset link.
            </p>
          </div>
        </div>

        <Link
          href="/forgot-password"
          className="btn btn-white text-xs px-4 py-2 shrink-0 font-black"
        >
          Reset Password →
        </Link>
      </div>
    </div>
  );
}
