import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminUserManager from "@/components/AdminUserManager";
import AuthForm from "@/components/AuthForm";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal — LPU Freshman Guide",
  description: "Administrative user management and student progress directory for LPU Freshman Guide.",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // If visitor is unauthenticated, show the dedicated admin login flow
  if (!session) {
    return (
      <div className="py-8">
        <div className="mb-6 flex items-center justify-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Campus Guide
          </Link>
        </div>
        <AuthForm mode="login" adminNotice={true} />
      </div>
    );
  }

  // If user is authenticated but not an admin, return 403 Forbidden with clear explanation
  if (session.user.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg py-12">
        <div className="card border-4 border-black bg-rose-50 p-6 sm:p-8 text-center space-y-4 shadow-neo-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-rose-200 text-rose-800">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase text-black">403 — Administrative Access Forbidden</h1>
            <p className="text-xs font-semibold text-black/80 leading-relaxed">
              You are currently logged in as <strong>{session.user.email}</strong>, which holds a standard student role. Administrative features are strictly restricted.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/" className="btn btn-yellow text-xs justify-center font-black">
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Authorized Administrator: Exclusively User Management & Student Progress
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-4 border-black pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 py-0.5 text-xs font-black uppercase text-black shadow-neo-sm mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            User Management &amp; Student Progress
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-black/70">
            Manage student registrations, audit account status, and track freshman onboarding progress.
          </p>
        </div>

        
      </div>

      <AdminUserManager currentAdminId={session.user.id} />
    </div>
  );
}
