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
    { href: "/predict", label: "Predict", icon: Calendar },
    { href: "/season-table", label: "Table 1-20", icon: ListOrdered },
    { href: "/leaderboard", label: "Rankings", icon: Trophy },
    { href: "/leagues", label: "Leagues", icon: Users },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-pl-purple-light/40 bg-pl-purple-deepest/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-white font-display text-xl sm:text-2xl font-bold tracking-wider group-hover:scale-105 transition-transform shadow-md">
              PL
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-white">
                PREMIER LEAGUE
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-pl-green -mt-1 sm:mt-0">
                PREDICTOR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs lg:text-sm font-medium transition-all",
                    isActive
                      ? "bg-pl-purple-light text-pl-green font-semibold shadow-inner"
                      : "text-slate-300 hover:bg-pl-purple-deeper hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-pl-green" : "text-slate-400")} />
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
                  <span className="text-[10px] sm:text-xs font-semibold text-pl-green">
                    {(session.user as any).role === "ADMIN" ? "Admin" : "Predictor"}
                  </span>
                </div>

                {(session.user as any).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-lg bg-pl-pink/20 border border-pl-pink/40 px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-pl-pink hover:bg-pl-pink/30 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-pl-purple-deeper px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-red-500 hover:text-red-400 transition-colors"
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
                  className="flex items-center gap-1 rounded-lg border border-pl-purple-light bg-pl-purple-deeper px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-pl-purple-light transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1 rounded-lg bg-pl-green px-3 py-1.5 text-xs font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-colors glow-green shadow-md"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (App Experience with 5 tabs) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-pl-purple-light/50 bg-pl-purple-deepest/95 backdrop-blur-xl px-1.5 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all",
                  isActive
                    ? "text-pl-green font-bold"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                    isActive ? "bg-pl-purple-light text-pl-green glow-green" : ""
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-medium tracking-tight mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
