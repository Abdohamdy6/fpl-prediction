"use client";

import { Tv, Award, CheckCircle2, Sparkles, Users } from "lucide-react";
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
  consensus?: {
    homeWinPct: number;
    drawPct: number;
    awayWinPct: number;
    totalPredictions: number;
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

  return (
    <div className="pl-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-3.5 sm:p-5 shadow-2xl transition-all hover:border-pl-green/50">
      {/* Top Header: Kickoff Time, Channel Broadcaster & Lock Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-pl-purple-light/40 pb-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-semibold text-slate-200 text-[11px] sm:text-xs" suppressHydrationWarning>
            {formatDate(match.kickoffTime)}
          </span>
          {match.broadcastInfo && (
            <span className="flex items-center gap-1 text-slate-300 text-[10px] sm:text-xs">
              <Tv className="h-3.5 w-3.5 text-pl-cyan shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">{match.broadcastInfo}</span>
            </span>
          )}
        </div>
        <div className="self-start sm:self-auto">
          <CountdownTimer kickoffTime={match.kickoffTime} status={match.status} />
        </div>
      </div>

      {/* Main Fixture Section: Scores positioned clearly UNDER each team */}
      {isMatchLive || isMatchFinished ? (
        /* Finished or Live Match Scoreboard */
        <div className="my-4 flex flex-col items-center">
          <div className="w-full grid grid-cols-2 gap-3 items-center mb-3">
            {/* Home */}
            <div className="flex flex-col items-center text-center">
              <img
                src={match.homeTeam.crestUrl}
                alt={match.homeTeam.name}
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain mb-1.5"
                loading="lazy"
              />
              <span className="font-display text-sm sm:text-base font-bold uppercase text-white truncate max-w-[120px]">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
              <span className="text-[10px] font-bold text-pl-green">HOME</span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center text-center">
              <img
                src={match.awayTeam.crestUrl}
                alt={match.awayTeam.name}
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain mb-1.5"
                loading="lazy"
              />
              <span className="font-display text-sm sm:text-base font-bold uppercase text-white truncate max-w-[120px]">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
              <span className="text-[10px] font-bold text-pl-pink">AWAY</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-pl-purple-deepest px-6 py-2 border border-pl-purple-light shadow-inner">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {match.homeScore ?? 0}
            </span>
            <span className="text-slate-500 font-bold text-xl">:</span>
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {match.awayScore ?? 0}
            </span>
          </div>
          <span className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-pl-green">
            {isMatchLive ? "🔴 Live Score" : "Full Time Result"}
          </span>
        </div>
      ) : (
        /* Active Prediction: 2 Spacious Columns with Score Stepper/Input UNDER each team */
        <div className="my-3.5 sm:my-4 grid grid-cols-2 gap-2.5 sm:gap-4 items-stretch">
          {/* HOME TEAM BLOCK */}
          <div className="flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-2xl bg-pl-purple-deeper/60 border border-pl-purple-light/30 shadow-md">
            <div className="flex flex-col items-center text-center mb-2 sm:mb-3">
              <div className="relative mb-1.5 h-12 w-12 sm:h-16 sm:w-16 transition-transform group-hover:scale-105">
                <img
                  src={match.homeTeam.crestUrl}
                  alt={match.homeTeam.name}
                  className="h-full w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                />
              </div>
              <span className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white line-clamp-1">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-pl-green uppercase tracking-wider">
                HOME
              </span>
            </div>

            {/* Score Stepper Directly Under Home Team */}
            <ScoreStepper
              value={homeScore}
              onChange={onHomeScoreChange}
              disabled={isLocked}
              teamName={match.homeTeam.name}
            />
          </div>

          {/* AWAY TEAM BLOCK */}
          <div className="flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-2xl bg-pl-purple-deeper/60 border border-pl-purple-light/30 shadow-md">
            <div className="flex flex-col items-center text-center mb-2 sm:mb-3">
              <div className="relative mb-1.5 h-12 w-12 sm:h-16 sm:w-16 transition-transform group-hover:scale-105">
                <img
                  src={match.awayTeam.crestUrl}
                  alt={match.awayTeam.name}
                  className="h-full w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                />
              </div>
              <span className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white line-clamp-1">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-pl-pink uppercase tracking-wider">
                AWAY
              </span>
            </div>

            {/* Score Stepper Directly Under Away Team */}
            <ScoreStepper
              value={awayScore}
              onChange={onAwayScoreChange}
              disabled={isLocked}
              teamName={match.awayTeam.name}
            />
          </div>
        </div>
      )}

      {/* Prediction Settlement Status Badge (If match finished / evaluated) */}
      {match.userPrediction && isMatchFinished && (
        <div className="mb-2.5 flex items-center justify-center">
          {match.userPrediction.isExactHit ? (
            <span className="flex items-center gap-1 rounded-lg bg-pl-green/20 border border-pl-green/50 px-2.5 py-1 text-[11px] font-bold text-pl-green">
              <Award className="h-3.5 w-3.5" />
              +3 PTS EXACT HIT!
            </span>
          ) : match.userPrediction.isOutcomeHit ? (
            <span className="flex items-center gap-1 rounded-lg bg-pl-cyan/20 border border-pl-cyan/50 px-2.5 py-1 text-[11px] font-bold text-pl-cyan">
              <CheckCircle2 className="h-3.5 w-3.5" />
              +1 PT CORRECT OUTCOME
            </span>
          ) : (
            <span className="rounded-lg bg-slate-800/90 border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
              0 PTS ({match.userPrediction.predictedHomeScore}-{match.userPrediction.predictedAwayScore})
            </span>
          )}
        </div>
      )}

      {/* Community Consensus Bar */}
      <div className="mt-1 border-t border-pl-purple-light/30 pt-2.5">
        {match.consensus && match.consensus.totalPredictions > 0 ? (
          <div>
            <div className="mb-1 flex justify-between text-[10px] sm:text-[11px] font-semibold text-slate-300">
              <span className="text-pl-green">{match.homeTeam.abbr}: {match.consensus.homeWinPct}%</span>
              <span className="text-pl-gold">Draw: {match.consensus.drawPct}%</span>
              <span className="text-pl-pink">{match.awayTeam.abbr}: {match.consensus.awayWinPct}%</span>
            </div>
            <div className="flex h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-pl-purple-deepest border border-pl-purple-light/40">
              <div
                style={{ width: `${match.consensus.homeWinPct}%` }}
                className="bg-pl-green transition-all"
                title={`${match.homeTeam.name} Win (${match.consensus.homeWinPct}%)`}
              />
              <div
                style={{ width: `${match.consensus.drawPct}%` }}
                className="bg-pl-gold transition-all"
                title={`Draw (${match.consensus.drawPct}%)`}
              />
              <div
                style={{ width: `${match.consensus.awayWinPct}%` }}
                className="bg-pl-pink transition-all"
                title={`${match.awayTeam.name} Win (${match.consensus.awayWinPct}%)`}
              />
            </div>
            <div className="mt-1 flex items-center justify-end gap-1 text-[9px] sm:text-[10px] text-slate-400">
              <Users className="h-3 w-3 text-slate-400" />
              <span>{match.consensus.totalPredictions} predictions</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 py-0.5">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-pl-green" />
            <span className="text-center">No picks yet • Be the first to predict!</span>
          </div>
        )}
      </div>
    </div>
  );
}
