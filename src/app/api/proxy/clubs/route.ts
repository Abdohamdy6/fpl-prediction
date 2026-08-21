import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ACTIVE_PL_CLUB_IDS, syncClubs } from "@/lib/api/pl-client";

export async function GET() {
  try {
    let clubs = await db.club.findMany({
      where: {
        id: { in: ACTIVE_PL_CLUB_IDS },
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    if (clubs.length === 0) {
      await syncClubs();
      clubs = await db.club.findMany({
        where: {
          id: { in: ACTIVE_PL_CLUB_IDS },
          isActive: true,
        },
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(
      { clubs },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    console.error("Clubs proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}
