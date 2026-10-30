"use client";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus, ShieldAlert, ArrowRight, CheckCircle2, Flame, ArrowLeft, RefreshCw } from "lucide-react";
import { loginSchema, signupSchema, verifySignupOtpSchema } from "@/lib/validation";

export default function AuthForm({ mode = "login", adminNotice = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  // 1. Handle requesting OTP for signup or direct login
  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const name = formData.name.trim();

    // Signup flow -> Validate & send Brevo OTP
    if (mode === "signup") {
      const parsed = signupSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        setErr(parsed.error.issues[0]?.message || "Please fill all fields accurately.");
        return;
      }

      setBusy(true);
      try {
        const res = await fetch("/api/auth/send-signup-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        setBusy(false);

        if (!res.ok) {
          setErr(data.error || "Failed to send verification code.");
          return;
        }

        setSuccess("Code sent successfully");
        setStep("otp");
      } catch {
        setErr("Network error. Please try again.");
        setBusy(false);
      }
      return;
    }

    // Direct Login flow -> email and password only, NO OTP required
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message || "Please enter valid email and password.");
      return;
    }

    setBusy(true);
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

  // 2. Handle OTP verification for new student account creation
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const parsed = verifySignupOtpSchema.safeParse({
      email: formData.email,
      otp,
    });

    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message || "Please enter a valid 6-digit code.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Verification failed. Please check the code.");
        setBusy(false);
        return;
      }

      setSuccess("Account verified! Logging in...");

      // Automatically sign in the newly verified account
      const loginRes = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      setBusy(false);

      if (loginRes?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setErr("Failed to verify code. Please try again.");
      setBusy(false);
    }
  }

  // 3. Resend OTP handler
  async function handleResendOtp() {
    setErr("");
    setSuccess("");
    setResending(true);
    try {
      const res = await fetch("/api/auth/send-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      setResending(false);
      if (!res.ok) {
        setErr(data.error || "Failed to resend code.");
      } else {
        setSuccess("Code sent successfully");
      }
    } catch {
      setResending(false);
      setErr("Could not resend verification email.");
    }
  }

  return (
    <div className="mx-auto max-w-md w-full py-4">
      <div className="card border-4 border-black bg-white shadow-neo-xl p-6 sm:p-8 space-y-4">
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
              {mode === "signup" 
                ? (step === "otp" ? "Email Verification" : "New Student Registration") 
                : "Student Login"}
            </span>
            <h1 className="text-xl font-black uppercase text-black tracking-tight mt-0.5">
              {mode === "signup" 
                ? (step === "otp" ? "Enter OTP Code" : "Join LPU Guide") 
                : "Welcome Back"}
            </h1>
          </div>
        </div>

        {adminNotice && (
          <div className="flex items-start gap-2.5 rounded-lg border-2 border-black bg-lpu-yellow p-3.5 text-xs font-bold text-black shadow-neo-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-black mt-0.5" />
            <div>
              <p className="font-black uppercase">Privileged Area Notice</p>
              <p className="text-black/80 font-semibold mt-0.5">
                Administrator credentials with role level <code>admin</code> are required to access this dashboard.
              </p>
            </div>
          </div>
        )}

        {err && (
          <div role="alert" className="flex items-center gap-2 rounded-lg border-2 border-black bg-rose-100 p-3 text-xs font-bold text-black shadow-neo-sm">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{err}</span>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-center gap-2 rounded-lg border-2 border-black bg-emerald-100 p-3 text-xs font-bold text-black shadow-neo-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* STEP 2 (SIGNUP ONLY): OTP Verification Form */}
        {mode === "signup" && step === "otp" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs font-semibold text-black/80 leading-relaxed">
              We sent a 6-digit confirmation code to <strong>{formData.email}</strong>. Enter the code below to activate your student account.
            </p>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                6-Digit Verification Code (OTP)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="input text-center text-lg tracking-[6px] font-black bg-white"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={busy || otp.length !== 6}
              className="btn btn-yellow w-full text-xs sm:text-sm py-3 justify-center shadow-neo disabled:opacity-50 font-black"
            >
              {busy ? "Verifying..." : "Verify & Activate Account"}
            </button>

            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-black/20">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setErr("");
                  setSuccess("");
                }}
                className="text-black/70 hover:text-black flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Edit details
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-lpu-darkOrange hover:underline flex items-center gap-1 font-black"
              >
                <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
                <span>{resending ? "Sending..." : "Resend code"}</span>
              </button>
            </div>
          </form>
        ) : (
          /* STEP 1: Registration or Login Form */
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aman Sharma"
                  className="input text-xs sm:text-sm bg-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                Student Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="input text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  Password
                </label>
                {mode === "login" && (
                  <Link href="/forgot-password" className="text-xs font-bold text-lpu-darkOrange underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                className="input text-xs sm:text-sm bg-white"
              />
            </div>

            {mode === "signup" && (
              <div className="rounded-lg border-2 border-black bg-lpu-soft/60 p-3 text-xs font-bold text-black shadow-neo-sm">
                📧 <strong>Verification:</strong> A 6-digit confirmation code will be sent to your email to verify account ownership.
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn btn-yellow w-full text-xs sm:text-sm py-3 justify-center shadow-neo disabled:opacity-50 font-black"
            >
              {busy ? (
                mode === "login" ? "Logging in..." : "Sending Code..."
              ) : mode === "signup" ? (
                <>
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  <span>Send Verification Code</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-1.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs font-bold text-black border-t-2 border-black/20">
              {mode === "signup" ? (
                <p>
                  Already registered?{" "}
                  <Link href="/login" className="text-lpu-darkOrange underline uppercase font-black">
                    Log In
                  </Link>
                </p>
              ) : (
                <p>
                  New freshman here?{" "}
                  <Link href="/signup" className="text-lpu-darkOrange underline uppercase font-black">
                    Create an account
                  </Link>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
