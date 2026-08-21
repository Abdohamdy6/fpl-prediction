"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Trophy, Calendar, Users, LayoutDashboard, Shield, LogOut, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/predict", label: "Predict", icon: Calendar },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/leagues", label: "Mini-Leagues", icon: Users },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pl-purple-light/40 bg-pl-purple-deepest/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-white font-display text-2xl font-bold tracking-wider group-hover:scale-105 transition-transform">
            PL
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-wider text-white">
              PREMIER LEAGUE
            </span>
            <span className="block text-xs font-semibold uppercase tracking-widest text-pl-green">
              PREDICTOR
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
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
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-white">
                  {(session.user as any).username || session.user.name}
                </span>
                <span className="text-xs font-semibold text-pl-green">
                  {(session.user as any).role === "ADMIN" ? "Administrator" : "Predictor"}
                </span>
              </div>

              {(session.user as any).role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 rounded-lg bg-pl-pink/20 border border-pl-pink/40 px-2.5 py-1.5 text-xs font-bold text-pl-pink hover:bg-pl-pink/30 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-pl-purple-deeper px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-red-500 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-pl-purple-light bg-pl-purple-deeper px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-pl-purple-light transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-pl-green px-3.5 py-1.5 text-xs font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-colors glow-green"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
