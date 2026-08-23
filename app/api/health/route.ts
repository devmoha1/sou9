import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test la connexion à la BD
    const count = await prisma.user.count();

    return NextResponse.json({
      status: "ok",
      message: "Connexion à Prisma fonctionnelle",
      database: {
        users: count,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur de connexion à la base de données",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
