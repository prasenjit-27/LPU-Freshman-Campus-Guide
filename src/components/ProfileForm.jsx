"use client";
import { useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ProfileForm({ initial }) {
  // Profile update states
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Password reset / change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState(false);
  const [passSaving, setPassSaving] = useState(false);

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

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPassMsg("");
    setPassError(false);

    if (!currentPassword) {
      setPassError(true);
      setPassMsg("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setPassError(true);
      setPassMsg("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError(true);
      setPassMsg("New password and confirmation do not match.");
      return;
    }

    setPassSaving(true);
    try {
      const r = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await r.json();
      setPassSaving(false);

      if (r.ok) {
        setPassMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setPassError(true);
        setPassMsg(data.error || "Failed to update password.");
      }
    } catch {
      setPassSaving(false);
      setPassError(true);
      setPassMsg("Network error. Please try again.");
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
    <div className="space-y-6">
      {/* 1. Academic & Personal Profile Form */}
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
          className="btn btn-yellow w-full text-xs sm:text-sm py-3 justify-center shadow-neo font-black cursor-pointer"
        >
          {saving ? "Saving Profile..." : "Save Profile"}
        </button>
      </form>

      {/* 2. Account Security & Password Reset Section */}
      <div className="card border-4 border-black bg-white shadow-neo-xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-lpu-yellow text-black shadow-neo-sm">
              <KeyRound className="h-5 w-5 text-lpu-orange" />
            </span>
            <div>
              <h3 className="text-base font-black uppercase text-black">Account Security</h3>
              <p className="text-xs font-semibold text-black/70">
                Change your account password securely using your current password.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setPassMsg("");
              setPassError(false);
            }}
            className="btn btn-white text-xs px-4 py-2 shrink-0 font-black cursor-pointer shadow-neo-sm"
          >
            {showPasswordForm ? "Close Form" : "Reset Password"}
          </button>
        </div>

        {/* Embedded In-Place Password Reset Form */}
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
            {passMsg && (
              <div
                role="status"
                className={`flex items-center gap-2 rounded-lg border-2 border-black p-3 text-xs font-black shadow-neo-sm ${
                  passError ? "bg-rose-100 text-rose-900" : "bg-emerald-100 text-emerald-950"
                }`}
              >
                {passError ? <AlertCircle className="h-4 w-4 shrink-0 text-rose-700" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />}
                <span>{passMsg}</span>
              </div>
            )}

            {/* Current Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Enter Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="input text-xs sm:text-sm bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black cursor-pointer"
                  tabIndex={-1}
                >
                  {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Enter New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  className="input text-xs sm:text-sm bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Confirm New Password
              </label>
              <input
                type={showNewPass ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="input text-xs sm:text-sm bg-white"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-black/60">
                Forgot current password?{" "}
                <Link href="/forgot-password" className="text-lpu-darkOrange underline font-bold">
                  Send reset email
                </Link>
              </span>

              <button
                type="submit"
                disabled={passSaving}
                className="btn btn-yellow text-xs font-black py-2.5 px-5 shadow-neo cursor-pointer"
              >
                {passSaving ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
