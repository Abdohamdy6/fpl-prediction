"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LeaderboardTable, { LeaderboardEntry } from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setUsers(data.leaderboard);
      })
      .catch((err) => console.error("Leaderboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const currentUserId = (session?.user as any)?.id;

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-wider text-white">
          GLOBAL PREDICTOR RANKINGS
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          Rankings are updated dynamically after each Premier League match concludes
        </p>
      </div>

      {loading ? (
        <div className="pl-card h-96 rounded-2xl animate-pulse bg-pl-purple-deeper/50" />
      ) : (
        <LeaderboardTable users={users} currentUserId={currentUserId} />
      )}
    </div>
  );
}
