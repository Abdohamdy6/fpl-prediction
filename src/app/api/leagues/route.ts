import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateLeagueSchema } from "@/lib/zod-schemas";
import { generateLeagueCode } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const leagues = await db.league.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        creator: {
          select: { id: true, username: true },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                totalPoints: true,
                exactScoreCount: true,
                correctOutcomeCount: true,
                favoriteClub: true,
              },
            },
          },
        },
      },
    });

    // Rank members within each league
    const formattedLeagues = leagues.map((league) => {
      const sortedMembers = league.members
        .map((m) => m.user)
        .sort((a, b) => b.totalPoints - a.totalPoints);

      const userRank = sortedMembers.findIndex((u) => u.id === userId) + 1;

      return {
        id: league.id,
        name: league.name,
        code: league.code,
        creator: league.creator,
        memberCount: league.members.length,
        userRank,
        leaderboard: sortedMembers,
      };
    });

    return NextResponse.json({ leagues: formattedLeagues });
  } catch (error: any) {
    console.error("Leagues fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leagues" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name } = CreateLeagueSchema.parse(body);

    const code = generateLeagueCode();

    const league = await db.league.create({
      data: {
        name,
        code,
        creatorId: userId,
        members: {
          create: {
            userId,
          },
        },
      },
    });

    return NextResponse.json({ message: "League created", league }, { status: 201 });
  } catch (error: any) {
    console.error("League create error:", error);
    return NextResponse.json(
      { error: error.errors?.[0]?.message || error.message || "Failed to create league" },
      { status: 400 }
    );
  }
}
