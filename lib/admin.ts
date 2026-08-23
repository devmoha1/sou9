import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";

export async function getAuthenticatedUser(request: NextRequest) {
  const userId = getAuthCookie(request);
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Accès réservé à l'administrateur" }, { status: 403 });
}