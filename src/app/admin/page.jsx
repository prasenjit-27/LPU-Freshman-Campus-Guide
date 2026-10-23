import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminUserManager from "@/components/AdminUserManager";
import AuthForm from "@/components/AuthForm";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal — LPU Freshman Guide",
  description: "Restricted administrative user management directory for LPU Freshman Guide.",
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
        <div className="card border-red-200 bg-red-50/50 p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">403 — Administrative Access Forbidden</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are currently logged in as <strong>{session.user.email}</strong>, which holds a standard student role. Administrative features are strictly restricted.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/" className="btn text-xs justify-center">
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Authorized Administrator
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-0.5 text-xs font-semibold text-purple-700 mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Restricted Admin Area
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Administration Directory</h1>
          <p className="text-xs text-slate-500">
            Audit, inspect, activate/deactivate accounts, and manage permissions for all registered users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs">
            View Student Dashboard
          </Link>
        </div>
      </div>

      <AdminUserManager currentAdminId={session.user.id} />
    </div>
  );
}
