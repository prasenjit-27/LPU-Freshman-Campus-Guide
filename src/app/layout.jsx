import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Nav from "@/components/Nav";
import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "LPU Freshman Guide — Student Campus Companion",
  description: "An independent, verified campus guide, interactive map, directory, and onboarding portal for Lovely Professional University freshmen.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions).catch(() => null);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Nav user={session?.user || null} />
        
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 md:py-8">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-indigo-600" />
              <span>LPU Freshman Campus Guide (Unofficial Student Companion)</span>
            </div>
            
            <p className="text-center sm:text-right text-[11px] text-slate-400">
              Not affiliated with or endorsed by Lovely Professional University. All official academic and administrative operations take place exclusively on official LPU portals.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
