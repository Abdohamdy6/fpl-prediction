import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        select: {
          id: true,
          username: true,
          totalPoints: true,
          exactScoreCount: true,
          correctOutcomeCount: true,
          favoriteClub: {
            select: {
              name: true,
              abbr: true,
              crestUrl: true,
              primaryColor: true,
            },
          },
        },
        orderBy: [
          { totalPoints: "desc" },
          { exactScoreCount: "desc" },
          { correctOutcomeCount: "desc" },
        ],
        take: limit,
        skip,
      }),
      db.user.count(),
    ]);

    const rankedUsers = users.map((u, index) => ({
      rank: skip + index + 1,
      ...u,
    }));

    return NextResponse.json({
      leaderboard: rankedUsers,
      pagination: {
        page,
        limit,
        totalUsers: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
