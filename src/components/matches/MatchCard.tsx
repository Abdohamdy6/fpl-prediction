"use client";

import { Tv, Award, CheckCircle2 } from "lucide-react";
import ScoreStepper from "./ScoreStepper";
import CountdownTimer from "./CountdownTimer";
import { formatDate } from "@/lib/utils";

export interface MatchData {
  id: string;
  sportDataId: string;
  gameweekId: number;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    abbr: string;
    crestUrl: string;
    primaryColor: string;
    secondaryColor: string;
    stadiumName?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    abbr: string;
    crestUrl: string;
    primaryColor: string;
    secondaryColor: string;
    stadiumName?: string;
  };
  kickoffTime: string;
  lockTime: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: string;
  broadcastInfo?: string;
  isPointsSettled: boolean;
  isLocked: boolean;
  userPrediction?: {
    predictedHomeScore: number;
    predictedAwayScore: number;
    predictedOutcome: string;
    pointsAwarded: number;
    isExactHit: boolean;
    isOutcomeHit: boolean;
  } | null;
}

interface MatchCardProps {
  match: MatchData;
  homeScore: number;
  awayScore: number;
  onHomeScoreChange: (val: number) => void;
  onAwayScoreChange: (val: number) => void;
}

export default function MatchCard({
  match,
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
}: MatchCardProps) {
  const isMatchLive = match.status === "IN_PLAY";
  const isMatchFinished = match.status === "FINISHED";
  const isLocked = match.isLocked || isMatchLive || isMatchFinished;

  const quickPresets = [
    { label: "1 - 0", h: 1, a: 0 },
    { label: "2 - 1", h: 2, a: 1 },
    { label: "1 - 1", h: 1, a: 1 },
    { label: "2 - 0", h: 2, a: 0 },
    { label: "1 - 2", h: 1, a: 2 },
    { label: "0 - 1", h: 0, a: 1 },
  ];

  return (
    <div className="pl-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 sm:p-5 shadow-lg">
      {/* Top Header: Kickoff Date, Broadcaster & Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-bold text-slate-200 text-[11px] sm:text-xs tracking-wide" suppressHydrationWarning>
            {formatDate(match.kickoffTime)}
          </span>
          {match.broadcastInfo && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#121824] border border-slate-700/80 text-slate-300 text-[10px] sm:text-[11px] font-semibold">
              <Tv className="h-3 w-3 text-sky-400 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{match.broadcastInfo}</span>
            </span>
          )}
        </div>
        <div className="self-start sm:self-auto">
          <CountdownTimer kickoffTime={match.kickoffTime} status={match.status} />
        </div>
      </div>

      {/* Main Fixture Display */}
      {isMatchLive || isMatchFinished ? (
        /* Finished or Live Match Scoreboard */
        <div className="my-4 flex flex-col items-center">
          <div className="w-full grid grid-cols-2 gap-3 items-center mb-3">
            {/* Home Team */}
            <div className="flex flex-col items-center text-center">
              <img
                src={match.homeTeam.crestUrl}
                alt={match.homeTeam.name}
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain mb-1.5 filter drop-shadow-md"
                loading="lazy"
              />
              <span className="font-display text-base font-bold uppercase text-white truncate max-w-[130px]">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
              <span className="text-[10px] font-bold text-[#00FF85] uppercase tracking-wider">HOME</span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center text-center">
              <img
                src={match.awayTeam.crestUrl}
                alt={match.awayTeam.name}
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain mb-1.5 filter drop-shadow-md"
                loading="lazy"
              />
              <span className="font-display text-base font-bold uppercase text-white truncate max-w-[130px]">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
              <span className="text-[10px] font-bold text-[#E90052] uppercase tracking-wider">AWAY</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[#0b0f17] border border-slate-800 text-white px-7 py-2.5 shadow-inner">
            <span className="font-display text-3xl sm:text-4xl font-black tabular-nums text-white">
              {match.homeScore ?? 0}
            </span>
            <span className="text-[#00FF85] font-bold text-2xl">:</span>
            <span className="font-display text-3xl sm:text-4xl font-black tabular-nums text-white">
              {match.awayScore ?? 0}
            </span>
          </div>
          <span className="mt-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            {isMatchLive ? "🔴 Live Match Score" : "Full Time Result"}
          </span>
        </div>
      ) : (
        /* Active Prediction Scoreboard */
        <div className="my-3.5 sm:my-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 items-stretch">
            {/* HOME TEAM BLOCK */}
            <div className="flex flex-col items-center justify-between p-3.5 rounded-xl bg-[#0d121c]/80 border border-slate-800/80">
              <div className="flex flex-col items-center text-center mb-2.5">
                <img
                  src={match.homeTeam.crestUrl}
                  alt={match.homeTeam.name}
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain mb-1.5 filter drop-shadow"
                  loading="lazy"
                />
                <span className="font-display text-sm sm:text-base font-bold uppercase text-white line-clamp-1">
                  {match.homeTeam.shortName || match.homeTeam.name}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#00FF85] uppercase tracking-wider">
                  HOME
                </span>
              </div>

              <ScoreStepper
                value={homeScore}
                onChange={onHomeScoreChange}
                disabled={isLocked}
                teamName={match.homeTeam.name}
              />
            </div>

            {/* AWAY TEAM BLOCK */}
            <div className="flex flex-col items-center justify-between p-3.5 rounded-xl bg-[#0d121c]/80 border border-slate-800/80">
              <div className="flex flex-col items-center text-center mb-2.5">
                <img
                  src={match.awayTeam.crestUrl}
                  alt={match.awayTeam.name}
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain mb-1.5 filter drop-shadow"
                  loading="lazy"
                />
                <span className="font-display text-sm sm:text-base font-bold uppercase text-white line-clamp-1">
                  {match.awayTeam.shortName || match.awayTeam.name}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#E90052] uppercase tracking-wider">
                  AWAY
                </span>
              </div>

              <ScoreStepper
                value={awayScore}
                onChange={onAwayScoreChange}
                disabled={isLocked}
                teamName={match.awayTeam.name}
              />
            </div>
          </div>

          {/* Quick Score Chips */}
          {!isLocked && (
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Quick Pick:</span>
              {quickPresets.map((preset) => {
                const isSelected = homeScore === preset.h && awayScore === preset.a;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onHomeScoreChange(preset.h);
                      onAwayScoreChange(preset.a);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-display font-bold tabular-nums transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#00FF85] text-[#080B11] shadow-md font-extrabold scale-105"
                        : "bg-[#101622] text-slate-300 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Prediction Settlement Status Badge */}
      {match.userPrediction && isMatchFinished && (
        <div className="mt-1 flex items-center justify-center">
          {match.userPrediction.isExactHit ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-black text-emerald-400">
              <Award className="h-4 w-4" />
              +3 PTS EXACT SCORE HIT!
            </span>
          ) : match.userPrediction.isOutcomeHit ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40 px-3 py-1 text-xs font-black text-sky-400">
              <CheckCircle2 className="h-4 w-4" />
              +1 PT CORRECT OUTCOME
            </span>
          ) : (
            <span className="rounded-lg bg-slate-800/80 border border-slate-700 px-3 py-1 text-[11px] font-bold text-slate-400">
              0 PTS (Predicted {match.userPrediction.predictedHomeScore}-{match.userPrediction.predictedAwayScore})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
