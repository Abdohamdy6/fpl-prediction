import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncClubs, fetchGameweekMatches, fetchBroadcastDetails } from "@/lib/api/pl-client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // Allow sync in development or if role is ADMIN
    if (process.env.NODE_ENV !== "development" && role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { gameweek = 1, season = 2026 } = await req.json().catch(() => ({ gameweek: 1, season: 2026 }));

    // 1. Sync Clubs
    const clubsSynced = await syncClubs();

    // 2. Sync Gameweek
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 4);

    const gwRecord = await db.gameweek.upsert({
      where: { id: gameweek },
      update: { isCurrent: true },
      create: {
        id: gameweek,
        name: `Gameweek ${gameweek}`,
        deadline,
        isCurrent: true,
      },
    });

    // 3. Fetch from PulseLive SDP
    const matchesData = await fetchGameweekMatches(gameweek, season);
    let matchesCount = 0;

    if (Array.isArray(matchesData) && matchesData.length > 0) {
      const sportIds = matchesData.map((m: any) => String(m.id));
      const broadcastMap = await fetchBroadcastDetails(sportIds);

      for (const m of matchesData) {
        const sportDataId = String(m.id);
        const homeClubId = String(m.teams?.[0]?.team?.id || "1");
        const awayClubId = String(m.teams?.[1]?.team?.id || "2");

        const kickoffMillis = m.kickoff?.millis || Date.now() + 86400000;
        const kickoffTime = new Date(kickoffMillis);

        await db.match.upsert({
          where: { sportDataId },
          update: {
            kickoffTime,
            lockTime: kickoffTime,
            homeScore: m.teams?.[0]?.score ?? null,
            awayScore: m.teams?.[1]?.score ?? null,
            status: m.status === "C" ? "FINISHED" : m.status === "I" ? "IN_PLAY" : "SCHEDULED",
            broadcastInfo: broadcastMap[sportDataId] || "Sky Sports / TNT",
            updatedAt: new Date(),
          },
          create: {
            sportDataId,
            gameweekId: gameweek,
            homeTeamId: homeClubId,
            awayTeamId: awayClubId,
            kickoffTime,
            lockTime: kickoffTime,
            homeScore: m.teams?.[0]?.score ?? null,
            awayScore: m.teams?.[1]?.score ?? null,
            status: m.status === "C" ? "FINISHED" : m.status === "I" ? "IN_PLAY" : "SCHEDULED",
            broadcastInfo: broadcastMap[sportDataId] || "Sky Sports / TNT",
          },
        });
        matchesCount++;
      }
    }

    return NextResponse.json({
      message: "Sync completed successfully",
      clubsSynced,
      matchesSynced: matchesCount,
      gameweek,
    });
  } catch (error: any) {
    console.error("Admin sync error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute sync" }, { status: 500 });
  }
}
