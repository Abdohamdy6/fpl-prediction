"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trophy, Target, Award, Users, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

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
    <div className="flex flex-col gap-8 pb-16">
      {/* Welcome Banner */}
      <div className="pl-card relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-white font-display text-3xl font-bold uppercase shadow-lg glow-pink">
            {username.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
                Welcome, {username}
              </h1>
              {favoriteClub && (
                <img
                  src={favoriteClub.crestUrl}
                  alt={favoriteClub.name}
                  className="h-7 w-7 object-contain"
                  title={favoriteClub.name}
                />
              )}
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Premier League Predictor • Season 2026/27
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link
            href="/predict"
            className="flex items-center gap-2 rounded-xl bg-pl-green px-5 py-2.5 text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95"
          >
            <Zap className="h-4 w-4" />
            Make Predictions
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="pl-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Points
            </span>
            <Trophy className="h-5 w-5 text-pl-gold" />
          </div>
          <div className="mt-3 font-display text-4xl font-black text-pl-green">
            0 <span className="text-sm font-sans font-medium text-slate-400">PTS</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Calculated after each finished fixture</p>
        </div>

        <div className="pl-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exact Scorelines (3pts)
            </span>
            <Target className="h-5 w-5 text-pl-pink" />
          </div>
          <div className="mt-3 font-display text-4xl font-black text-white">
            0 <span className="text-sm font-sans font-medium text-slate-400">HITS</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">100% accurate scoreline predictions</p>
        </div>

        <div className="pl-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Correct Outcomes (1pt)
            </span>
            <Award className="h-5 w-5 text-pl-cyan" />
          </div>
          <div className="mt-3 font-display text-4xl font-black text-white">
            0 <span className="text-sm font-sans font-medium text-slate-400">RESULTS</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Correct Win/Draw/Loss outcome</p>
        </div>
      </div>

      {/* Mini-Leagues Preview */}
      <div className="pl-card rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Users className="h-6 w-6 text-pl-green" />
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
              My Mini-Leagues
            </h2>
          </div>
          <Link
            href="/leagues"
            className="flex items-center gap-1 text-xs font-bold text-pl-green hover:underline"
          >
            Manage Leagues <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-24 rounded-xl bg-pl-purple-deeper/50 animate-pulse" />
        ) : leagues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pl-purple-light/50 p-8 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-500 mb-2" />
            <h3 className="font-display text-lg font-bold uppercase text-white">
              You haven&apos;t joined any mini-leagues yet
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="flex flex-col justify-between rounded-xl border border-pl-purple-light/40 bg-pl-purple-deeper/70 p-4"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-white uppercase truncate">
                    {league.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {league.memberCount} Predictors • Code: <span className="font-mono text-pl-green">{league.code}</span>
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-pl-purple-light/30 pt-3">
                  <span className="text-xs font-semibold text-slate-400">Your Rank:</span>
                  <span className="font-display text-lg font-bold text-pl-gold">
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
