"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Trophy,
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Sparkles,
  UserPlus,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClubItem {
  id: string;
  name: string;
  shortName: string;
  abbr: string;
  crestUrl: string;
}

export default function SeasonTablePredictorPage() {
  const { data: session, status } = useSession();
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [orderedClubIds, setOrderedClubIds] = useState<string[]>([]);
  const [seasonKickoffTime, setSeasonKickoffTime] = useState<string>("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [hasCustomOrder, setHasCustomOrder] = useState(false);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/table-prediction");
      const data = await res.json();

      if (data.clubs) {
        setClubs(data.clubs);

        if (data.userPrediction?.rankings?.length === 20) {
          setOrderedClubIds(data.userPrediction.rankings);
          setHasCustomOrder(true);
        } else {
          setOrderedClubIds(data.clubs.map((c: ClubItem) => c.id));
        }
      }

      if (data.seasonKickoffTime) {
        setSeasonKickoffTime(data.seasonKickoffTime);
      }
      if (data.isLocked !== undefined) {
        setIsLocked(data.isLocked);
      }
    } catch (err) {
      console.error("Error loading table predictor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!seasonKickoffTime) return;
    const target = new Date(seasonKickoffTime).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        setIsLocked(true);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [seasonKickoffTime]);

  const moveClub = (index: number, direction: "up" | "down") => {
    if (isLocked) return;
    const newOrder = [...orderedClubIds];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setOrderedClubIds(newOrder);
    setHasCustomOrder(true);
  };

  const handleSave = async () => {
    if (!session) {
      setSaveError("Please log in or create an account to save your season table prediction.");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const res = await fetch("/api/table-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rankings: orderedClubIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save table prediction");

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const clubMap = new Map(clubs.map((c) => [c.id, c]));

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-10 px-2">
        <div className="pl-card max-w-lg w-full rounded-2xl p-6 sm:p-10 text-center shadow-2xl border border-slate-800">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            SEASON TABLE PREDICTOR
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Predict the exact final 1st to 20th Premier League standings for the entire 2026/27 season before kickoff to earn massive end-of-season bonus points!
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

  let formattedTime = "";
  if (timeLeft.days > 0) {
    formattedTime = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
  } else if (timeLeft.hours > 0) {
    formattedTime = `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
  } else {
    formattedTime = `${timeLeft.minutes}m ${timeLeft.seconds}s`;
  }

  return (
    <div className="flex flex-col gap-5 pb-36 sm:pb-28">
      {/* Header Banner */}
      <div className="pl-card relative rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 border-l-4 border-l-amber-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 font-display text-2xl font-black shadow-sm shrink-0">
              <Trophy className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
                OFFICIAL 1ST–20TH TABLE PREDICTOR
              </h1>
              <p className="text-xs font-bold text-slate-400">
                Rank all 20 Premier League clubs for the complete 2026/27 season
              </p>
            </div>
          </div>

          <div>
            {isLocked || timeLeft.isPast ? (
              <span className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-700 px-4 py-1.5 text-xs font-bold text-slate-400">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                PREDICTIONS LOCKED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-4 py-1.5 text-xs font-bold text-rose-400 tabular-nums">
                <Clock className="h-3.5 w-3.5 animate-spin" />
                LOCKS IN: {formattedTime}
              </span>
            )}
          </div>
        </div>

        {/* Scoring Matrix Rule Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
          <div className="flex items-center gap-2 text-amber-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-black">
              +10
            </span>
            <span>PTS for each Exact Final Position hit</span>
          </div>
          <div className="flex items-center gap-2 text-sky-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/20 text-[10px] font-black">
              +3
            </span>
            <span>PTS for each Top 4 (Champions League) spot</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-black">
              +3
            </span>
            <span>PTS for each Bottom 3 (Relegation) pick</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-xs sm:text-sm font-bold text-emerald-400 shadow-md animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Your 1st–20th Season Table Prediction is locked in!</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 p-4 text-xs sm:text-sm font-bold text-rose-400 shadow-md">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Table Rankings List (1 to 20) */}
      <div className="pl-card rounded-2xl p-3.5 sm:p-6 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-4 pl-3">
            <span>Rank</span>
            <span>Premier League Club</span>
          </div>
          <div className="pr-2 sm:pr-4">
            <span>Reorder Position</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-[#0b0f17] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {orderedClubIds.map((clubId, index) => {
              const club = clubMap.get(clubId);
              if (!club) return null;

              const rank = index + 1;
              const isChampion = rank === 1;
              const isUCL = rank >= 2 && rank <= 4;
              const isUEL = rank === 5;
              const isUECL = rank === 6;
              const isRelegation = rank >= 18;

              return (
                <div
                  key={club.id}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-2.5 sm:px-4 rounded-xl transition-all",
                    isChampion
                      ? "bg-amber-500/10 border-l-4 border-l-amber-500"
                      : isUCL
                      ? "bg-sky-500/10 border-l-4 border-l-sky-500"
                      : isUEL
                      ? "bg-orange-500/10 border-l-4 border-l-orange-500"
                      : isUECL
                      ? "bg-emerald-500/10 border-l-4 border-l-emerald-500"
                      : isRelegation
                      ? "bg-rose-500/10 border-l-4 border-l-rose-500"
                      : "hover:bg-[#121824]/60"
                  )}
                >
                  {/* Left Rank + Crest + Name */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div
                      className={cn(
                        "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg font-display text-sm sm:text-base font-bold shrink-0 tabular-nums",
                        isChampion
                          ? "bg-amber-500 text-[#080B11] shadow-sm font-black"
                          : isUCL
                          ? "bg-sky-500 text-[#080B11] shadow-sm font-bold"
                          : isUEL
                          ? "bg-orange-500 text-[#080B11] shadow-sm font-bold"
                          : isUECL
                          ? "bg-emerald-500 text-[#080B11] shadow-sm font-bold"
                          : isRelegation
                          ? "bg-rose-500 text-white shadow-sm font-bold"
                          : "bg-[#101622] text-slate-300 border border-slate-700"
                      )}
                    >
                      {rank}
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <img
                        src={club.crestUrl}
                        alt={club.name}
                        className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0 filter drop-shadow"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <span className="font-display text-sm sm:text-base font-bold uppercase text-white truncate block max-w-[130px] sm:max-w-[260px]">
                          {club.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold">
                          {isChampion && <span className="text-amber-400">🏆 Premier League Champion</span>}
                          {isUCL && <span className="text-sky-400">🔵 UEFA Champions League</span>}
                          {isUEL && <span className="text-orange-400">🟠 UEFA Europa League</span>}
                          {isUECL && <span className="text-emerald-400">🟢 UEFA Conference League</span>}
                          {isRelegation && <span className="text-rose-400">🔴 Relegation Zone</span>}
                          {!isChampion && !isUCL && !isUEL && !isUECL && !isRelegation && (
                            <span className="text-slate-400">Mid-Table</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reorder Buttons */}
                  {!isLocked && (
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveClub(index, "up")}
                        disabled={index === 0}
                        aria-label={`Move ${club.name} up`}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#121824] text-slate-300 hover:text-[#00FF85] hover:border-[#00FF85] disabled:opacity-20 active:scale-95 transition-all cursor-pointer"
                      >
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveClub(index, "down")}
                        disabled={index === orderedClubIds.length - 1}
                        aria-label={`Move ${club.name} down`}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#121824] text-slate-300 hover:text-rose-400 hover:border-rose-400 disabled:opacity-20 active:scale-95 transition-all cursor-pointer"
                      >
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Save Dock */}
      {!isLocked && (
        <div className="fixed bottom-16 md:bottom-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-3 sm:px-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#0e1420]/95 border border-slate-800 text-white p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 pl-2">
              <Sparkles className="h-4 w-4 text-[#00FF85] animate-spin" />
              <span className="text-xs font-bold text-white">
                {hasCustomOrder ? "Custom 1-20 Table Ready" : "Rank 1st to 20th"}
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#00FF85] px-5 sm:px-7 py-2.5 text-xs sm:text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-all active:scale-95 disabled:opacity-50 shadow-md cursor-pointer"
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lock In Table</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
