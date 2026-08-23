import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const [listings, users, categories] = await Promise.all([
    prisma.listing.count(),
    prisma.user.count(),
    prisma.category.count(),
  ]);

  return NextResponse.json({ listings, users, categories });
}