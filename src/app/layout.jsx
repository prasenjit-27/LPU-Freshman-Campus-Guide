import "./globals.css";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Nav from "@/components/Nav";
import Link from "next/link";
import { Compass, ShieldCheck, Heart } from "lucide-react";

export const metadata = {
  title: "LPU Freshman Guide — Official Neo Student Companion",
  description: "An independent, verified campus guide, map, directory, and onboarding portal for Lovely Professional University freshmen.",
  icons: {
    icon: "/lpu-logo.png",
  }
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions).catch(() => null);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-[#FFFDF9] text-black antialiased selection:bg-lpu-yellow selection:text-black">
        <Nav user={session?.user || null} />
        
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 md:py-8">
          {children}
        </main>

        <footer className="border-t-4 border-black bg-white py-8 text-xs text-black">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-black bg-white shadow-neo-sm">
                <Image 
                  src="/lpu-logo.png" 
                  alt="LPU Official Logo" 
                  fill 
                  sizes="32px"
                  className="object-contain p-0.5" 
                />
              </div>
              <span className="font-black uppercase tracking-tight">
                LPU Freshman Guide • Student Campus Companion
              </span>
            </div>
            
            <p className="text-center sm:text-right text-[11px] font-bold text-black/60">
              Unofficial campus handbook created for Lovely Professional University students.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
