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
      {/* Manager Welcome Banner */}
      <div className="pl-card relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 border-l-4 border-l-[#00FF85]">
        <div className="flex items-center gap-4 z-10">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#00FF85] text-[#080B11] font-display text-2xl sm:text-3xl font-black uppercase shadow-md shrink-0">
            {username.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                Welcome, {username}
              </h1>
              {favoriteClub && (
                <img
                  src={favoriteClub.crestUrl}
                  alt={favoriteClub.name}
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0 filter drop-shadow"
                  title={favoriteClub.name}
                />
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Premier League Predictor</span>
              <span>•</span>
              <span className="text-[#00FF85] font-semibold">Season 2026/27 Active</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
          <Link
            href="/predict"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#00FF85] px-6 py-3 text-xs sm:text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            Submit Match Predictions
          </Link>
        </div>
      </div>

      {/* Overview KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="pl-card rounded-2xl p-5 sm:p-6 relative overflow-hidden border-t-4 border-t-emerald-500 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Score
            </span>
            <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
          </div>
          <div className="mt-2 font-display text-4xl sm:text-5xl font-black text-white tabular-nums">
            0 <span className="text-sm font-sans font-bold text-slate-400">PTS</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Calculated in real-time as fixtures conclude</p>
        </div>

        <div className="pl-card rounded-2xl p-5 sm:p-6 relative overflow-hidden border-t-4 border-t-[#E90052] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exact Scoreline Hits
            </span>
            <Target className="h-5 w-5 text-[#E90052] shrink-0" />
          </div>
          <div className="mt-2 font-display text-4xl sm:text-5xl font-black text-white tabular-nums">
            0 <span className="text-sm font-sans font-bold text-slate-400">HITS</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">+3 PTS for each exact score prediction</p>
        </div>

        <div className="pl-card rounded-2xl p-5 sm:p-6 relative overflow-hidden border-t-4 border-t-sky-500 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Correct Outcomes
            </span>
            <Award className="h-5 w-5 text-sky-400 shrink-0" />
          </div>
          <div className="mt-2 font-display text-4xl sm:text-5xl font-black text-white tabular-nums">
            0 <span className="text-sm font-sans font-bold text-slate-400">W/D/L</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">+1 PT for correct match winner or draw</p>
        </div>
      </div>

      {/* Mini-Leagues Preview Container */}
      <div className="pl-card rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#00FF85]" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
              My Mini-Leagues
            </h2>
          </div>
          <Link
            href="/leagues"
            className="flex items-center gap-1 text-xs font-bold text-[#00FF85] hover:underline cursor-pointer"
          >
            Manage Leagues <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-24 rounded-xl bg-[#0b0f17] animate-pulse" />
        ) : leagues.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center bg-[#0a0e16]">
            <Users className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <h3 className="font-display text-lg font-bold uppercase text-white">
              No Mini-Leagues Joined Yet
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Create a custom league for your friends, or join with a private league code.
            </p>
            <Link
              href="/leagues"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00FF85] px-4 py-2 text-xs font-black text-[#080B11] hover:bg-[#00e676] transition-colors cursor-pointer"
            >
              Create or Join a League
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {leagues.map((league) => (
              <div
                key={league.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0d121c] p-4 shadow-sm hover:border-slate-700 transition-all"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-white uppercase truncate">
                    {league.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {league.memberCount} Members • Code: <span className="font-mono font-bold text-[#00FF85]">{league.code}</span>
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2.5">
                  <span className="text-xs font-bold text-slate-400">Your Position:</span>
                  <span className="font-display text-lg font-black text-amber-400">
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
