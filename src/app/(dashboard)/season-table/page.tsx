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

  // Countdown timer with Days formatting
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
        <div className="pl-card max-w-lg w-full rounded-3xl p-6 sm:p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-pl-purple-light/50 border border-pl-gold/40 text-pl-gold glow-pink">
            <Trophy className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            SEASON TABLE PREDICTOR
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Predict the exact final 1st to 20th Premier League standings for the entire 2026/27 season before kickoff to earn massive end-of-season bonus points!
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
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
      <div className="pl-card relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-pl-gold to-pl-green text-pl-purple-deepest font-display text-2xl font-black shadow-lg shrink-0">
              <Trophy className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
                SEASON TABLE PREDICTOR
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-300">
                Rank all 20 Premier League teams from 1st to 20th for the entire 2026/27 season
              </p>
            </div>
          </div>

          {/* Countdown / Lock Badge */}
          <div>
            {isLocked || timeLeft.isPast ? (
              <span className="flex items-center gap-1.5 rounded-full bg-slate-800 border border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-300 shadow-inner">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                SEASON TABLE PREDICTIONS LOCKED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-pl-pink/20 border border-pl-pink/50 px-3.5 py-1.5 text-xs font-bold text-pl-pink glow-pink">
                <Clock className="h-3.5 w-3.5 animate-spin" />
                LOCKS IN: {formattedTime} (GW 1 Kickoff)
              </span>
            )}
          </div>
        </div>

        {/* Scoring Matrix Rule Bar */}
        <div className="mt-4 pt-3 border-t border-pl-purple-light/40 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs font-semibold">
          <div className="flex items-center gap-2 text-pl-gold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pl-gold/20 text-[10px] font-bold">
              +10
            </span>
            <span>PTS for each Exact Final Position hit</span>
          </div>
          <div className="flex items-center gap-2 text-pl-cyan">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pl-cyan/20 text-[10px] font-bold">
              +3
            </span>
            <span>PTS for each Top 4 (Champions League) correct spot</span>
          </div>
          <div className="flex items-center gap-2 text-pl-pink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pl-pink/20 text-[10px] font-bold">
              +3
            </span>
            <span>PTS for each Bottom 3 (Relegation) correct pick</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-pl-green/20 border border-pl-green/50 p-3 sm:p-4 text-xs sm:text-sm font-bold text-pl-green shadow-lg animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>Your 1st–20th Season Table Prediction has been successfully locked in!</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-500/20 border border-red-500/50 p-3 sm:p-4 text-xs sm:text-sm font-bold text-red-400 shadow-lg">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Table Rankings List (1 to 20) */}
      <div className="pl-card rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-pl-purple-light/40 pb-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-3 pl-2">
            <span>Rank</span>
            <span>Club</span>
          </div>
          <div className="pr-2 sm:pr-4">
            <span>Reorder Position</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-pl-purple-deeper/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-pl-purple-light/20">
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
                    "flex items-center justify-between py-2.5 px-2 sm:px-3 rounded-xl transition-all",
                    isChampion
                      ? "bg-pl-gold/10 border-l-4 border-l-pl-gold"
                      : isUCL
                      ? "bg-pl-cyan/5 border-l-4 border-l-pl-cyan"
                      : isUEL
                      ? "bg-amber-500/5 border-l-4 border-l-amber-500"
                      : isUECL
                      ? "bg-pl-green/5 border-l-4 border-l-pl-green"
                      : isRelegation
                      ? "bg-red-500/5 border-l-4 border-l-red-500"
                      : "hover:bg-pl-purple-deeper/50"
                  )}
                >
                  {/* Left Rank + Crest + Name */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div
                      className={cn(
                        "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg font-display text-sm sm:text-base font-bold shrink-0",
                        isChampion
                          ? "bg-pl-gold text-pl-purple-deepest font-black shadow-md glow-green"
                          : isUCL
                          ? "bg-pl-cyan text-pl-purple-deepest font-bold"
                          : isUEL
                          ? "bg-amber-500 text-white font-bold"
                          : isUECL
                          ? "bg-pl-green text-pl-purple-deepest font-bold"
                          : isRelegation
                          ? "bg-red-500 text-white font-bold"
                          : "bg-pl-purple-deepest text-slate-300 border border-pl-purple-light"
                      )}
                    >
                      {rank}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <img
                        src={club.crestUrl}
                        alt={club.name}
                        className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0 filter drop-shadow-sm"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <span className="font-display text-sm sm:text-base font-bold uppercase text-white truncate block max-w-[130px] sm:max-w-[240px]">
                          {club.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold">
                          {isChampion && <span className="text-pl-gold">🏆 Premier League Champion</span>}
                          {isUCL && <span className="text-pl-cyan">🔵 UEFA Champions League</span>}
                          {isUEL && <span className="text-amber-400">🟠 UEFA Europa League</span>}
                          {isUECL && <span className="text-pl-green">🟢 UEFA Conference League</span>}
                          {isRelegation && <span className="text-red-400">🔴 Relegation Zone</span>}
                          {!isChampion && !isUCL && !isUEL && !isUECL && !isRelegation && (
                            <span className="text-slate-400">Mid-Table</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Move Up / Move Down Buttons */}
                  {!isLocked && (
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveClub(index, "up")}
                        disabled={index === 0}
                        aria-label={`Move ${club.name} up`}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deepest text-slate-300 hover:text-pl-green hover:border-pl-green disabled:opacity-20 active:scale-90 transition-all cursor-pointer"
                      >
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveClub(index, "down")}
                        disabled={index === orderedClubIds.length - 1}
                        aria-label={`Move ${club.name} down`}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-pl-purple-light bg-pl-purple-deepest text-slate-300 hover:text-pl-pink hover:border-pl-pink disabled:opacity-20 active:scale-90 transition-all cursor-pointer"
                      >
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Save Bar */}
      {!isLocked && (
        <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 rounded-2xl border border-pl-purple-light/70 bg-pl-purple-deepest/95 p-2.5 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex items-center gap-2 pl-1.5">
              <Sparkles className="h-4 w-4 text-pl-gold animate-spin" />
              <span className="text-[11px] sm:text-xs font-semibold text-slate-200">
                {hasCustomOrder ? "Custom 1-20 Table Ready" : "Rank 1st to 20th"}
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-pl-green px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-all glow-green active:scale-95 disabled:opacity-50 shadow-lg cursor-pointer"
            >
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Lock In Table Prediction</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
