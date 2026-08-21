"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, Plus, KeyRound, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaguesPage() {
  const { data: session } = useSession();
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadLeagues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leagues");
      const data = await res.json();
      if (data.leagues) setLeagues(data.leagues);
    } catch (err) {
      console.error("Error loading leagues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues();
  }, []);

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setCreating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create league");

      setMessage({ text: `League "${createName}" created successfully!`, type: "success" });
      setCreateName("");
      loadLeagues();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleJoinLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    setMessage(null);

    try {
      const res = await fetch("/api/leagues/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join league");

      setMessage({ text: data.message || "Joined league!", type: "success" });
      setJoinCode("");
      loadLeagues();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setJoining(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 sm:pb-16">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-wider text-white">
          PRIVATE MINI-LEAGUES
        </h1>
        <p className="text-xs font-bold text-slate-400">
          Create custom leagues, invite your mates with an instant code, and battle for the crown
        </p>
      </div>

      {/* Status Feedback */}
      {message && (
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl p-4 text-xs font-bold border shadow-md",
            message.type === "success"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              : "bg-rose-500/20 text-rose-400 border-rose-500/40"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Create & Join Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Create Form */}
        <div className="pl-card rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2.5 mb-3.5">
            <Plus className="h-5 w-5 text-[#00FF85]" />
            <h2 className="font-display text-lg sm:text-xl font-bold uppercase text-white">
              Create a Private League
            </h2>
          </div>
          <form onSubmit={handleCreateLeague} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              required
              placeholder="League Name (e.g. London Derby Clan)"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-[#0b0f17] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-[#00FF85] focus:outline-none focus:ring-1 focus:ring-[#00FF85]"
            />
            <button
              type="submit"
              disabled={creating || !session}
              className="rounded-xl bg-[#00FF85] px-5 py-2.5 text-xs font-black text-[#080B11] hover:bg-[#00e676] transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* Join Form */}
        <div className="pl-card rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2.5 mb-3.5">
            <KeyRound className="h-5 w-5 text-sky-400" />
            <h2 className="font-display text-lg sm:text-xl font-bold uppercase text-white">
              Join with League Code
            </h2>
          </div>
          <form onSubmit={handleJoinLeague} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              required
              placeholder="e.g. PL-8X49"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-xl border border-slate-700 bg-[#0b0f17] px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder:text-slate-500 uppercase focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            <button
              type="submit"
              disabled={joining || !session}
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-black text-[#080B11] hover:bg-sky-400 transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {joining ? "Joining..." : "Join"}
            </button>
          </form>
        </div>
      </div>

      {/* User's Mini-Leagues Standings */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
          YOUR ACTIVE LEAGUES ({leagues.length})
        </h2>

        {loading ? (
          <div className="h-40 rounded-2xl bg-[#0b0f17] animate-pulse" />
        ) : leagues.length === 0 ? (
          <div className="pl-card rounded-2xl p-8 sm:p-10 text-center border border-slate-800">
            <Users className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <h3 className="font-display text-lg font-bold uppercase text-white">
              No Leagues Joined Yet
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Create a custom mini-league or enter an invite code above to get started.
            </p>
          </div>
        ) : (
          leagues.map((league) => (
            <div key={league.id} className="pl-card rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white">
                    {league.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Created by @{league.creator.username} • {league.memberCount} Competitors
                  </span>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <span className="text-xs font-bold text-slate-400">Invite Code:</span>
                  <button
                    onClick={() => copyCode(league.code)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121824] px-3 py-1.5 text-xs font-mono font-bold text-[#00FF85] hover:border-[#00FF85] cursor-pointer"
                  >
                    {league.code}
                    {copiedCode === league.code ? (
                      <Check className="h-4 w-4 text-[#00FF85]" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* League Standings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[10px] sm:text-xs uppercase text-slate-400 border-b border-slate-800 bg-[#0c1018] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Predictor</th>
                      <th className="py-2.5 px-3 text-center">Exact Hits</th>
                      <th className="py-2.5 px-3 text-center hidden xs:table-cell">Outcome</th>
                      <th className="py-2.5 px-3 text-right text-[#00FF85] font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {league.leaderboard.map((member: any, idx: number) => {
                      const isMe = member.id === (session?.user as any)?.id;
                      return (
                        <tr
                          key={member.id}
                          className={cn(
                            "transition-colors",
                            isMe ? "bg-emerald-500/15 font-bold border-l-4 border-l-[#00FF85]" : "hover:bg-[#121824]/60"
                          )}
                        >
                          <td className="py-2.5 px-3 font-display text-sm sm:text-base text-slate-400 tabular-nums">
                            #{idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={cn(isMe ? "text-[#00FF85] font-bold" : "text-white")}>
                              {member.username}
                            </span>
                            {isMe && (
                              <span className="ml-1.5 rounded bg-[#00FF85] px-1.5 py-0.2 text-[8px] font-black text-[#080B11] uppercase">
                                YOU
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-300 font-bold tabular-nums">
                            {member.exactScoreCount}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-300 font-bold hidden xs:table-cell tabular-nums">
                            {member.correctOutcomeCount}
                          </td>
                          <td className="py-2.5 px-3 text-right font-display text-base sm:text-lg text-[#00FF85] font-black tabular-nums">
                            {member.totalPoints}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
