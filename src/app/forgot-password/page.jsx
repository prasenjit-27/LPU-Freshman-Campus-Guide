import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="mx-auto max-w-md w-full py-6">
      <div className="card shadow-lg border border-slate-200/80 p-6 sm:p-8 space-y-5">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Log in
        </Link>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <KeyRound className="h-3.5 w-3.5" />
            Account Security
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Password Recovery</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            In this version of the LPU Freshman Guide, automated email password reset tokens are restricted to prevent unauthorized account takeover on unverified SMTP hosts.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
            <p className="font-semibold text-slate-900">How to reset your Guide password:</p>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>If you are a student, please reach out to your designated campus system administrator or guide maintainer.</li>
            <li>Admins can issue a secure password reset directly from the restricted Admin Management Directory (`/admin`).</li>
            <li>If you created an account with an email address you still own, an administrator can safely initiate a temporary reset credential for your profile.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link href="/login" className="btn w-full justify-center text-sm font-semibold">
            Return to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
