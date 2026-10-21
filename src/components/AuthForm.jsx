"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function AuthForm({ mode }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (mode === "signup") {
      const r = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      if (!r.ok) { setErr((await r.json()).error); setBusy(false); return; }
    }
    const r = await signIn("credentials", { email: f.email, password: f.password, redirect: false });
    setBusy(false);
    if (r?.error) return setErr("Invalid email or password.");
    router.push("/dashboard"); router.refresh();
  }
  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-3">
      <h1 className="text-xl font-bold">{mode === "signup" ? "Create account" : "Log in"}</h1>
      {mode === "signup" && <div><label htmlFor="name" className="text-sm">Name</label><input id="name" name="name" required className="input" /></div>}
      <div><label htmlFor="email" className="text-sm">Email</label><input id="email" name="email" type="email" required className="input" /></div>
      <div><label htmlFor="password" className="text-sm">Password</label><input id="password" name="password" type="password" minLength={8} required className="input" /></div>
      <p className="text-xs text-slate-500">This is not the UMS login. Never enter your UMS password.</p>
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Please wait" : mode === "signup" ? "Sign up" : "Log in"}</button>
    </form>
  );
}
