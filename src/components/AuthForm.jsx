"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus, ShieldAlert, ArrowRight, CheckCircle2, Flame } from "lucide-react";

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
      setErr("Failed to sign in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md w-full py-4">
      <form onSubmit={submit} className="card border-4 border-black bg-white shadow-neo-xl p-6 sm:p-8 space-y-4">
        {/* Brand header */}
        <div className="flex items-center gap-3 pb-3 border-b-2 border-black">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-black bg-white shadow-neo-sm">
            <Image 
              src="/lpu-logo.png" 
              alt="LPU Official Logo" 
              fill 
              sizes="48px"
              className="object-contain p-0.5" 
              priority
            />
          </div>
          <div>
            <span className="neo-badge neo-badge-yellow text-[10px]">
              {mode === "signup" ? "New Student Registration" : "Student Login"}
            </span>
            <h1 className="text-xl font-black uppercase text-black tracking-tight mt-0.5">
              {mode === "signup" ? "Join LPU Guide" : "Welcome Back"}
            </h1>
          </div>
        </div>

        {adminNotice && (
          <div className="flex items-start gap-2.5 rounded-lg border-2 border-black bg-lpu-yellow p-3.5 text-xs font-bold text-black shadow-neo-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-black mt-0.5" />
            <div>
              <p className="font-black uppercase">Admin Auth Required</p>
              <p className="mt-0.5 text-black/80">Access to the Admin Management Panel is restricted to authorized personnel.</p>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="block text-xs font-black uppercase text-black mb-1">Full Name</label>
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
          <label htmlFor="email" className="block text-xs font-black uppercase text-black mb-1">Email Address</label>
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
            <label htmlFor="password" className="block text-xs font-black uppercase text-black">Password</label>
            {mode === "login" && (
              <Link href="/forgot-password" className="text-xs font-bold text-lpu-darkOrange underline">
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

        <div className="rounded-lg border-2 border-black bg-lpu-soft/60 p-3 text-xs font-bold text-black shadow-neo-sm">
          <span>Note:</span> This is an independent guide account. Never enter your official University Management System (UMS) password.
        </div>

        {err && (
          <div role="alert" className="flex items-center gap-2 rounded-lg border-2 border-black bg-rose-100 p-3 text-xs font-bold text-black shadow-neo-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{err}</span>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-2 rounded-lg border-2 border-black bg-emerald-100 p-3 text-xs font-bold text-black shadow-neo-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>{success}</span>
          </div>
        )}

        <button type="submit" className="btn btn-yellow w-full justify-center py-2.5 text-xs font-black" disabled={busy}>
          {busy ? (
            <span>Processing...</span>
          ) : (
            <span className="flex items-center gap-1.5">
              {mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN TO PORTAL"}
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </button>

        <div className="text-center pt-2 text-xs font-bold text-black border-t-2 border-black">
          {mode === "signup" ? (
            <p>
              Already have an account?{" "}
              <Link href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-black text-lpu-darkOrange underline">
                Log in here
              </Link>
            </p>
          ) : (
            <p>
              New to LPU or don&apos;t have an account?{" "}
              <Link href={`/signup${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-black text-lpu-darkOrange underline">
                Create free account
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
