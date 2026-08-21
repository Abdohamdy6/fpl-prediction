"use client";

import { useState, useEffect } from "react";
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

  const loadGameweekData = async (gw: number) => {
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

        // Pre-populate prediction state from user predictions or default to 0-0
        const initialPreds: Record<string, { home: number; away: number }> = {};
        for (const m of data.matches) {
          if (m.userPrediction) {
            initialPreds[m.id] = {
              home: m.userPrediction.predictedHomeScore,
              away: m.userPrediction.predictedAwayScore,
            };
          } else {
            initialPreds[m.id] = { home: 0, away: 0 };
          }
        }
        setPredictions(initialPreds);
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
        ...prev[matchId],
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
      loadGameweekData(currentGw); // Refresh latest match states
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // If user is not logged in, show Auth Gate
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-10">
        <div className="pl-card max-w-lg w-full rounded-3xl p-8 sm:p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pl-purple-light/50 border border-pl-green/40 text-pl-green glow-green">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-wider text-white">
            ACCOUNT REQUIRED TO PREDICT
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Create a free predictor account or log in to submit your Premier League match scorelines, track your accuracy %, and climb the leaderboards.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-pl-green px-6 py-3 text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95"
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
    <div className="flex flex-col gap-6 pb-24">
      {/* Gameweek Selector Header */}
      <div className="pl-card flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pl-green text-pl-purple-deepest font-display text-2xl font-black glow-green">
            GW
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
              {gameweekInfo?.name || `Gameweek ${currentGw}`}
            </h1>
            <p className="text-xs font-semibold text-slate-300">
              Predict all 10 fixtures before each individual kickoff
            </p>
          </div>
        </div>

        {/* Gameweek Carousel Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          <button
            onClick={() => setCurrentGw((prev) => Math.max(1, prev - 1))}
            disabled={currentGw <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deepest text-slate-300 hover:text-white disabled:opacity-30"
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
                  "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deepest text-slate-300 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-pl-green/20 border border-pl-green/50 p-4 text-sm font-bold text-pl-green shadow-lg animate-fade-in">
          <CheckCircle2 className="h-5 w-5" />
          <span>Predictions successfully saved! Good luck for Gameweek {currentGw}!</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-500/20 border border-red-500/50 p-4 text-sm font-bold text-red-400 shadow-lg">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Match Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="pl-card h-48 rounded-2xl animate-pulse bg-pl-purple-deeper/50" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="pl-card rounded-3xl p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="font-display text-xl font-bold uppercase text-white">
            No Fixtures Found For Gameweek {currentGw}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Fixtures will automatically sync via the Premier League proxy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-pl-purple-light/60 bg-pl-purple-deepest/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 pl-2">
            <span className="h-2.5 w-2.5 rounded-full bg-pl-green animate-ping" />
            <span className="text-xs font-semibold text-slate-200">
              GW {currentGw} Picks Ready
            </span>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-pl-green px-6 py-2.5 text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All Predictions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
