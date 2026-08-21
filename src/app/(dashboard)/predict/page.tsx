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

  // In-memory client cache for instant GW switching (0ms lag)
  const gwCache = useRef<Record<number, { gameweek: any; matches: MatchData[] }>>({});

  const loadGameweekData = async (gw: number, forceRefresh = false) => {
    // Check if in cache for instant UI rendering
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

        // Save to cache
        gwCache.current[gw] = {
          gameweek: data.gameweek,
          matches: data.matches,
        };

        // Pre-populate prediction state
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
      loadGameweekData(currentGw, true); // Force refresh
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // If user is not logged in, show Auth Gate
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-10 px-2">
        <div className="pl-card max-w-lg w-full rounded-3xl p-6 sm:p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-pl-purple-light/50 border border-pl-green/40 text-pl-green glow-green">
            <Lock className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            ACCOUNT REQUIRED TO PREDICT
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Create a free predictor account or log in to submit your Premier League match scorelines, track your accuracy %, and climb the leaderboards.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-pl-green px-6 py-3 text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 shadow-md"
            >
              <UserPlus className="h-4 w-4" />
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-pl-purple-light bg-pl-purple-deeper px-6 py-3 text-sm font-semibold text-white hover:bg-pl-purple-light transition-all"
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
      {/* Gameweek Selector Header */}
      <div className="pl-card flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-pl-green text-pl-purple-deepest font-display text-xl sm:text-2xl font-black glow-green shadow-md">
              GW
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
                {gameweekInfo?.name || `Gameweek ${currentGw}`}
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-300">
                10 Matchweek Fixtures
              </p>
            </div>
          </div>
        </div>

        {/* Gameweek Carousel Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full py-1">
          <button
            onClick={() => setCurrentGw((prev) => Math.max(1, prev - 1))}
            disabled={currentGw <= 1}
            aria-label="Previous Gameweek"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deepest text-slate-300 hover:text-white disabled:opacity-30 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {[currentGw - 1, currentGw, currentGw + 1]
            .filter((gw) => gw >= 1 && gw <= 38)
            .map((gw) => (
              <button
                key={gw}
                onClick={() => setCurrentGw(gw)}
                className={cn(
                  "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer",
                  gw === currentGw
                    ? "bg-pl-green text-pl-purple-deepest glow-green shadow-md"
                    : "border border-pl-purple-light bg-pl-purple-deeper text-slate-300 hover:bg-pl-purple-light"
                )}
              >
                GW {gw}
              </button>
            ))}

          <button
            onClick={() => setCurrentGw((prev) => Math.min(38, prev + 1))}
            disabled={currentGw >= 38}
            aria-label="Next Gameweek"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deepest text-slate-300 hover:text-white disabled:opacity-30 shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-pl-green/20 border border-pl-green/50 p-3 sm:p-4 text-xs sm:text-sm font-bold text-pl-green shadow-lg animate-fade-in">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          <span>Predictions saved! Good luck for Gameweek {currentGw}!</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-500/20 border border-red-500/50 p-3 sm:p-4 text-xs sm:text-sm font-bold text-red-400 shadow-lg">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Match Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pl-card h-52 rounded-2xl animate-pulse bg-pl-purple-deeper/50" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="pl-card rounded-3xl p-8 sm:p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mb-3" />
          <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white">
            No Fixtures Found For Gameweek {currentGw}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Fixtures will automatically sync via the Premier League proxy.
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

      {/* Floating Action Bar */}
      <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-pl-purple-light/70 bg-pl-purple-deepest/95 p-2.5 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="flex items-center gap-2 pl-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-pl-green animate-ping" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-200">
              GW {currentGw} Ready
            </span>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-pl-green px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 disabled:opacity-50 shadow-lg cursor-pointer"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Save Predictions</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
