"use client";

import { useState } from "react";
import { Trophy, Medal, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  totalPoints: number;
  exactScoreCount: number;
  correctOutcomeCount: number;
  favoriteClub?: {
    name: string;
    abbr: string;
    crestUrl: string;
    primaryColor: string;
  } | null;
}

interface LeaderboardTableProps {
  users: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardTable({ users, currentUserId }: LeaderboardTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pl-card overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-pl-purple-light/40 p-3.5 sm:p-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-pl-gold shrink-0" />
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider text-white">
            GLOBAL STANDINGS
          </h2>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search predictor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest py-1.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
          />
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-pl-purple-light/30 bg-pl-purple-deeper text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-2.5 pl-3 sm:pl-5 pr-1 font-semibold w-12 sm:w-16">Rank</th>
              <th className="px-2.5 sm:px-4 py-2.5 font-semibold">Predictor</th>
              <th className="px-2 sm:px-4 py-2.5 font-semibold text-center hidden sm:table-cell">Club</th>
              <th className="px-2 sm:px-4 py-2.5 font-semibold text-center">Exact</th>
              <th className="px-2 sm:px-4 py-2.5 font-semibold text-center hidden xs:table-cell">Outcome</th>
              <th className="py-2.5 pl-2 sm:pl-4 pr-3 sm:pr-5 font-bold text-right text-pl-green">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pl-purple-light/20">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs sm:text-sm text-slate-400">
                  No predictors found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isCurrentUser = user.id === currentUserId;

                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "transition-colors",
                      isCurrentUser
                        ? "bg-pl-green/10 font-semibold"
                        : "hover:bg-pl-purple-deeper/70"
                    )}
                  >
                    {/* Rank */}
                    <td className="py-2.5 pl-3 sm:pl-5 pr-1">
                      <div className="flex items-center gap-1">
                        {user.rank === 1 ? (
                          <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                        ) : user.rank === 2 ? (
                          <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                        ) : user.rank === 3 ? (
                          <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                        ) : (
                          <span className="font-display text-sm sm:text-base font-bold text-slate-400 pl-0.5">
                            #{user.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Username + Club Crest on mobile */}
                    <td className="px-2.5 sm:px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-[10px] sm:text-xs font-bold text-white uppercase shadow-sm shrink-0">
                          {user.username.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "font-medium truncate block max-w-[100px] sm:max-w-[180px]",
                                isCurrentUser ? "text-pl-green font-bold" : "text-white"
                              )}
                            >
                              {user.username}
                            </span>
                            {user.favoriteClub && (
                              <img
                                src={user.favoriteClub.crestUrl}
                                alt={user.favoriteClub.name}
                                className="h-4 w-4 object-contain inline sm:hidden shrink-0"
                              />
                            )}
                          </div>
                          {isCurrentUser && (
                            <span className="rounded bg-pl-green/20 px-1 py-0.2 text-[9px] font-bold text-pl-green inline-block">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Favorite Club (Desktop) */}
                    <td className="px-2 sm:px-4 py-2.5 text-center hidden sm:table-cell">
                      {user.favoriteClub ? (
                        <div className="inline-flex items-center gap-1.5">
                          <img
                            src={user.favoriteClub.crestUrl}
                            alt={user.favoriteClub.name}
                            className="h-5 w-5 object-contain"
                          />
                          <span className="text-xs font-semibold text-slate-300">
                            {user.favoriteClub.abbr}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>

                    {/* Exact Hits */}
                    <td className="px-2 sm:px-4 py-2.5 text-center font-semibold text-slate-300">
                      {user.exactScoreCount}
                    </td>

                    {/* Correct Outcomes */}
                    <td className="px-2 sm:px-4 py-2.5 text-center font-semibold text-slate-300 hidden xs:table-cell">
                      {user.correctOutcomeCount}
                    </td>

                    {/* Total Points */}
                    <td className="py-2.5 pl-2 sm:pl-4 pr-3 sm:pr-5 text-right font-display text-base sm:text-xl font-bold text-pl-green">
                      {user.totalPoints}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
