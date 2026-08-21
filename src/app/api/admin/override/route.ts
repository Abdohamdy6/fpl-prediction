import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { settleMatchPoints } from "@/lib/scoring";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (process.env.NODE_ENV !== "development" && role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const { matchId, homeScore, awayScore, status = "FINISHED" } = await req.json();

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Missing matchId or scores" }, { status: 400 });
    }

    // 1. Update Match record
    const updatedMatch = await db.match.update({
      where: { id: matchId },
      data: {
        homeScore: parseInt(homeScore, 10),
        awayScore: parseInt(awayScore, 10),
        status,
        updatedAt: new Date(),
      },
    });

    // 2. Trigger point calculation & settlement if status is FINISHED
    let settledPredictions = 0;
    if (status === "FINISHED") {
      settledPredictions = await settleMatchPoints(matchId);
    }

    return NextResponse.json({
      message: `Score updated to ${homeScore}-${awayScore}. Settled ${settledPredictions} predictions.`,
      match: updatedMatch,
    });
  } catch (error: any) {
    console.error("Admin override error:", error);
    return NextResponse.json({ error: error.message || "Failed to update match" }, { status: 500 });
  }
}
