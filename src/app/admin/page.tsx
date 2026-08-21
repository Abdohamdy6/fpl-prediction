"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Shield, RefreshCw, Save, CheckCircle2, AlertCircle, Radio, Activity } from "lucide-react";

export default function AdminPage() {
  const { data: session } = useSession();
  const [gameweek, setGameweek] = useState(1);
  const [matches, setMatches] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [savingMatchId, setSavingMatchId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [scores, setScores] = useState<Record<string, { home: number; away: number; status: string }>>({});

  const loadMatches = async (gw: number) => {
    try {
      const res = await fetch(`/api/proxy/gameweek?gw=${gw}`);
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
        const scoreMap: Record<string, { home: number; away: number; status: string }> = {};
        for (const m of data.matches) {
          scoreMap[m.id] = {
            home: m.homeScore ?? 0,
            away: m.awayScore ?? 0,
            status: m.status,
          };
        }
        setScores(scoreMap);
      }
    } catch (err) {
      console.error("Error loading admin matches:", err);
    }
  };

  useEffect(() => {
    loadMatches(gameweek);
  }, [gameweek]);

  const handleSync = async () => {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameweek }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");

      setFeedback({
        text: `Sync Success: ${data.clubsSynced} clubs, ${data.matchesSynced} matches ingested.`,
        type: "success",
      });
      loadMatches(gameweek);
    } catch (err: any) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setSyncing(false);
    }
  };

  const handleScoreOverride = async (matchId: string) => {
    const score = scores[matchId];
    if (!score) return;

    setSavingMatchId(matchId);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          homeScore: score.home,
          awayScore: score.away,
          status: score.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update match");

      setFeedback({ text: data.message, type: "success" });
      loadMatches(gameweek);
    } catch (err: any) {
      setFeedback({ text: err.message, type: "error" });
    } finally {
      setSavingMatchId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pl-pink/20 border border-pl-pink/40 text-pl-pink">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wider text-white">
              ADMIN CONTROL CENTER
            </h1>
            <p className="text-xs text-slate-400">
              Manage data ingestion, circuit breakers, and manual match score overrides
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 rounded-xl bg-pl-green px-5 py-2.5 text-xs font-bold text-pl-purple-deepest hover:bg-pl-green-hover transition-colors glow-green disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing PL Endpoints..." : "Fetch & Sync PL Feeds"}
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-bold border ${
            feedback.type === "success"
              ? "bg-pl-green/15 text-pl-green border-pl-green/40"
              : "bg-red-500/15 text-red-400 border-red-500/40"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Fixtures & Score Override Editor */}
      <div className="pl-card rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-pl-purple-light/40 pb-4">
          <h2 className="font-display text-xl font-bold uppercase text-white">
            Gameweek {gameweek} Match Overrides
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select GW:</span>
            <select
              value={gameweek}
              onChange={(e) => setGameweek(parseInt(e.target.value, 10))}
              className="rounded-lg border border-pl-purple-light bg-pl-purple-deepest px-3 py-1 text-xs text-white"
            >
              {Array.from({ length: 38 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Gameweek {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No matches loaded. Click &quot;Fetch &amp; Sync PL Feeds&quot; to populate.
          </div>
        ) : (
          <div className="divide-y divide-pl-purple-light/20">
            {matches.map((match) => {
              const score = scores[match.id] || { home: 0, away: 0, status: "SCHEDULED" };
              const isSaving = savingMatchId === match.id;

              return (
                <div
                  key={match.id}
                  className="py-4 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 w-full md:w-1/2">
                    <img
                      src={match.homeTeam.crestUrl}
                      alt={match.homeTeam.name}
                      className="h-7 w-7 object-contain"
                    />
                    <span className="font-bold text-sm text-white">
                      {match.homeTeam.name}
                    </span>
                    <span className="text-slate-500 font-bold">vs</span>
                    <span className="font-bold text-sm text-white">
                      {match.awayTeam.name}
                    </span>
                    <img
                      src={match.awayTeam.crestUrl}
                      alt={match.awayTeam.name}
                      className="h-7 w-7 object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      value={score.home}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [match.id]: {
                            ...prev[match.id],
                            home: parseInt(e.target.value, 10) || 0,
                          },
                        }))
                      }
                      className="w-14 rounded-lg border border-pl-purple-light bg-pl-purple-deepest px-2 py-1 text-center font-display text-lg text-white"
                    />
                    <span className="font-bold text-slate-400">:</span>
                    <input
                      type="number"
                      min={0}
                      value={score.away}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [match.id]: {
                            ...prev[match.id],
                            away: parseInt(e.target.value, 10) || 0,
                          },
                        }))
                      }
                      className="w-14 rounded-lg border border-pl-purple-light bg-pl-purple-deepest px-2 py-1 text-center font-display text-lg text-white"
                    />

                    <select
                      value={score.status}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [match.id]: {
                            ...prev[match.id],
                            status: e.target.value,
                          },
                        }))
                      }
                      className="rounded-lg border border-pl-purple-light bg-pl-purple-deepest px-2 py-1.5 text-xs text-white"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PLAY">Live In-Play</option>
                      <option value="FINISHED">Finished (Settle)</option>
                      <option value="POSTPONED">Postponed</option>
                    </select>

                    <button
                      onClick={() => handleScoreOverride(match.id)}
                      disabled={isSaving}
                      className="flex items-center gap-1 rounded-lg bg-pl-purple-light border border-pl-green/40 px-3 py-1.5 text-xs font-bold text-pl-green hover:bg-pl-purple-accent transition-colors disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isSaving ? "Saving..." : "Save & Settle"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
