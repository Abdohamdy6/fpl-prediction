import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);

    const existingEmail = await db.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const existingUsername = await db.user.findUnique({
      where: { username: validatedData.username },
    });
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    const user = await db.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        username: validatedData.username,
        passwordHash,
        favoriteClubId: validatedData.favoriteClubId || null,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, username: user.username, email: user.email },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.errors?.[0]?.message || error.message || "Failed to register" },
      { status: 400 }
    );
  }
}
