import { db } from "@/lib/db";

export interface ScoreResult {
  points: number;
  isExactHit: boolean;
  isOutcomeHit: boolean;
}

/**
 * Pure function to calculate points based on prediction and actual score
 */
export function calculatePredictionPoints(
  predHome: number,
  predAway: number,
  actualHome: number,
  actualAway: number
): ScoreResult {
  const isExactHit = predHome === actualHome && predAway === actualAway;
  
  const predOutcome =
    predHome > predAway ? "HOME_WIN" : predHome < predAway ? "AWAY_WIN" : "DRAW";
  const actualOutcome =
    actualHome > actualAway ? "HOME_WIN" : actualHome < actualAway ? "AWAY_WIN" : "DRAW";

  const isOutcomeHit = predOutcome === actualOutcome;

  if (isExactHit) {
    return { points: 3, isExactHit: true, isOutcomeHit: true };
  } else if (isOutcomeHit) {
    return { points: 1, isExactHit: false, isOutcomeHit: true };
  } else {
    return { points: 0, isExactHit: false, isOutcomeHit: false };
  }
}

/**
 * Settle all user predictions for a completed match
 */
export async function settleMatchPoints(matchId: string): Promise<number> {
  const match = await db.match.findUnique({
    where: { id: matchId },
    include: { predictions: true },
  });

  if (!match || match.homeScore === null || match.awayScore === null) {
    return 0;
  }

  const { homeScore, awayScore } = match;
  let settledCount = 0;

  for (const pred of match.predictions) {
    const result = calculatePredictionPoints(
      pred.predictedHomeScore,
      pred.predictedAwayScore,
      homeScore,
      awayScore
    );

    // If prediction was already scored, calculate difference
    const pointDelta = result.points - pred.pointsAwarded;
    const exactDelta = (result.isExactHit ? 1 : 0) - (pred.isExactHit ? 1 : 0);
    const outcomeDelta = (result.isOutcomeHit ? 1 : 0) - (pred.isOutcomeHit ? 1 : 0);

    await db.$transaction([
      db.prediction.update({
        where: { id: pred.id },
        data: {
          pointsAwarded: result.points,
          isExactHit: result.isExactHit,
          isOutcomeHit: result.isOutcomeHit,
        },
      }),
      db.user.update({
        where: { id: pred.userId },
        data: {
          totalPoints: { increment: pointDelta },
          exactScoreCount: { increment: exactDelta },
          correctOutcomeCount: { increment: outcomeDelta },
        },
      }),
    ]);
    settledCount++;
  }

  await db.match.update({
    where: { id: matchId },
    data: { isPointsSettled: true, status: "FINISHED" },
  });

  return settledCount;
}
