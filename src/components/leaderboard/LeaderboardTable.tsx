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
    <div className="pl-card overflow-hidden rounded-2xl shadow-xl">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-pl-purple-light/40 p-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-pl-gold" />
          <h2 className="font-display text-xl font-bold tracking-wider text-white">
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
            className="w-full rounded-xl border border-pl-purple-light bg-pl-purple-deepest py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
          />
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-pl-purple-light/30 bg-pl-purple-deeper text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 pl-5 pr-2 font-semibold">Rank</th>
              <th className="px-4 py-3.5 font-semibold">Predictor</th>
              <th className="px-4 py-3.5 font-semibold text-center hidden sm:table-cell">Club</th>
              <th className="px-4 py-3.5 font-semibold text-center">Exact (3pt)</th>
              <th className="px-4 py-3.5 font-semibold text-center">Outcome (1pt)</th>
              <th className="py-3.5 pl-4 pr-5 font-bold text-right text-pl-green">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pl-purple-light/20">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No predictors found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                const isTop3 = user.rank <= 3;

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
                    <td className="py-3.5 pl-5 pr-2">
                      <div className="flex items-center gap-1.5">
                        {user.rank === 1 ? (
                          <Medal className="h-5 w-5 text-yellow-400" />
                        ) : user.rank === 2 ? (
                          <Medal className="h-5 w-5 text-slate-300" />
                        ) : user.rank === 3 ? (
                          <Medal className="h-5 w-5 text-amber-600" />
                        ) : (
                          <span className="font-display text-base font-bold text-slate-400 pl-1">
                            #{user.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-pl-purple-accent to-pl-pink text-xs font-bold text-white uppercase shadow-sm">
                          {user.username.slice(0, 2)}
                        </div>
                        <div>
                          <span
                            className={cn(
                              "font-medium",
                              isCurrentUser ? "text-pl-green font-bold" : "text-white"
                            )}
                          >
                            {user.username}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-2 rounded bg-pl-green/20 px-1.5 py-0.5 text-[10px] font-bold text-pl-green">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Favorite Club */}
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell">
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
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-300">
                      {user.exactScoreCount}
                    </td>

                    {/* Correct Outcomes */}
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-300">
                      {user.correctOutcomeCount}
                    </td>

                    {/* Total Points */}
                    <td className="py-3.5 pl-4 pr-5 text-right font-display text-xl font-bold text-pl-green">
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
