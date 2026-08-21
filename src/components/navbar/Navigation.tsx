"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Trophy,
  Calendar,
  Users,
  LayoutDashboard,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/predict", label: "Match Predictor", shortLabel: "Predict", icon: Calendar },
    { href: "/season-table", label: "Season Table 1-20", shortLabel: "Table", icon: ListOrdered },
    { href: "/leaderboard", label: "Global Rankings", shortLabel: "Rankings", icon: Trophy },
    { href: "/leagues", label: "Mini-Leagues", shortLabel: "Leagues", icon: Users },
    { href: "/dashboard", label: "Manager Hub", shortLabel: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0e17]/95 border-b border-slate-800/80 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#00FF85] text-[#080B11] font-display text-xl sm:text-2xl font-black tracking-wider group-hover:scale-105 transition-transform shadow-md">
              PL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg sm:text-xl font-black tracking-wider text-white">
                  PREMIER LEAGUE
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/40">
                  PRO
                </span>
              </div>
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#00FF85] -mt-1">
                PREDICTOR • 2026/27
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121824] p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs lg:text-sm font-bold transition-all cursor-pointer",
                    isActive
                      ? "bg-[#00FF85] text-[#080B11] shadow-md font-extrabold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-[#080B11]" : "text-slate-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User / Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs sm:text-sm font-bold text-white max-w-[120px] truncate">
                    {(session.user as any).username || session.user.name}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#00FF85] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00FF85] animate-pulse" />
                    {(session.user as any).role === "ADMIN" ? "Admin" : "Predictor"}
                  </span>
                </div>

                {(session.user as any).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-lg bg-[#E90052] px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-[#d00048] transition-colors shadow-sm"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-[#121824] px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-lg bg-[#00FF85] px-3.5 py-1.5 text-xs font-black text-[#080B11] hover:bg-[#00e676] transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-[#0a0e17]/95 backdrop-blur-2xl px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer",
                  isActive
                    ? "text-[#00FF85] font-black"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                    isActive ? "bg-[#00FF85] text-[#080B11] shadow-md font-bold" : ""
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold tracking-tight mt-0.5">
                  {item.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
