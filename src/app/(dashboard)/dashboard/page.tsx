"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trophy, Target, Award, Users, ArrowRight, Zap } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leagues")
      .then((res) => res.json())
      .then((data) => {
        if (data.leagues) setLeagues(data.leagues);
      })
      .catch((err) => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const username = (session?.user as any)?.username || session?.user?.name || "Predictor";
  const favoriteClub = (session?.user as any)?.favoriteClub;

  return (
    <div className="flex flex-col gap-6 pb-24 sm:pb-16">
      {/* Welcome Banner */}
      <div className="pl-card relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-white font-display text-2xl sm:text-3xl font-bold uppercase shadow-lg glow-pink shrink-0">
            {username.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
                Welcome, {username}
              </h1>
              {favoriteClub && (
                <img
                  src={favoriteClub.crestUrl}
                  alt={favoriteClub.name}
                  className="h-6 w-6 sm:h-7 sm:w-7 object-contain shrink-0"
                  title={favoriteClub.name}
                />
              )}
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-300 mt-0.5">
              Premier League Predictor • Season 2026/27
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
          <Link
            href="/predict"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-pl-green px-5 py-2.5 text-xs sm:text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 shadow-md"
          >
            <Zap className="h-4 w-4" />
            Make Predictions
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="pl-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
              Total Points
            </span>
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-pl-gold shrink-0" />
          </div>
          <div className="mt-2.5 font-display text-3xl sm:text-4xl font-black text-pl-green">
            0 <span className="text-xs sm:text-sm font-sans font-medium text-slate-400">PTS</span>
          </div>
          <p className="mt-1 text-[10px] sm:text-xs text-slate-400">Calculated after each finished fixture</p>
        </div>

        <div className="pl-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
              Exact Hits (3pts)
            </span>
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-pl-pink shrink-0" />
          </div>
          <div className="mt-2.5 font-display text-3xl sm:text-4xl font-black text-white">
            0 <span className="text-xs sm:text-sm font-sans font-medium text-slate-400">HITS</span>
          </div>
          <p className="mt-1 text-[10px] sm:text-xs text-slate-400">100% accurate scoreline predictions</p>
        </div>

        <div className="pl-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
              Correct Outcomes (1pt)
            </span>
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-pl-cyan shrink-0" />
          </div>
          <div className="mt-2.5 font-display text-3xl sm:text-4xl font-black text-white">
            0 <span className="text-xs sm:text-sm font-sans font-medium text-slate-400">RESULTS</span>
          </div>
          <p className="mt-1 text-[10px] sm:text-xs text-slate-400">Correct Win/Draw/Loss outcome</p>
        </div>
      </div>

      {/* Mini-Leagues Preview */}
      <div className="pl-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-pl-green" />
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
              My Mini-Leagues
            </h2>
          </div>
          <Link
            href="/leagues"
            className="flex items-center gap-1 text-xs font-bold text-pl-green hover:underline"
          >
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-24 rounded-xl bg-pl-purple-deeper/50 animate-pulse" />
        ) : leagues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pl-purple-light/50 p-6 sm:p-8 text-center">
            <Users className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-slate-400 mb-2" />
            <h3 className="font-display text-base sm:text-lg font-bold uppercase text-white">
              You haven&apos;t joined any mini-leagues yet
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Create a league to challenge your friends, or join with an invite code.
            </p>
            <Link
              href="/leagues"
              className="inline-flex items-center gap-1.5 rounded-xl bg-pl-green px-4 py-2 text-xs font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-colors"
            >
              Create or Join League
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="flex flex-col justify-between rounded-xl border border-pl-purple-light/40 bg-pl-purple-deeper/70 p-3.5 sm:p-4"
              >
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white uppercase truncate">
                    {league.name}
                  </h3>
                  <span className="text-[11px] sm:text-xs text-slate-300">
                    {league.memberCount} Predictors • Code: <span className="font-mono text-pl-green">{league.code}</span>
                  </span>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-pl-purple-light/30 pt-2.5">
                  <span className="text-xs font-semibold text-slate-300">Your Rank:</span>
                  <span className="font-display text-base sm:text-lg font-bold text-pl-gold">
                    #{league.userRank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
