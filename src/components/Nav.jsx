"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { 
  Menu, 
  X, 
  MapPin, 
  CalendarCheck2, 
  GraduationCap, 
  BedDouble, 
  UtensilsCrossed, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus,
  Bus,
  HelpCircle
} from "lucide-react";

const publicLinks = [
  { href: "/#directory", label: "Directory", icon: Bus },
  { href: "/#first-15-days", label: "First 15 Days", icon: CalendarCheck2 },
  { href: "/#academics", label: "Academics", icon: GraduationCap },
  { href: "/#hostel", label: "Hostel", icon: BedDouble },
  { href: "/#dining", label: "Dining", icon: UtensilsCrossed },
  { href: "/#safety", label: "Safety", icon: ShieldCheck },
  { href: "/#map", label: "Map", icon: MapPin },
  { href: "/#faq", label: "FAQ", icon: HelpCircle },
];

export default function Nav({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e, href) => {
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b-4 border-black bg-[#FFFDF9]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main Navigation">
        {/* Brand Logo with Official LPU Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-black bg-white shadow-neo-sm transition-transform group-hover:scale-105">
            <Image 
              src="/lpu-logo.png" 
              alt="LPU Official Logo" 
              fill 
              sizes="44px"
              className="object-contain p-0.5" 
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-black uppercase group-hover:text-lpu-orange transition-colors">
              LPU Guide
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-lpu-yellow px-1.5 py-0.2 rounded border border-black inline-block w-fit">
              Freshman Portal
            </span>
          </div>
        </Link>

        {/* Desktop Anchor Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-black uppercase text-black">
          {publicLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-2.5 py-1.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-lpu-soft hover:shadow-neo-sm transition-all cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth CTA & User Menu */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 rounded-lg border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase text-black shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo transition-all"
                title="Student Dashboard"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-black bg-lpu-yellow text-[10px] font-black text-black">
                  {user.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 text-black hover:bg-rose-100 border-2 border-black rounded-lg shadow-neo-sm hover:shadow-neo transition-all"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="btn btn-white text-xs px-3.5 py-1.5"
              >
                <LogIn className="h-3.5 w-3.5 mr-1" />
                <span>Log In</span>
              </Link>
              <Link 
                href="/signup" 
                className="btn btn-yellow text-xs px-3.5 py-1.5"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-lg border-2 border-black bg-lpu-yellow text-black shadow-neo-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-3 border-black bg-[#FFFDF9] px-4 py-4 space-y-4 shadow-neo-lg">
          <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase">
            {publicLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg border-2 border-black bg-white hover:bg-lpu-soft shadow-neo-sm cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-lpu-orange" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {user && (
            <div className="pt-2 border-t-2 border-black flex items-center justify-between">
              <span className="text-xs font-black uppercase truncate">Signed in as {user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 ml-2 border-2 border-black rounded-lg bg-rose-200"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
