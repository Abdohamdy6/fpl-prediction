import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ACTIVE_PL_CLUB_IDS } from "@/lib/api/pl-client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch strictly the 20 active Premier League clubs
    const clubs = await db.club.findMany({
      where: {
        id: { in: ACTIVE_PL_CLUB_IDS },
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    // Find Season Kickoff Time (Earliest match in Gameweek 1)
    const firstMatch = await db.match.findFirst({
      where: { gameweekId: 1 },
      orderBy: { kickoffTime: "asc" },
    });

    const seasonKickoffTime = firstMatch?.kickoffTime || new Date("2026-08-21T19:00:00Z");
    const isLocked = new Date() >= new Date(seasonKickoffTime);

    // Fetch user prediction if logged in
    let userPrediction = null;
    if (userId) {
      const pred = await db.seasonTablePrediction.findUnique({
        where: { userId },
      });
      if (pred) {
        try {
          const parsed = JSON.parse(pred.rankings) as string[];
          // Filter to ensure only active 20 PL clubs are present in the rankings
          const validRankings = parsed.filter((id) => ACTIVE_PL_CLUB_IDS.includes(id));

          if (validRankings.length === 20) {
            userPrediction = {
              id: pred.id,
              rankings: validRankings,
              pointsEarned: pred.pointsEarned,
              isSettled: pred.isSettled,
              updatedAt: pred.updatedAt,
            };
          }
        } catch {
          userPrediction = null;
        }
      }
    }

    return NextResponse.json(
      {
        clubs,
        seasonKickoffTime,
        isLocked,
        userPrediction,
      },
      {
        headers: {
          "Cache-Control": userId
            ? "private, no-cache, no-store, max-age=0, must-revalidate"
            : "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Table prediction GET error:", error);
    return NextResponse.json({ error: "Failed to fetch table prediction data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Check Lock Time
    const firstMatch = await db.match.findFirst({
      where: { gameweekId: 1 },
      orderBy: { kickoffTime: "asc" },
    });

    const seasonKickoffTime = firstMatch?.kickoffTime || new Date("2026-08-21T19:00:00Z");
    if (new Date() >= new Date(seasonKickoffTime)) {
      return NextResponse.json(
        { error: "Season table predictions are now locked since the opening match has kicked off!" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { rankings } = body; // Array of 20 club IDs

    if (!Array.isArray(rankings) || rankings.length !== 20) {
      return NextResponse.json(
        { error: "You must rank all 20 Premier League clubs." },
        { status: 400 }
      );
    }

    // Validate that all 20 IDs belong to the active Premier League clubs
    const uniqueClubs = new Set(rankings);
    if (uniqueClubs.size !== 20) {
      return NextResponse.json(
        { error: "Duplicate clubs found. Exactly 20 unique clubs required." },
        { status: 400 }
      );
    }

    for (const clubId of rankings) {
      if (!ACTIVE_PL_CLUB_IDS.includes(clubId)) {
        return NextResponse.json(
          { error: `Invalid club ID: ${clubId}. Only active Premier League clubs are permitted.` },
          { status: 400 }
        );
      }
    }

    const prediction = await db.seasonTablePrediction.upsert({
      where: { userId },
      update: {
        rankings: JSON.stringify(rankings),
        season: 2026,
        updatedAt: new Date(),
      },
      create: {
        userId,
        rankings: JSON.stringify(rankings),
        season: 2026,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your 2026/27 Premier League Season Table prediction has been saved!",
      prediction,
    });
  } catch (error: any) {
    console.error("Table prediction POST error:", error);
    return NextResponse.json({ error: "Failed to save table prediction." }, { status: 500 });
  }
}
