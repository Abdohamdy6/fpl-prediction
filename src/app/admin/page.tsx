"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Shield, RefreshCw, Save, CheckCircle2, AlertCircle, Settings } from "lucide-react";

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
    <div className="flex flex-col gap-6 pb-24 sm:pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-slate-800 text-[#00FF85] shrink-0 border border-slate-700">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              ADMIN CONTROL CENTER
            </h1>
            <p className="text-xs font-bold text-slate-400">
              Manage live official feeds, circuit breakers, and score overrides
            </p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#00FF85] px-5 py-3 text-xs sm:text-sm font-black text-[#080B11] hover:bg-[#00e676] transition-colors shadow-md disabled:opacity-50 cursor-pointer active:scale-95"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing PL Endpoints..." : "Fetch & Sync PL Feeds"}
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs font-bold border shadow-md ${
            feedback.type === "success"
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              : "bg-rose-500/20 text-rose-400 border-rose-500/40"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Fixtures & Score Override Editor */}
      <div className="pl-card rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-400" />
            <h2 className="font-display text-lg font-bold uppercase text-white">
              Gameweek {gameweek} Match Overrides
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Select GW:</span>
            <select
              value={gameweek}
              onChange={(e) => setGameweek(parseInt(e.target.value, 10))}
              className="rounded-lg border border-slate-700 bg-[#121824] px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
            >
              {Array.from({ length: 38 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  GW {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No matches loaded for GW {gameweek}. Click &quot;Fetch &amp; Sync PL Feeds&quot; to populate.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {matches.map((match) => {
              const score = scores[match.id] || { home: 0, away: 0, status: "SCHEDULED" };
              const isSaving = savingMatchId === match.id;

              return (
                <div
                  key={match.id}
                  className="py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 w-full md:w-1/2">
                    <img
                      src={match.homeTeam.crestUrl}
                      alt={match.homeTeam.name}
                      className="h-7 w-7 object-contain shrink-0 filter drop-shadow"
                    />
                    <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[110px] sm:max-w-none">
                      {match.homeTeam.name}
                    </span>
                    <span className="text-slate-500 font-bold text-xs uppercase px-1">vs</span>
                    <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[110px] sm:max-w-none">
                      {match.awayTeam.name}
                    </span>
                    <img
                      src={match.awayTeam.crestUrl}
                      alt={match.awayTeam.name}
                      className="h-7 w-7 object-contain shrink-0 filter drop-shadow"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-1.5">
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
                        className="w-12 sm:w-14 rounded-lg border border-slate-700 bg-[#0b0f17] px-2 py-1.5 text-center font-display text-base sm:text-lg font-black text-white tabular-nums"
                      />
                      <span className="font-bold text-slate-500">:</span>
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
                        className="w-12 sm:w-14 rounded-lg border border-slate-700 bg-[#0b0f17] px-2 py-1.5 text-center font-display text-base sm:text-lg font-black text-white tabular-nums"
                      />
                    </div>

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
                      className="rounded-lg border border-slate-700 bg-[#121824] px-2.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PLAY">Live In-Play</option>
                      <option value="FINISHED">Finished (Settle)</option>
                      <option value="POSTPONED">Postponed</option>
                    </select>

                    <button
                      onClick={() => handleScoreOverride(match.id)}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 rounded-lg bg-[#00FF85] px-3 py-1.5 text-xs font-black text-[#080B11] hover:bg-[#00e676] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isSaving ? "Saving..." : "Settle"}
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
