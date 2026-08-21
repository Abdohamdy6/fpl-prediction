import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncClubs } from "@/lib/api/pl-client";

export async function GET() {
  try {
    let clubs = await db.club.findMany({
      orderBy: { name: "asc" },
    });

    if (clubs.length === 0) {
      await syncClubs();
      clubs = await db.club.findMany({
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json({ clubs });
  } catch (error: any) {
    console.error("Clubs proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}
