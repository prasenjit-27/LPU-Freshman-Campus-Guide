"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AuthForm({ mode = "login", adminNotice = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setBusy(true);

    const f = Object.fromEntries(new FormData(e.currentTarget));
    const email = (f.email || "").trim().toLowerCase();
    const password = f.password || "";
    const name = (f.name || "").trim();

    if (mode === "signup") {
      try {
        const r = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await r.json();
        if (!r.ok) {
          setErr(data.error || "Failed to create account.");
          setBusy(false);
          return;
        }
        setSuccess("Account created successfully! Logging you in...");
      } catch {
        setErr("Network error. Please try again.");
        setBusy(false);
        return;
      }
    }

    try {
      const r = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setBusy(false);

      if (r?.error) {
        setErr(r.error === "Account has been deactivated. Please contact an administrator." 
          ? r.error 
          : "Invalid email or password. Please check your credentials.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setBusy(false);
      setErr("An unexpected error occurred during sign in.");
    }
  }

  return (
    <div className="mx-auto max-w-md w-full">
      <form onSubmit={submit} className="card shadow-lg border border-slate-200/80 p-6 sm:p-8 space-y-4">
        {adminNotice && (
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold">Administrator Authentication Required</p>
              <p className="mt-0.5 text-amber-700">Access to the Admin Management Panel is restricted to verified administrative personnel.</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {mode === "signup" ? <UserPlus className="h-3.5 w-3.5" /> : <LogIn className="h-3.5 w-3.5" />}
            {mode === "signup" ? "New Student Registration" : "Student & Staff Portal"}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === "signup" ? "Create your Guide account" : "Log in to your account"}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === "signup" 
              ? "Track your first 15 days onboarding, save campus spots, and customize your experience." 
              : "Enter your credentials to access your student dashboard and saved resources."}
          </p>
        </div>

        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Aarav Sharma"
              required
              className="input text-sm"
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. student@lpu.in or name@gmail.com"
            required
            className="input text-sm"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-xs font-medium text-slate-700">Password</label>
            {mode === "login" && (
              <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            placeholder="At least 8 characters"
            required
            className="input text-sm"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Important:</span> This is an independent guide account. Never enter your official University Management System (UMS) password.
        </div>

        {err && (
          <div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
            <span>{err}</span>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        <button type="submit" className="btn w-full justify-center py-2.5 text-sm font-semibold" disabled={busy}>
          {busy ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              {mode === "signup" ? "Create Account & Get Started" : "Sign In to Guide"}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </button>

        <div className="text-center pt-2 text-xs text-slate-600 border-t border-slate-100">
          {mode === "signup" ? (
            <p>
              Already have an account?{" "}
              <Link href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-semibold text-indigo-600 hover:underline">
                Log in here
              </Link>
            </p>
          ) : (
            <p>
              New to LPU or don't have an account?{" "}
              <Link href={`/signup${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-semibold text-indigo-600 hover:underline">
                Create free account
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
