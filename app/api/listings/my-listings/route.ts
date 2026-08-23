import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthCookie(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const myListings = await prisma.listing.findMany({
      where: { sellerId: userId },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(myListings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
