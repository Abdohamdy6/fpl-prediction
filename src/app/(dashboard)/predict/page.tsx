"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Calendar, Save, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Lock, UserPlus, LogIn } from "lucide-react";
import MatchCard, { MatchData } from "@/components/matches/MatchCard";
import { cn } from "@/lib/utils";

export default function PredictPage() {
  const { data: session, status } = useSession();
  const [currentGw, setCurrentGw] = useState(1);
  const [gameweekInfo, setGameweekInfo] = useState<{
    id: number;
    name: string;
    deadline: string;
    isCurrent: boolean;
  } | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [predictions, setPredictions] = useState<Record<string, { home: number; away: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const gwCache = useRef<Record<number, { gameweek: any; matches: MatchData[] }>>({});

  const loadGameweekData = async (gw: number, forceRefresh = false) => {
    if (!forceRefresh && gwCache.current[gw]) {
      const cached = gwCache.current[gw];
      setGameweekInfo(cached.gameweek);
      setMatches(cached.matches);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      const res = await fetch(`/api/proxy/gameweek?gw=${gw}`);
      const data = await res.json();

      if (data.gameweek) {
        setGameweekInfo(data.gameweek);
        setCurrentGw(data.gameweek.id);
      }

      if (data.matches) {
        setMatches(data.matches);

        gwCache.current[gw] = {
          gameweek: data.gameweek,
          matches: data.matches,
        };

        const initialPreds: Record<string, { home: number; away: number }> = {};
        for (const m of data.matches) {
          if (m.userPrediction) {
            initialPreds[m.id] = {
              home: m.userPrediction.predictedHomeScore,
              away: m.userPrediction.predictedAwayScore,
            };
          } else {
            initialPreds[m.id] = predictions[m.id] || { home: 0, away: 0 };
          }
        }
        setPredictions((prev) => ({ ...prev, ...initialPreds }));
      }
    } catch (err) {
      console.error("Failed to load matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameweekData(currentGw);
  }, [currentGw]);

  const handleScoreChange = (matchId: string, side: "home" | "away", val: number) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: 0, away: 0 }),
        [side]: val,
      },
    }));
  };

  const handleSaveAll = async () => {
    if (!session) {
      setSaveError("Please log in or create an account to submit your predictions.");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const payload = {
        gameweekId: currentGw,
        predictions: Object.entries(predictions).map(([matchId, scores]) => ({
          matchId,
          predictedHomeScore: scores.home,
          predictedAwayScore: scores.away,
        })),
      };

      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save predictions.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      loadGameweekData(currentGw, true);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-10 px-2">
        <div className="pl-card max-w-lg w-full rounded-2xl p-6 sm:p-10 text-center shadow-2xl border border-slate-800">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30">
            <Lock className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            ACCOUNT REQUIRED TO PREDICT
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Create a free predictor account or log in to submit your Premier League match scorelines, track your accuracy %, and climb the leaderboards.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#00FF85] px-6 py-3 text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#121824] px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-36 sm:pb-28">
      {/* Gameweek Selector & Overview Header */}
      <div className="pl-card flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl bg-[#00FF85] text-[#080B11] font-display text-2xl sm:text-3xl font-black shadow-md shrink-0">
              GW
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                {gameweekInfo?.name || `Gameweek ${currentGw}`}
              </h1>
              <p className="text-xs font-bold text-slate-400">
                10 Official Premier League Fixtures
              </p>
            </div>
          </div>
        </div>

        {/* Gameweek Carousel Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 bg-[#0b0f17] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentGw((prev) => Math.max(1, prev - 1))}
            disabled={currentGw <= 1}
            aria-label="Previous Gameweek"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-[#121824] text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 shrink-0 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {[currentGw - 2, currentGw - 1, currentGw, currentGw + 1, currentGw + 2]
            .filter((gw) => gw >= 1 && gw <= 38)
            .map((gw) => (
              <button
                key={gw}
                onClick={() => setCurrentGw(gw)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-display font-bold tracking-wide transition-all shrink-0 cursor-pointer",
                  gw === currentGw
                    ? "bg-[#00FF85] text-[#080B11] shadow-md font-extrabold scale-105"
                    : "bg-[#121824] border border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                GW {gw}
              </button>
            ))}

          <button
            onClick={() => setCurrentGw((prev) => Math.min(38, prev + 1))}
            disabled={currentGw >= 38}
            aria-label="Next Gameweek"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-[#121824] text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 shrink-0 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {saveSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3.5 sm:p-4 text-xs sm:text-sm font-bold text-emerald-400 shadow-md animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Your Gameweek {currentGw} predictions are saved and locked for kickoff!</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 p-3.5 sm:p-4 text-xs sm:text-sm font-bold text-rose-400 shadow-md">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Match Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-60 rounded-2xl animate-pulse bg-[#121824] border border-slate-800" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="pl-card rounded-2xl p-8 sm:p-12 text-center border border-slate-800">
          <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="font-display text-xl font-bold uppercase text-white">
            No Fixtures Found For Gameweek {currentGw}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Fixtures will automatically sync via the official Premier League proxy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {matches.map((match) => {
            const pred = predictions[match.id] || { home: 0, away: 0 };
            return (
              <MatchCard
                key={match.id}
                match={match}
                homeScore={pred.home}
                awayScore={pred.away}
                onHomeScoreChange={(val) => handleScoreChange(match.id, "home", val)}
                onAwayScoreChange={(val) => handleScoreChange(match.id, "away", val)}
              />
            );
          })}
        </div>
      )}

      {/* Floating Action Dock */}
      <div className="fixed bottom-16 md:bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-3 sm:px-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#0e1420]/95 border border-slate-800 text-white p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 pl-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00FF85] animate-ping" />
            <span className="text-xs font-bold text-white">
              GW {currentGw} Ready
            </span>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#00FF85] px-5 sm:px-7 py-2.5 text-xs sm:text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-all active:scale-95 disabled:opacity-50 shadow-md cursor-pointer"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Predictions</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
