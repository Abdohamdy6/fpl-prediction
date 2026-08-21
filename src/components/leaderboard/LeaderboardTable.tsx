"use client";

import { useState } from "react";
import { Trophy, Medal, Search, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardTable({ users, currentUserId }: any) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u: any) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = users.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Top 3 Podium Showcase */}
      {users.length >= 3 && !search && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end max-w-2xl mx-auto w-full pt-2 pb-2">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex flex-col items-center p-3.5 sm:p-4 rounded-xl bg-[#0f1521] border border-slate-700 shadow-md text-center">
              <Medal className="h-6 w-6 text-slate-300 mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2ND PLACE</span>
              <span className="font-display text-sm sm:text-base font-bold text-white truncate max-w-[90px] sm:max-w-[140px] mt-1">
                {top3[1].username}
              </span>
              <span className="font-display text-xl sm:text-2xl font-black text-[#00FF85] mt-1 tabular-nums">
                {top3[1].totalPoints} <span className="text-[10px] font-sans font-bold text-slate-400">PTS</span>
              </span>
            </div>
          )}

          {/* 1st Place (Champion) */}
          {top3[0] && (
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-400/80 shadow-xl text-center scale-105 z-10">
              <Crown className="h-8 w-8 text-amber-400 mb-1 animate-bounce" />
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">LEAGUE LEADER</span>
              <span className="font-display text-base sm:text-lg font-black text-white truncate max-w-[110px] sm:max-w-[160px] mt-1">
                {top3[0].username}
              </span>
              <span className="font-display text-2xl sm:text-4xl font-black text-amber-400 mt-1 tabular-nums">
                {top3[0].totalPoints} <span className="text-xs font-sans font-bold text-slate-300">PTS</span>
              </span>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex flex-col items-center p-3.5 sm:p-4 rounded-xl bg-[#0f1521] border border-slate-700 shadow-md text-center">
              <Medal className="h-6 w-6 text-amber-600 mb-1" />
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">3RD PLACE</span>
              <span className="font-display text-sm sm:text-base font-bold text-white truncate max-w-[90px] sm:max-w-[140px] mt-1">
                {top3[2].username}
              </span>
              <span className="font-display text-xl sm:text-2xl font-black text-sky-400 mt-1 tabular-nums">
                {top3[2].totalPoints} <span className="text-[10px] font-sans font-bold text-slate-400">PTS</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Standings Card */}
      <div className="pl-card overflow-hidden rounded-2xl shadow-xl border border-slate-800">
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 p-4 sm:p-5 bg-[#0b0f17]">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
            <h2 className="font-display text-lg font-bold tracking-wider text-white uppercase">
              GLOBAL STANDINGS
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search predictor username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#121824] py-2 pl-10 pr-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-[#00FF85] focus:outline-none focus:ring-1 focus:ring-[#00FF85]"
            />
          </div>
        </div>

        {/* Standings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-800 bg-[#0c1018] text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="py-3 pl-4 sm:pl-6 pr-1 w-12 sm:w-16">Rank</th>
                <th className="px-3 sm:px-4 py-3">Predictor</th>
                <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">Club</th>
                <th className="px-2 sm:px-4 py-3 text-center">Exact Hits</th>
                <th className="px-2 sm:px-4 py-3 text-center hidden xs:table-cell">Outcome</th>
                <th className="py-3 pl-2 sm:pl-4 pr-4 sm:pr-6 text-right text-[#00FF85] font-black">Total Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs sm:text-sm text-slate-400">
                    No predictors found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => {
                  const isCurrentUser = user.id === currentUserId;

                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        "transition-colors",
                        isCurrentUser
                          ? "bg-emerald-500/15 font-bold border-l-4 border-l-[#00FF85]"
                          : "hover:bg-[#121824]/60"
                      )}
                    >
                      {/* Rank */}
                      <td className="py-3 pl-4 sm:pl-6 pr-1">
                        <div className="flex items-center gap-1">
                          {user.rank === 1 ? (
                            <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                          ) : user.rank === 2 ? (
                            <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                          ) : user.rank === 3 ? (
                            <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                          ) : (
                            <span className="font-display text-sm sm:text-base font-bold text-slate-400 pl-0.5 tabular-nums">
                              #{user.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-[#121824] border border-slate-700 text-[10px] sm:text-xs font-bold text-[#00FF85] uppercase shrink-0">
                            {user.username.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "font-semibold truncate block max-w-[110px] sm:max-w-[200px]",
                                  isCurrentUser ? "text-[#00FF85] font-bold" : "text-white"
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
                              <span className="rounded bg-[#00FF85] px-1.5 py-0.2 text-[9px] font-black text-[#080B11] inline-block uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Club */}
                      <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">
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
                      <td className="px-2 sm:px-4 py-3 text-center font-bold text-white tabular-nums">
                        {user.exactScoreCount}
                      </td>

                      {/* Outcome */}
                      <td className="px-2 sm:px-4 py-3 text-center font-bold text-slate-300 hidden xs:table-cell tabular-nums">
                        {user.correctOutcomeCount}
                      </td>

                      {/* Points */}
                      <td className="py-3 pl-2 sm:pl-4 pr-4 sm:pr-6 text-right font-display text-base sm:text-xl font-black text-[#00FF85] tabular-nums">
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
    </div>
  );
}
