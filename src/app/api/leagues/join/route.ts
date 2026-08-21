import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { JoinLeagueSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { code } = JoinLeagueSchema.parse(body);

    const league = await db.league.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!league) {
      return NextResponse.json({ error: "No league found with this code." }, { status: 404 });
    }

    const existingMember = await db.leagueMember.findUnique({
      where: {
        leagueId_userId: {
          leagueId: league.id,
          userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "You are already a member of this league." }, { status: 400 });
    }

    await db.leagueMember.create({
      data: {
        leagueId: league.id,
        userId,
      },
    });

    return NextResponse.json({
      message: `Successfully joined ${league.name}!`,
      leagueId: league.id,
    });
  } catch (error: any) {
    console.error("League join error:", error);
    return NextResponse.json(
      { error: error.errors?.[0]?.message || error.message || "Failed to join league" },
      { status: 400 }
    );
  }
}
