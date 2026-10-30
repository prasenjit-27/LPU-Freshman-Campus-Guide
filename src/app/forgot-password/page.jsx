"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  // State
  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetCompleted, setResetCompleted] = useState(false);

  // Request reset link via Brevo
  async function handleRequestLink(e) {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    // Validate email with Zod
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to process request. Please try again.");
      } else {
        setStatusMessage("Code sent successfully");
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Set new password with token
  async function handleSetNewPassword(e) {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Validate with Zod
    const parsed = resetPasswordSchema.safeParse({
      token,
      password: newPassword,
    });

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to reset password. The link might have expired.");
      } else {
        setResetCompleted(true);
        setStatusMessage(data.message || "Password updated successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card border-4 border-black bg-white shadow-neo-xl p-6 sm:p-8 space-y-5">
      <Link 
        href="/login" 
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-black hover:text-lpu-orange transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Log in
      </Link>

      {/* Brand Header */}
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
            Account Recovery
          </span>
          <h1 className="text-xl font-black uppercase text-black tracking-tight mt-0.5">
            {token ? "Set New Password" : "Reset Password"}
          </h1>
        </div>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border-2 border-black bg-rose-100 p-3 text-xs font-bold text-black shadow-neo-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {statusMessage && (
        <div role="status" className="flex items-center gap-2 rounded-lg border-2 border-black bg-emerald-100 p-3 text-xs font-bold text-black shadow-neo-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* View 1: When user has clicked the email link containing a token */}
      {token ? (
        resetCompleted ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs font-bold text-black">
              Your password has been changed. Redirecting to login...
            </p>
            <Link href="/login" className="btn btn-black w-full text-xs">
              Log In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <p className="text-xs font-semibold text-black/80 leading-relaxed">
              Enter your new password below. Make sure it is at least 8 characters long.
            </p>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="input text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="input text-xs sm:text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-yellow w-full text-xs sm:text-sm py-2.5 disabled:opacity-50 font-black"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )
      ) : (
        /* View 2: Initial form asking for email to dispatch Brevo reset link */
        <form onSubmit={handleRequestLink} className="space-y-4">
          <p className="text-xs font-semibold text-black/80 leading-relaxed">
            Enter your registered student email address. We will send you a secure one-time reset link via our Brevo mail service.
          </p>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
              Student Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="input text-xs sm:text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-yellow w-full text-xs sm:text-sm py-2.5 disabled:opacity-50 font-black"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ForgotPassword() {
  return (
    <div className="mx-auto max-w-md w-full py-6">
      <Suspense fallback={<div className="card p-6 text-center font-bold text-xs uppercase">Loading Recovery Portal...</div>}>
        <ForgotPasswordContent />
      </Suspense>
    </div>
  );
}
