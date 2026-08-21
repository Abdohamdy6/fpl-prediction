import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchCurrentGameweek } from "@/lib/api/pl-client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const requestedGw = searchParams.get("gw");
    let gameweekId = requestedGw ? parseInt(requestedGw, 10) : await fetchCurrentGameweek();

    if (isNaN(gameweekId) || gameweekId < 1 || gameweekId > 38) {
      gameweekId = 1;
    }

    // Ensure Gameweek record exists
    let gameweek = await db.gameweek.findUnique({
      where: { id: gameweekId },
      include: {
        matches: {
          include: {
            homeTeam: true,
            awayTeam: true,
            predictions: true,
          },
          orderBy: { kickoffTime: "asc" },
        },
      },
    });

    if (!gameweek) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 3);
      gameweek = await db.gameweek.create({
        data: {
          id: gameweekId,
          name: `Gameweek ${gameweekId}`,
          deadline,
          isCurrent: gameweekId === 1,
        },
        include: {
          matches: {
            include: {
              homeTeam: true,
              awayTeam: true,
              predictions: true,
            },
          },
        },
      });
    }

    const now = new Date();

    // Map matches with user predictions and REAL dynamic consensus only
    const matches = gameweek.matches.map((m) => {
      const isLocked = now >= new Date(m.kickoffTime);
      const userPred = userId
        ? m.predictions.find((p) => p.userId === userId)
        : null;

      // Calculate real community consensus only if predictions exist
      const totalPreds = m.predictions.length;
      let consensus = null;

      if (totalPreds > 0) {
        let homeWinCount = 0;
        let drawCount = 0;
        let awayWinCount = 0;

        for (const p of m.predictions) {
          if (p.predictedOutcome === "HOME_WIN") homeWinCount++;
          else if (p.predictedOutcome === "DRAW") drawCount++;
          else if (p.predictedOutcome === "AWAY_WIN") awayWinCount++;
        }

        consensus = {
          homeWinPct: Math.round((homeWinCount / totalPreds) * 100),
          drawPct: Math.round((drawCount / totalPreds) * 100),
          awayWinPct: Math.round((awayWinCount / totalPreds) * 100),
          totalPredictions: totalPreds,
        };
      }

      return {
        id: m.id,
        sportDataId: m.sportDataId,
        gameweekId: m.gameweekId,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        kickoffTime: m.kickoffTime,
        lockTime: m.lockTime,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        status: m.status,
        minuteElapsed: m.minuteElapsed,
        broadcastInfo: m.broadcastInfo || "Sky Sports / TNT / beIN",
        isPointsSettled: m.isPointsSettled,
        isLocked,
        userPrediction: userPred
          ? {
              predictedHomeScore: userPred.predictedHomeScore,
              predictedAwayScore: userPred.predictedAwayScore,
              predictedOutcome: userPred.predictedOutcome,
              pointsAwarded: userPred.pointsAwarded,
              isExactHit: userPred.isExactHit,
              isOutcomeHit: userPred.isOutcomeHit,
            }
          : null,
        consensus,
      };
    });

    return NextResponse.json({
      gameweek: {
        id: gameweek.id,
        name: gameweek.name,
        deadline: gameweek.deadline,
        isCurrent: gameweek.isCurrent,
        isCompleted: gameweek.isCompleted,
      },
      matches,
    });
  } catch (error: any) {
    console.error("Gameweek proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch gameweek data" }, { status: 500 });
  }
}
