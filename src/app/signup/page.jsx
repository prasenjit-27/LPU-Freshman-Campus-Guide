import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="card p-8 text-center text-sm text-slate-500">Loading sign up...</div>}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
