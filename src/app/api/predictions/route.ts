import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BatchPredictionSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const validatedData = BatchPredictionSchema.parse(body);

    const now = new Date();
    const savedPredictions = [];
    const lockedMatchErrors = [];

    for (const item of validatedData.predictions) {
      const match = await db.match.findUnique({
        where: { id: item.matchId },
      });

      if (!match) continue;

      // Lock verification
      if (now >= new Date(match.kickoffTime)) {
        lockedMatchErrors.push(match.id);
        continue;
      }

      const predictedOutcome =
        item.predictedHomeScore > item.predictedAwayScore
          ? "HOME_WIN"
          : item.predictedHomeScore < item.predictedAwayScore
          ? "AWAY_WIN"
          : "DRAW";

      const pred = await db.prediction.upsert({
        where: {
          userId_matchId: {
            userId,
            matchId: item.matchId,
          },
        },
        update: {
          predictedHomeScore: item.predictedHomeScore,
          predictedAwayScore: item.predictedAwayScore,
          predictedOutcome,
          gameweekId: validatedData.gameweekId,
          updatedAt: new Date(),
        },
        create: {
          userId,
          matchId: item.matchId,
          gameweekId: validatedData.gameweekId,
          predictedHomeScore: item.predictedHomeScore,
          predictedAwayScore: item.predictedAwayScore,
          predictedOutcome,
        },
      });

      savedPredictions.push(pred);
    }

    return NextResponse.json({
      message: `Successfully saved ${savedPredictions.length} predictions`,
      savedCount: savedPredictions.length,
      lockedMatches: lockedMatchErrors,
    });
  } catch (error: any) {
    console.error("Prediction submission error:", error);
    return NextResponse.json(
      { error: error.errors?.[0]?.message || error.message || "Failed to submit predictions" },
      { status: 400 }
    );
  }
}
