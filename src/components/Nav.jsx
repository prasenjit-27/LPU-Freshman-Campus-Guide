"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  Menu, 
  X, 
  Compass, 
  CalendarCheck2, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  BedDouble, 
  UtensilsCrossed, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus,
  Bus,
  Users2,
  HelpCircle,
  BellRing
} from "lucide-react";

const publicLinks = [
  { href: "/campus-map", label: "Campus Map", icon: MapPin },
  { href: "/services", label: "Directory", icon: Bus },
  { href: "/freshmen-guide", label: "First 15 Days", icon: CalendarCheck2 },
  { href: "/announcements", label: "News", icon: BellRing },
  { href: "/events", label: "Events", icon: CalendarCheck2 },
  { href: "/academics", label: "Academics", icon: GraduationCap },
  { href: "/hostel", label: "Hostel", icon: BedDouble },
  { href: "/dining", label: "Dining", icon: UtensilsCrossed },
  { href: "/safety", label: "Safety", icon: ShieldCheck },
  { href: "/help", label: "Help & FAQ", icon: HelpCircle },
];

export default function Nav({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main Navigation">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              LPU Freshman Guide
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Unofficial Campus Companion</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Link href="/campus-map" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Map
          </Link>
          <Link href="/services" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Directory
          </Link>
          <Link href="/freshmen-guide" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            First 15 Days
          </Link>
          <Link href="/academics" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Academics
          </Link>
          <Link href="/hostel" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Hostel
          </Link>
          <Link href="/dining" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Dining
          </Link>
          <Link href="/safety" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            Safety
          </Link>
          <Link href="/help" className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
            FAQ
          </Link>
        </div>

        {/* Auth CTA & User Menu */}
        <div className="hidden sm:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/settings" 
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Account Settings"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                  {user.name?.charAt(0).toUpperCase() || "S"}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="btn py-1.5 px-3 text-xs font-semibold flex items-center gap-1"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden shadow-lg animate-in slide-in-from-top-2">
          {user && (
            <div className="mb-4 rounded-xl bg-slate-50 p-3 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 text-xs text-red-600 font-medium hover:underline p-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Exit</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
            {publicLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-slate-50 transition-colors"
              >
                <Icon className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="btn justify-center py-2 text-xs"
              >
                <User className="h-3.5 w-3.5 mr-1" />
                <span>My Profile & Settings</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 justify-center text-xs"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn justify-center text-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
