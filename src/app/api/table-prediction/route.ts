import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { OFFICIAL_CLUB_MAP } from "@/lib/api/pl-client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Fetch all 20 clubs
    const clubs = await db.club.findMany({
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
          userPrediction = {
            id: pred.id,
            rankings: JSON.parse(pred.rankings) as string[],
            pointsEarned: pred.pointsEarned,
            isSettled: pred.isSettled,
            updatedAt: pred.updatedAt,
          };
        } catch {
          userPrediction = null;
        }
      }
    }

    return NextResponse.json({
      clubs,
      seasonKickoffTime,
      isLocked,
      userPrediction,
    });
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

    // Ensure all 20 IDs are unique
    const uniqueClubs = new Set(rankings);
    if (uniqueClubs.size !== 20) {
      return NextResponse.json(
        { error: "Duplicate clubs found. Exactly 20 unique clubs required." },
        { status: 400 }
      );
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
