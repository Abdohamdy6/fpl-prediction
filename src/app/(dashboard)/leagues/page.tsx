"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, Plus, KeyRound, CheckCircle2, AlertCircle, Trophy, Copy, Check } from "lucide-react";
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
    <div className="flex flex-col gap-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-wider text-white">
          MINI-LEAGUES
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          Create private leagues, invite friends with a code, and battle for the title
        </p>
      </div>

      {/* Status Feedback */}
      {message && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl p-4 text-xs font-bold border",
            message.type === "success"
              ? "bg-pl-green/15 text-pl-green border-pl-green/40"
              : "bg-red-500/15 text-red-400 border-red-500/40"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Create & Join Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Form */}
        <div className="pl-card rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-pl-green" />
            <h2 className="font-display text-xl font-bold uppercase text-white">
              Create a Private League
            </h2>
          </div>
          <form onSubmit={handleCreateLeague} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="League Name (e.g. Office Derby)"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="flex-1 rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-pl-green focus:outline-none focus:ring-1 focus:ring-pl-green"
            />
            <button
              type="submit"
              disabled={creating || !session}
              className="rounded-xl bg-pl-green px-5 py-2.5 text-xs font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-colors glow-green active:scale-95 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* Join Form */}
        <div className="pl-card rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="h-5 w-5 text-pl-cyan" />
            <h2 className="font-display text-xl font-bold uppercase text-white">
              Join with League Code
            </h2>
          </div>
          <form onSubmit={handleJoinLeague} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. PL-8X49"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="flex-1 rounded-xl border border-pl-purple-light bg-pl-purple-deepest px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-500 uppercase focus:border-pl-cyan focus:outline-none focus:ring-1 focus:ring-pl-cyan"
            />
            <button
              type="submit"
              disabled={joining || !session}
              className="rounded-xl bg-pl-cyan px-5 py-2.5 text-xs font-bold text-pl-purple-deepest hover:bg-pl-cyan-hover transition-colors active:scale-95 disabled:opacity-50"
            >
              {joining ? "Joining..." : "Join League"}
            </button>
          </form>
        </div>
      </div>

      {/* User's Mini-Leagues Standings */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
          YOUR ACTIVE LEAGUES ({leagues.length})
        </h2>

        {loading ? (
          <div className="h-48 rounded-2xl bg-pl-purple-deeper/50 animate-pulse" />
        ) : leagues.length === 0 ? (
          <div className="pl-card rounded-3xl p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-500 mb-3" />
            <h3 className="font-display text-xl font-bold uppercase text-white">
              No Leagues Joined
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Create a league or enter an invite code above to get started.
            </p>
          </div>
        ) : (
          leagues.map((league) => (
            <div key={league.id} className="pl-card rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-pl-purple-light/40 pb-4 mb-4">
                <div>
                  <h3 className="font-display text-2xl font-black uppercase text-white">
                    {league.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Created by @{league.creator.username} • {league.memberCount} Members
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Invite Code:</span>
                  <button
                    onClick={() => copyCode(league.code)}
                    className="flex items-center gap-1.5 rounded-lg border border-pl-purple-light bg-pl-purple-deepest px-3 py-1.5 text-xs font-mono font-bold text-pl-green hover:border-pl-green"
                  >
                    {league.code}
                    {copiedCode === league.code ? (
                      <Check className="h-3.5 w-3.5 text-pl-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* League Standings Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-400 border-b border-pl-purple-light/20">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Predictor</th>
                      <th className="py-2 px-3 text-center">Exact (3pt)</th>
                      <th className="py-2 px-3 text-center">Outcome (1pt)</th>
                      <th className="py-2 px-3 text-right text-pl-green font-bold">Total Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pl-purple-light/20">
                    {league.leaderboard.map((member: any, idx: number) => {
                      const isMe = member.id === (session?.user as any)?.id;
                      return (
                        <tr
                          key={member.id}
                          className={cn(
                            "transition-colors",
                            isMe ? "bg-pl-green/10 font-bold" : "hover:bg-pl-purple-deeper/50"
                          )}
                        >
                          <td className="py-2.5 px-3 font-display text-base text-slate-400">
                            #{idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={cn(isMe ? "text-pl-green font-bold" : "text-white")}>
                              {member.username}
                            </span>
                            {isMe && (
                              <span className="ml-2 rounded bg-pl-green/20 px-1.5 py-0.5 text-[9px] font-bold text-pl-green">
                                YOU
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-300">
                            {member.exactScoreCount}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-300">
                            {member.correctOutcomeCount}
                          </td>
                          <td className="py-2.5 px-3 text-right font-display text-lg text-pl-green">
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
