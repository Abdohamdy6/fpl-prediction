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
    <div className="pl-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-2xl transition-all hover:border-pl-green/40 hover:shadow-pl-purple/40">
      {/* Top Meta Header: Kickoff Time, Stadium, Broadcaster, Lock Countdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pl-purple-light/40 pb-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200" suppressHydrationWarning>
            {formatDate(match.kickoffTime)}
          </span>
          {match.broadcastInfo && (
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Tv className="h-3.5 w-3.5 text-pl-cyan" />
              {match.broadcastInfo}
            </span>
          )}
        </div>
        <CountdownTimer kickoffTime={match.kickoffTime} status={match.status} />
      </div>

      {/* Main Fixture Body: Teams + Score Controls */}
      <div className="my-5 grid grid-cols-11 items-center gap-2">
        {/* Home Team */}
        <div className="col-span-4 flex flex-col items-center text-center">
          <div className="relative mb-2 h-14 w-14 sm:h-16 sm:w-16 transition-transform group-hover:scale-105">
            <img
              src={match.homeTeam.crestUrl}
              alt={match.homeTeam.name}
              className="h-full w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
          <span className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            {match.homeTeam.shortName || match.homeTeam.name}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">HOME</span>
        </div>

        {/* Prediction Steppers / Live Actual Score */}
        <div className="col-span-3 flex flex-col items-center justify-center">
          {isMatchLive || isMatchFinished ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 rounded-xl bg-pl-purple-deepest/90 px-4 py-2 border border-pl-purple-light shadow-inner">
                <span className="font-display text-3xl font-extrabold text-white">
                  {match.homeScore ?? 0}
                </span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="font-display text-3xl font-extrabold text-white">
                  {match.awayScore ?? 0}
                </span>
              </div>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-pl-green">
                {isMatchLive ? "Live Score" : "Full Time"}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ScoreStepper
                value={homeScore}
                onChange={onHomeScoreChange}
                disabled={isLocked}
                teamName={match.homeTeam.name}
              />
              <span className="font-display text-lg font-bold text-slate-500">v</span>
              <ScoreStepper
                value={awayScore}
                onChange={onAwayScoreChange}
                disabled={isLocked}
                teamName={match.awayTeam.name}
              />
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="col-span-4 flex flex-col items-center text-center">
          <div className="relative mb-2 h-14 w-14 sm:h-16 sm:w-16 transition-transform group-hover:scale-105">
            <img
              src={match.awayTeam.crestUrl}
              alt={match.awayTeam.name}
              className="h-full w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
          <span className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
            {match.awayTeam.shortName || match.awayTeam.name}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">AWAY</span>
        </div>
      </div>

      {/* Prediction Settlement Status Badge (If match finished / evaluated) */}
      {match.userPrediction && isMatchFinished && (
        <div className="mb-3 flex items-center justify-center">
          {match.userPrediction.isExactHit ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-pl-green/20 border border-pl-green/50 px-3 py-1 text-xs font-bold text-pl-green">
              <Award className="h-4 w-4" />
              +3 PTS EXACT SCORE HIT!
            </span>
          ) : match.userPrediction.isOutcomeHit ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-pl-cyan/20 border border-pl-cyan/50 px-3 py-1 text-xs font-bold text-pl-cyan">
              <CheckCircle2 className="h-4 w-4" />
              +1 PT CORRECT OUTCOME
            </span>
          ) : (
            <span className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-400">
              0 PTS (Predicted {match.userPrediction.predictedHomeScore}-{match.userPrediction.predictedAwayScore})
            </span>
          )}
        </div>
      )}

      {/* Community Consensus Bar (Rendered ONLY when real predictions exist) */}
      <div className="mt-2 border-t border-pl-purple-light/30 pt-3">
        {match.consensus && match.consensus.totalPredictions > 0 ? (
          <div>
            <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-300">
              <span className="text-pl-green">{match.homeTeam.abbr} Win: {match.consensus.homeWinPct}%</span>
              <span className="text-pl-gold">Draw: {match.consensus.drawPct}%</span>
              <span className="text-pl-pink">{match.awayTeam.abbr} Win: {match.consensus.awayWinPct}%</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-pl-purple-deepest border border-pl-purple-light/40">
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
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
              <Users className="h-3 w-3 text-slate-400" />
              <span>{match.consensus.totalPredictions} community predictions</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 py-0.5">
            <Sparkles className="h-3.5 w-3.5 text-pl-green" />
            <span>No community predictions submitted yet • Be the first to pick!</span>
          </div>
        )}
      </div>
    </div>
  );
}
